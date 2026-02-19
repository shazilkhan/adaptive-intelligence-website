export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Minimal logging: keep errors actionable without noisy debug output

  // 1. Debug Env Vars
  const apiKey = process.env.APOLLO_API_KEY;
  const listId = process.env.APOLLO_LIST_ID_LETS_TALK;

  if (!apiKey) {
    return res.status(500).json({ message: "Server configuration error" });
  }
  if (!listId) {
    // list is optional; contact can still be created without it
  }

  try {
    // Support both `{ data: {...} }` and direct `{...}` payloads
    const bodyData = (req.body && (req.body.data || req.body)) || {};
    const { firstName, lastName, email, company, message } = bodyData;

    // (intentionally no verbose console logging here)

    // Validate required fields (prevents Apollo rejections + hard-to-debug empty payloads)
    if (!firstName || !lastName || !email || !company || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        details: {
          firstName: !!firstName,
          lastName: !!lastName,
          email: !!email,
          company: !!company,
          message: !!message,
        },
      });
    }

    // 2. Prepare Payload
    const apolloPayload = {
      api_key: apiKey,
      first_name: firstName,
      last_name: lastName,
      email: email,
      organization_name: company,
      // Add to List (Label)
      label_ids: listId ? [listId] : [],
      // Note: If 'initial_message' custom field doesn't exist in Apollo, this might be ignored, which is fine.
      // custom_fields removed as Apollo configuration does not accept message field
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

    // 3. Send to Apollo
    const apolloResponse = await fetchWithTimeout('https://api.apollo.io/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(apolloPayload),
    });

    // Apollo may return non-JSON on certain errors; avoid crashing the route on `.json()`
    const apolloText = await apolloResponse.text();
    let contactData = null;
    try {
      contactData = apolloText ? JSON.parse(apolloText) : null;
    } catch {
      contactData = { raw: apolloText };
    }

    // 4. Check Apollo Response
    if (!apolloResponse.ok) {
      // Return error to frontend so we know it failed
      return res.status(400).json({
        success: false,
        message: "Apollo rejected the entry",
        details: contactData
      });
    }

    // 5. Save to Strapi (Backup)
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