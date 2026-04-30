// pages/api/subscribe-newsletter.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, turnstileToken } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // --- Cloudflare Turnstile Verification ---
  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return res.status(400).json({ message: 'CAPTCHA verification required' });
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
        return res.status(400).json({ message: 'CAPTCHA verification failed. Please try again.' });
      }
    } catch {
      // If Turnstile service is unreachable, allow through
    }
  }

  try {
    // --- 1. Send to Apollo (Create/Update & Add to List) ---
    if (process.env.APOLLO_API_KEY) {
      try {
        const listId = process.env.APOLLO_LIST_ID_NEWSLETTER;
        
        // List assignment alone identifies these contacts as newsletter
        // subscribers. The previous `custom_fields: { initial_message: ... }`
        // used a non-ID key and was silently dropped by Apollo.
        const apolloPayload = {
          api_key: process.env.APOLLO_API_KEY,
          email: email,
          source: 'newsletter_form',
          label_ids: listId ? [listId] : [],
        };

        const apolloRes = await fetch('https://api.apollo.io/v1/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apolloPayload),
        });

        if (apolloRes.ok) {
          console.log(`✅ Added ${email} to Apollo Newsletter List`);
        } else {
          const err = await apolloRes.json();
          console.error("❌ Apollo Error:", err);
        }
      } catch (apolloErr) {
        console.error("Apollo Connection Failed:", apolloErr);
      }
    }

    // --- 2. Check Duplicate in Strapi ---
    const { getStrapiApiUrl } = await import('@/utils/strapi');
    const strapiUrl = getStrapiApiUrl();
    if (!strapiUrl) return res.status(500).json({ message: 'Backend not configured' });

    const checkRes = await fetch(`${strapiUrl}/api/newsletters?filters[email][$eq]=${email}`);
    const checkData = await checkRes.json();

    if (checkData.data && checkData.data.length > 0) {
      // Email already exists in Strapi
      return res.status(409).json({ message: 'This email is already subscribed.' });
    }

    // --- 3. Create in Strapi ---
    const createRes = await fetch(`${strapiUrl}/api/newsletters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}` // Uncomment if needed
      },
      body: JSON.stringify({
        data: { email: email },
      }),
    });

    if (!createRes.ok) {
      console.error("Strapi Error:", await createRes.text());
      return res.status(500).json({ message: 'Failed to save subscription' });
    }

    return res.status(200).json({ success: true, message: 'Thank you for subscribing!' });

  } catch (error) {
    console.error("Newsletter API Error:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}