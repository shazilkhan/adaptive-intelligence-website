// pages/api/submit-contact-form.js

import { sendSlackNotification } from '@/utils/slack';

export default async function handler(req, res) {
  // 1. Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Support both `{ data: {...} }` and direct `{...}` payloads
    const bodyData = (req.body && (req.body.data || req.body)) || {};
    // Extract fields
    const firstName = bodyData.firstName || "";
    const lastName = bodyData.lastName || "";
    const email = bodyData.email || "";
    const phone = bodyData.phone || "";
    const companyName = bodyData.companyName || "";
    const services = Array.isArray(bodyData.servicesNeeded) ? bodyData.servicesNeeded.join(', ') : "None";
    const sources = Array.isArray(bodyData.leadSource) ? bodyData.leadSource.join(', ') : "None";
    const userMessage = bodyData.message || "";
    const turnstileToken = bodyData.turnstileToken || "";

    let apolloSuccess = false;
    let strapiSuccess = false;
    let errorDetails = [];

    // --- 2. Cloudflare Turnstile Verification ---
    if (process.env.TURNSTILE_SECRET_KEY) {
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
      return res.status(500).json({
        success: false,
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
      const apolloPayload = {
        api_key: process.env.APOLLO_API_KEY,
        first_name: firstName,
        last_name: lastName,
        email: email,
        organization_name: companyName,
        label_ids: targetListId ? [targetListId] : [],
        typed_custom_fields: [
          { id: "phone_number", value: phone },
          { id: "message", value: userMessage },
          { id: "services_needed", value: services },
          { id: "lead_source", value: sources },
        ],
      };

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
        return res.status(400).json({
          success: false,
          message: "Apollo rejected the entry",
          details: apolloData,
        });
      }

      apolloSuccess = true;
    } catch (apolloErr) {
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
        }
      } catch (strapiErr) {
        errorDetails.push("Strapi connection failed");
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
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
}
