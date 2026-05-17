// pages/api/submit-contact-form.js

import { sendSlackNotification } from '@/utils/slack';
import { dispatchAlert } from '@/utils/alerts';
import { isSyntheticRequest, syntheticOkResponse } from '@/utils/monitor';

export default async function handler(req, res) {
  // 1. Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const synthetic = isSyntheticRequest(req);

  try {
    // Support both `{ data: {...} }` and direct `{...}` payloads
    const bodyData = (req.body && (req.body.data || req.body)) || {};
    // Extract fields
    const firstName = bodyData.firstName || "";
    const lastName = bodyData.lastName || "";
    const email = bodyData.email || "";
    const phone = bodyData.phone || "";
    const companyName = bodyData.companyName || "";
    const servicesArr = Array.isArray(bodyData.servicesNeeded) ? bodyData.servicesNeeded : [];
    const sourcesArr = Array.isArray(bodyData.leadSource) ? bodyData.leadSource : [];
    const services = servicesArr.join(', ');
    const sources = sourcesArr.join(', ');
    const userMessage = bodyData.message || "";
    const turnstileToken = bodyData.turnstileToken || "";

    let apolloSuccess = false;
    let strapiSuccess = false;
    let errorDetails = [];

    // --- 2. Cloudflare Turnstile Verification ---
    // Skipped in synthetic mode: the detector Lambda cannot produce real
    // Turnstile tokens, and short-circuiting here is exactly the point of
    // the dry-run path.
    if (!synthetic && process.env.TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return res.status(400).json({
          success: false,
          message: "CAPTCHA verification required",
        });
      }

      try {
        const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: turnstileToken,
          }),
        });
        const turnstileData = await turnstileRes.json();

        if (!turnstileData.success) {
          return res.status(400).json({
            success: false,
            message: "CAPTCHA verification failed. Please try again.",
          });
        }
      } catch {
        // If Turnstile service is unreachable, allow the submission through
      }
    }

    // --- 3. Apollo Submission (Primary) ---
    if (!process.env.APOLLO_API_KEY) {
      if (!synthetic) {
        void dispatchAlert({
          checkKey: 'forms.contact.config',
          severity: 'CRITICAL',
          title: 'Contact form misconfigured — APOLLO_API_KEY missing',
          body: 'Real users are hitting the contact form and getting a 500. Set APOLLO_API_KEY in Amplify environment variables.',
          context: { formType: 'contact', userEmail: email },
        });
      }
      return res.status(500).json({
        success: false,
        synthetic,
        message: "Server configuration error: APOLLO_API_KEY is missing",
      });
    }

    // Basic validation so Apollo doesn't receive empty records
    if (!email || !firstName || !lastName || !companyName || !phone || !userMessage) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        details: {
          email: !!email,
          firstName: !!firstName,
          lastName: !!lastName,
          companyName: !!companyName,
          phone: !!phone,
          message: !!userMessage,
        },
      });
    }

    try {
      const targetListId = process.env.APOLLO_LIST_ID_CONTACT_FORM;

      // Apollo's typed_custom_fields require their internal field IDs (24-char
      // ObjectIDs) and must be sent as a MAP { "<field_id>": value }, not an
      // array. The array form returns 422 "There is something wrong with your
      // request." Field IDs come from Apollo's GET /v1/typed_custom_fields.
      const messageFieldId = process.env.APOLLO_FIELD_ID_MESSAGE;
      const servicesFieldId = process.env.APOLLO_FIELD_ID_SERVICES_NEEDED;
      const typedCustomFields = {};
      if (messageFieldId && userMessage) {
        typedCustomFields[messageFieldId] = userMessage;
      }
      if (servicesFieldId && servicesArr.length > 0) {
        typedCustomFields[servicesFieldId] = services;
      }

      const apolloPayload = {
        api_key: process.env.APOLLO_API_KEY,
        first_name: firstName,
        last_name: lastName,
        email: email,
        organization_name: companyName,
        phone_number: phone,
        label_ids: targetListId ? [targetListId] : [],
      };
      // Only set `source` when user actually picked one — Apollo can reject
      // arbitrary placeholder strings like "None".
      if (sourcesArr.length > 0) apolloPayload.source = sources;
      if (Object.keys(typedCustomFields).length > 0) {
        apolloPayload.typed_custom_fields = typedCustomFields;
      }

      // Synthetic mode: payload constructed successfully, env vars are
      // present, field mapping resolved. Skip Apollo/Slack/Strapi I/O.
      if (synthetic) {
        return res.status(200).json(syntheticOkResponse({
          checks: {
            envVars: true,
            payloadConstructed: true,
            fieldMappingResolved: true,
          },
        }));
      }

      const apolloResponse = await fetch('https://api.apollo.io/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(apolloPayload),
      });

      const apolloText = await apolloResponse.text();
      let apolloData = null;
      try {
        apolloData = apolloText ? JSON.parse(apolloText) : null;
      } catch {
        apolloData = { raw: apolloText };
      }

      if (!apolloResponse.ok) {
        void dispatchAlert({
          checkKey: 'forms.contact.apollo',
          severity: 'CRITICAL',
          title: `Apollo rejected contact form submission (HTTP ${apolloResponse.status})`,
          body: 'A real user submitted the contact form and Apollo refused the request. Lead was lost unless the Strapi backup also caught it.',
          context: {
            formType: 'contact',
            userEmail: email,
            apolloStatus: apolloResponse.status,
            apolloResponse: apolloData,
          },
        });
        return res.status(400).json({
          success: false,
          message: "Apollo rejected the entry",
          details: apolloData,
        });
      }

      apolloSuccess = true;
    } catch (apolloErr) {
      void dispatchAlert({
        checkKey: 'forms.contact.apollo_unreachable',
        severity: 'CRITICAL',
        title: 'Apollo unreachable from contact form handler',
        body: 'fetch() to api.apollo.io threw — network issue, timeout, or DNS. Lead was lost.',
        context: {
          formType: 'contact',
          userEmail: email,
          error: apolloErr?.message || String(apolloErr),
        },
      });
      return res.status(500).json({
        success: false,
        message: "Apollo submission failed (server error)",
        details: apolloErr?.message || String(apolloErr),
      });
    }

    // --- 4. Slack Notification ---
    await sendSlackNotification({
      formType: 'Contact Form',
      fields: {
        'Name': `${firstName} ${lastName}`,
        'Email': email,
        'Phone': phone,
        'Company': companyName,
        'Services Needed': services,
        'Lead Source': sources,
        'Message': userMessage,
      },
    });

    // --- 5. Attempt Strapi Submission (Backup) ---
    const { getStrapiApiUrl } = await import('@/utils/strapi');
    const strapiBase = getStrapiApiUrl();
    if (strapiBase) {
      try {
        const strapiRes = await fetch(`${strapiBase}/api/contact-form-submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              firstName,
              lastName,
              email,
              companyName,
            }
          }),
        });

        if (strapiRes.ok) {
          strapiSuccess = true;
        } else {
          const errorText = await strapiRes.text();
          let strapiErrorMessage = `Strapi save failed (${strapiRes.status})`;
          try {
            const strapiJson = JSON.parse(errorText);
            if (strapiJson.error && strapiJson.error.message) {
              strapiErrorMessage += `: ${strapiJson.error.message}`;
            }
          } catch (e) {
            if (errorText.length < 200) strapiErrorMessage += `: ${errorText}`;
          }
          errorDetails.push(strapiErrorMessage);
          void dispatchAlert({
            checkKey: 'forms.contact.strapi_backup',
            severity: 'HIGH',
            title: `Strapi backup write failed (${strapiRes.status})`,
            body: 'Apollo accepted the lead but the Strapi backup write failed. Lead is safe in Apollo. Investigate Strapi.',
            context: { formType: 'contact', userEmail: email, error: strapiErrorMessage },
          });
        }
      } catch (strapiErr) {
        errorDetails.push("Strapi connection failed");
        void dispatchAlert({
          checkKey: 'forms.contact.strapi_unreachable',
          severity: 'HIGH',
          title: 'Strapi unreachable from contact form handler',
          body: 'Apollo accepted the lead but Strapi backup write threw. Lead is safe in Apollo.',
          context: { formType: 'contact', userEmail: email, error: strapiErr?.message || String(strapiErr) },
        });
      }
    }

    // --- 6. Return Success if At Least One Succeeded ---
    if (apolloSuccess || strapiSuccess) {
      return res.status(200).json({
        success: true,
        message: 'Submitted successfully',
        apolloSuccess,
        strapiSuccess,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Submission failed. System configuration issue.',
      details: errorDetails
    });

  } catch (error) {
    if (!synthetic) {
      void dispatchAlert({
        checkKey: 'forms.contact.handler_crash',
        severity: 'CRITICAL',
        title: 'Contact form handler threw an unhandled exception',
        body: 'The form handler crashed unexpectedly. Investigate immediately.',
        context: { formType: 'contact', error: error?.message || String(error) },
      });
    }
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
}
