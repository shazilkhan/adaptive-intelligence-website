// pages/api/track-download.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, slug, title } = req.body;

  if (!email || !slug) {
    return res.status(400).json({ message: 'Missing email or slug' });
  }

  try {
    // --- 1. Send to Apollo (Create/Update Contact & Add to List) ---
    if (process.env.APOLLO_API_KEY && process.env.APOLLO_LIST_ID_DOWNLOADS) {
      try {
        const apolloPayload = {
          api_key: process.env.APOLLO_API_KEY,
          email: email,
          // Add to the specific Download List
          label_ids: [process.env.APOLLO_LIST_ID_DOWNLOADS],
          custom_fields: {
            "initial_message": `Downloaded Resource: ${title} (${slug})`
          }
          // Note: We don't have First/Last name here based on your URL params, 
          // so Apollo will try to enrich it or just create it with Email.
        };

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
    const strapiResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/case-study-downloads`, {
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