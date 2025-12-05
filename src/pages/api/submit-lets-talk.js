export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log("🚀 API Route Hit: /api/submit-lets-talk");

  // 1. Debug Env Vars
  const apiKey = process.env.APOLLO_API_KEY;
  const listId = process.env.APOLLO_LIST_ID_LETS_TALK;

  if (!apiKey) {
    console.error("❌ CRITICAL: APOLLO_API_KEY is missing in .env.local");
    return res.status(500).json({ message: "Server configuration error" });
  }
  if (!listId) {
    console.warn("⚠️ WARNING: APOLLO_LIST_ID_LETS_TALK is missing. Contact will be created but not added to list.");
  } else {
    console.log("ℹ️ Target List ID:", listId);
  }

  try {
    const bodyData = req.body.data || {};
    const { firstName, lastName, email, company, message } = bodyData;

    console.log("👉 Processing Submission:", email);

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
      custom_fields: {
        "initial_message": message || "No message provided"
      }
    };

    console.log("📤 Sending payload to Apollo...");

    // 3. Send to Apollo
    const apolloResponse = await fetch('https://api.apollo.io/v1/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
      body: JSON.stringify(apolloPayload),
    });

    const contactData = await apolloResponse.json();

    // 4. Check Apollo Response
    if (!apolloResponse.ok) {
      console.error("❌ Apollo API FAILED. Response:");
      console.error(JSON.stringify(contactData, null, 2));
      
      // Return error to frontend so we know it failed
      return res.status(400).json({ 
        success: false, 
        message: "Apollo rejected the entry", 
        details: contactData 
      });
    }

    console.log("✅ Apollo Success! Contact ID:", contactData.contact.id);

    // 5. Save to Strapi (Backup)
    try {
      if (process.env.NEXT_PUBLIC_STRAPI_API_URL) {
        await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/lets-talk-submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              firstName, lastName, email, company, message,
              submittedAt: new Date().toISOString(),
            }
          }),
        });
        console.log("✅ Saved backup to Strapi");
      }
    } catch (strapiErr) {
      console.error("⚠️ Strapi Backup Failed:", strapiErr);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('❌ SERVER CRASH:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}