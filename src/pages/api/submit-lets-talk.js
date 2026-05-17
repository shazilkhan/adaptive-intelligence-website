import { sendSlackNotification } from '@/utils/slack';
import { dispatchAlert } from '@/utils/alerts';
import { isSyntheticRequest, syntheticOkResponse } from '@/utils/monitor';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const synthetic = isSyntheticRequest(req);

  // 1. Check env
  const apiKey = process.env.APOLLO_API_KEY;
  const listId = process.env.APOLLO_LIST_ID_LETS_TALK;

  if (!apiKey) {
    if (!synthetic) {
      void dispatchAlert({
        checkKey: 'forms.letstalk.config',
        severity: 'CRITICAL',
        title: "Let's Talk form misconfigured — APOLLO_API_KEY missing",
        body: 'Real users are hitting the form and getting a 500. Set APOLLO_API_KEY in Amplify environment variables.',
        context: { formType: 'letstalk' },
      });
    }
    return res.status(500).json({ message: "Server configuration error", synthetic });
  }

  try {
    // Support both `{ data: {...} }` and direct `{...}` payloads
    const bodyData = (req.body && (req.body.data || req.body)) || {};
    const { firstName, lastName, email, company, phone, message, turnstileToken } = bodyData;

    // --- 2. Cloudflare Turnstile Verification ---
    // Skipped in synthetic mode (Lambda cannot produce real tokens).
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
        // If Turnstile service is unreachable, allow through
      }
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        details: {
          firstName: !!firstName,
          lastName: !!lastName,
          email: !!email,
          company: !!company,
          phone: !!phone,
          message: !!message,
        },
      });
    }

    // 3. Prepare Apollo Payload with all fields
    // typed_custom_fields require Apollo's internal field IDs and must be a MAP
    // (not an array). Field IDs come from Apollo's GET /v1/typed_custom_fields.
    const messageFieldId = process.env.APOLLO_FIELD_ID_MESSAGE;
    const apolloPayload = {
      api_key: apiKey,
      first_name: firstName,
      last_name: lastName,
      email: email,
      organization_name: company,
      phone_number: phone,
      label_ids: listId ? [listId] : [],
    };
    if (messageFieldId && message) {
      apolloPayload.typed_custom_fields = { [messageFieldId]: message };
    }

    // Synthetic mode: env vars present, payload built, field mapping good.
    if (synthetic) {
      return res.status(200).json(syntheticOkResponse({
        checks: { envVars: true, payloadConstructed: true, fieldMappingResolved: true },
      }));
    }

    const fetchWithTimeout = async (url, options, timeoutMs = 12000) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(url, { ...options, signal: controller.signal });
      } finally {
        clearTimeout(timeout);
      }
    };

    // 4. Send to Apollo
    const apolloResponse = await fetchWithTimeout('https://api.apollo.io/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(apolloPayload),
    });

    const apolloText = await apolloResponse.text();
    let contactData = null;
    try {
      contactData = apolloText ? JSON.parse(apolloText) : null;
    } catch {
      contactData = { raw: apolloText };
    }

    // 5. Check Apollo Response
    if (!apolloResponse.ok) {
      void dispatchAlert({
        checkKey: 'forms.letstalk.apollo',
        severity: 'CRITICAL',
        title: `Apollo rejected Let's Talk submission (HTTP ${apolloResponse.status})`,
        body: "A real user submitted the Let's Talk form and Apollo refused. Lead was lost.",
        context: {
          formType: 'letstalk',
          userEmail: email,
          apolloStatus: apolloResponse.status,
          apolloResponse: contactData,
        },
      });
      return res.status(400).json({
        success: false,
        message: "Apollo rejected the entry",
        details: contactData
      });
    }

    // 6. Slack Notification
    await sendSlackNotification({
      formType: "Let's Talk",
      fields: {
        'Name': `${firstName} ${lastName}`,
        'Email': email,
        'Phone': phone,
        'Company': company,
        'Message': message,
      },
    });

    // 7. Save to Strapi (Backup)
    try {
      const { getStrapiApiUrl } = await import('@/utils/strapi');
      const strapiBase = getStrapiApiUrl();
      if (strapiBase) {
        await fetchWithTimeout(`${strapiBase}/api/contact-form-submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              firstName, lastName, email, company, message,
              submittedAt: new Date().toISOString(),
            }
          }),
        }, 12000);
      }
    } catch (strapiErr) {
      // backup failure shouldn't block Apollo success
      void dispatchAlert({
        checkKey: 'forms.letstalk.strapi_unreachable',
        severity: 'HIGH',
        title: "Strapi backup failed for Let's Talk submission",
        body: 'Apollo accepted the lead but the Strapi backup write threw. Lead is safe in Apollo.',
        context: { formType: 'letstalk', userEmail: email, error: strapiErr?.message || String(strapiErr) },
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    if (!synthetic) {
      void dispatchAlert({
        checkKey: 'forms.letstalk.handler_crash',
        severity: 'CRITICAL',
        title: "Let's Talk handler threw an unhandled exception",
        body: 'The form handler crashed unexpectedly. Investigate immediately.',
        context: { formType: 'letstalk', error: error?.message || String(error) },
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
}
