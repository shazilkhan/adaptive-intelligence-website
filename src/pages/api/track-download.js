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
    // Save to Strapi Collection: 'case-study-downloads'
    // Ensure this collection exists in Strapi with fields: email (Text), resource_slug (Text), resource_title (Text)
    const strapiResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/case-study-downloads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}` // Uncomment if needed
      },
      body: JSON.stringify({
        data: {
          email: email,
          resource_slug: slug,
          resource_title: title,
          downloaded_at: new Date().toISOString(),
          publishedAt: new Date().toISOString() // Publish immediately
        }
      }),
    });

    if (!strapiResponse.ok) {
      console.error("Strapi Tracking Failed:", await strapiResponse.text());
      return res.status(500).json({ message: 'Failed to track in Strapi' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Tracking API Error:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}