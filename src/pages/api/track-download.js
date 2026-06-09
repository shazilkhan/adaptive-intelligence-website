// pages/api/track-download.js

import { handleHeartbeat } from '@/utils/monitor/heartbeat';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Monitor heartbeat: short-circuit before any real submission logic.
  if (handleHeartbeat(req, res, ['APOLLO_API_KEY'])) return;

  const { email, slug, title } = req.body;

  if (!email || !slug) {
    return res.status(400).json({ message: 'Missing email or slug' });
  }

  try {
    // --- 1. Send to Apollo (Create/Update Contact & Add to List) ---
    if (process.env.APOLLO_API_KEY && process.env.APOLLO_LIST_ID_DOWNLOADS) {
      try {
        // typed_custom_fields must be a MAP keyed by Apollo's internal field ID.
        // The previous `custom_fields: { initial_message: ... }` used a non-ID
        // key and was silently dropped by Apollo. We reuse the "message" field
        // since it's already configured for this kind of free-text payload.
        const messageFieldId = process.env.APOLLO_FIELD_ID_MESSAGE;
        const apolloPayload = {
          api_key: process.env.APOLLO_API_KEY,
          email: email,
          source: 'download_form',
          label_ids: [process.env.APOLLO_LIST_ID_DOWNLOADS],
        };
        if (messageFieldId) {
          apolloPayload.typed_custom_fields = {
            [messageFieldId]: `Downloaded Resource: ${title || ''} (${slug})`,
          };
        }

        const apolloRes = await fetch('https://api.apollo.io/v1/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apolloPayload),
        });

        if (apolloRes.ok) {
          console.log(`✅ Added ${email} to Apollo Download List`);
        } else {
          console.error("❌ Apollo Error:", await apolloRes.text());
        }
      } catch (apolloErr) {
        console.error("Apollo Connection Failed:", apolloErr);
      }
    }

    // --- 2. Save to Strapi (Existing Logic) ---
    const { getStrapiApiUrl } = await import('@/utils/strapi');
    const strapiResponse = await fetch(`${getStrapiApiUrl()}/api/case-study-downloads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          email: email,
          resource_slug: slug,
          resource_title: title,
          downloaded_at: new Date().toISOString(),
          publishedAt: new Date().toISOString()
        }
      }),
    });

    if (!strapiResponse.ok) {
      console.error("Strapi Tracking Failed:", await strapiResponse.text());
      // We don't return 500 here if Apollo succeeded, just log it.
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Tracking API Error:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}