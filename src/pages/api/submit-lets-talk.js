import { sendSlackNotification } from '@/utils/slack';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 1. Check env
  const apiKey = process.env.APOLLO_API_KEY;
  const listId = process.env.APOLLO_LIST_ID_LETS_TALK;

  if (!apiKey) {
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    // Support both `{ data: {...} }` and direct `{...}` payloads
    const bodyData = (req.body && (req.body.data || req.body)) || {};
    const { firstName, lastName, email, company, phone, message, turnstileToken } = bodyData;

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
    const apolloPayload = {
      api_key: apiKey,
      first_name: firstName,
      last_name: lastName,
      email: email,
      organization_name: company,
      phone_number: phone,
      label_ids: listId ? [listId] : [],
      typed_custom_fields: [
        { id: "message", value: message },
      ],
    };

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
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
