// pages/api/track-download.js

import { dispatchAlert } from '@/utils/alerts';
import { isSyntheticRequest, syntheticOkResponse } from '@/utils/monitor';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const synthetic = isSyntheticRequest(req);
  const { email, slug, title } = req.body;

  if (!email || !slug) {
    return res.status(400).json({ message: 'Missing email or slug' });
  }

  // Synthetic mode: required fields validated. Apollo and Strapi reachability
  // are checked separately by the detector; skip the side-effecting writes.
  if (synthetic) {
    return res.status(200).json(syntheticOkResponse({
      checks: { emailPresent: true, slugPresent: true },
    }));
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
          const apolloErrText = await apolloRes.text();
          console.error("❌ Apollo Error:", apolloErrText);
          void dispatchAlert({
            checkKey: 'forms.download.apollo',
            severity: 'HIGH',
            title: `Apollo rejected download tracking (HTTP ${apolloRes.status})`,
            body: 'Resource download tracking failed at Apollo. Strapi tracking may still record it.',
            context: { formType: 'download', userEmail: email, resource: slug, apolloStatus: apolloRes.status, apolloBody: apolloErrText?.slice(0, 500) },
          });
        }
      } catch (apolloErr) {
        console.error("Apollo Connection Failed:", apolloErr);
        void dispatchAlert({
          checkKey: 'forms.download.apollo_unreachable',
          severity: 'HIGH',
          title: 'Apollo unreachable from download tracking handler',
          body: 'Network or timeout error reaching api.apollo.io for a resource download.',
          context: { formType: 'download', userEmail: email, resource: slug, error: apolloErr?.message || String(apolloErr) },
        });
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
      const strapiErrText = await strapiResponse.text();
      console.error("Strapi Tracking Failed:", strapiErrText);
      void dispatchAlert({
        checkKey: 'forms.download.strapi',
        severity: 'MEDIUM',
        title: `Strapi rejected download tracking (HTTP ${strapiResponse.status})`,
        body: 'Resource download not recorded in Strapi case-study-downloads.',
        context: { formType: 'download', userEmail: email, resource: slug, strapiStatus: strapiResponse.status, strapiBody: strapiErrText?.slice(0, 500) },
      });
      // We don't return 500 here if Apollo succeeded, just log it.
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Tracking API Error:", error);
    void dispatchAlert({
      checkKey: 'forms.download.handler_crash',
      severity: 'HIGH',
      title: 'Download tracking handler threw an unhandled exception',
      body: 'The download tracking handler crashed unexpectedly.',
      context: { formType: 'download', error: error?.message || String(error) },
    });
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}