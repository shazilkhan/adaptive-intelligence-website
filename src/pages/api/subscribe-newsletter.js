// pages/api/subscribe-newsletter.js

import { dispatchAlert } from '@/utils/alerts';
import { isSyntheticRequest, syntheticOkResponse } from '@/utils/monitor';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const synthetic = isSyntheticRequest(req);
  const { email, turnstileToken } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // --- Cloudflare Turnstile Verification ---
  // Skipped in synthetic mode (Lambda cannot produce real tokens).
  if (!synthetic && process.env.TURNSTILE_SECRET_KEY) {
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
    // Skipped in synthetic mode: Apollo reachability is covered by the
    // detector's external-dep check, and newsletter's Apollo payload is
    // trivial enough not to need payload-construction validation.
    if (!synthetic && process.env.APOLLO_API_KEY) {
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
          const err = await apolloRes.json().catch(() => ({}));
          console.error("❌ Apollo Error:", err);
          void dispatchAlert({
            checkKey: 'forms.newsletter.apollo',
            severity: 'HIGH',
            title: `Apollo rejected newsletter signup (HTTP ${apolloRes.status})`,
            body: 'Strapi will still record the subscriber, but Apollo did not add them to the newsletter list.',
            context: { formType: 'newsletter', userEmail: email, apolloStatus: apolloRes.status, apolloResponse: err },
          });
        }
      } catch (apolloErr) {
        console.error("Apollo Connection Failed:", apolloErr);
        void dispatchAlert({
          checkKey: 'forms.newsletter.apollo_unreachable',
          severity: 'HIGH',
          title: 'Apollo unreachable from newsletter handler',
          body: 'Network or timeout error reaching api.apollo.io. Strapi may still record the subscriber.',
          context: { formType: 'newsletter', userEmail: email, error: apolloErr?.message || String(apolloErr) },
        });
      }
    }

    // --- 2. Check Duplicate in Strapi ---
    const { getStrapiApiUrl } = await import('@/utils/strapi');
    const strapiUrl = getStrapiApiUrl();
    if (!strapiUrl) {
      if (!synthetic) {
        void dispatchAlert({
          checkKey: 'forms.newsletter.config',
          severity: 'CRITICAL',
          title: 'Newsletter form misconfigured — Strapi URL not set',
          body: 'NEXT_PUBLIC_STRAPI_API_URL (or AWS equivalent) is missing. Newsletter signups return 500.',
          context: { formType: 'newsletter', userEmail: email },
        });
      }
      return res.status(500).json({ message: 'Backend not configured', synthetic });
    }

    // Synthetic mode: all preflight checks passed (email present, Strapi
    // configured). Skip the dupe-check fetch + create write.
    if (synthetic) {
      return res.status(200).json(syntheticOkResponse({
        checks: { emailPresent: true, strapiConfigured: true },
      }));
    }

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
      const errText = await createRes.text();
      console.error("Strapi Error:", errText);
      void dispatchAlert({
        checkKey: 'forms.newsletter.strapi',
        severity: 'CRITICAL',
        title: `Strapi rejected newsletter create (HTTP ${createRes.status})`,
        body: 'Newsletter signup failed at the Strapi write step. User saw a 500.',
        context: { formType: 'newsletter', userEmail: email, strapiStatus: createRes.status, strapiBody: errText?.slice(0, 500) },
      });
      return res.status(500).json({ message: 'Failed to save subscription' });
    }

    return res.status(200).json({ success: true, message: 'Thank you for subscribing!' });

  } catch (error) {
    console.error("Newsletter API Error:", error);
    if (!synthetic) {
      void dispatchAlert({
        checkKey: 'forms.newsletter.handler_crash',
        severity: 'CRITICAL',
        title: 'Newsletter handler threw an unhandled exception',
        body: 'The form handler crashed unexpectedly. Investigate immediately.',
        context: { formType: 'newsletter', error: error?.message || String(error) },
      });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}