// pages/api/submit-contact-form.js

export default async function handler(req, res) {
  // 1. Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 2. Debug: Log that the server was hit
  console.log("API Route Hit: /api/submit-contact-form");

  // 3. Check for API Key
  if (!process.env.APOLLO_API_KEY) {
    console.error("❌ Error: APOLLO_API_KEY is missing in .env.local");
    return res.status(500).json({ message: "Server Error: Missing API Key" });
  }

  try {
    // 4. Safely extract data
    const bodyData = req.body.data || {};
    
    const firstName = bodyData.firstName || "";
    const lastName = bodyData.lastName || "";
    const email = bodyData.email || "";
    const phone = bodyData.phone || "";
    const companyName = bodyData.companyName || "";
    
    const services = Array.isArray(bodyData.servicesNeeded) ? bodyData.servicesNeeded.join(', ') : "None";
    const sources = Array.isArray(bodyData.leadSource) ? bodyData.leadSource.join(', ') : "None";

    console.log("👉 Processing submission for:", email);

    // --- 5. Prepare Apollo Payload ---
    // CHANGED: We now pull the specific list ID for this form
    const targetListId = process.env.APOLLO_LIST_ID_CONTACT_FORM;

    const apolloPayload = {
      api_key: process.env.APOLLO_API_KEY,
      first_name: firstName,
      last_name: lastName,
      email: email,
      organization_name: companyName,
      phone_numbers: phone ? [{ value: phone, type: "work" }] : [],
      // FIX: Add to specific list immediately
      label_ids: targetListId ? [targetListId] : [], 
      custom_fields: {
        "initial_message": `Services: ${services} | Source: ${sources}`
      }
    };

    console.log("📤 Sending to Apollo...");

    // --- 6. Send to Apollo (Create Contact) ---
    const apolloResponse = await fetch('https://api.apollo.io/v1/contacts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Cache-Control': 'no-cache' 
      },
      body: JSON.stringify(apolloPayload),
    });

    const contactData = await apolloResponse.json();

    // --- 7. Check for Apollo Errors ---
    if (!apolloResponse.ok) {
      console.error("❌ Apollo API Error Response:", JSON.stringify(contactData, null, 2));
      return res.status(400).json({ 
        success: false, 
        message: "Apollo Rejected the Request", 
        details: contactData 
      });
    }

    console.log("✅ Apollo Contact Created & Added to List. ID:", contactData.contact.id);

    // --- 8. Save to Strapi (Backup) ---
    try {
      if (process.env.NEXT_PUBLIC_STRAPI_API_URL) {
        await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/contact-form-submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              firstName, lastName, email, phone, companyName, 
              emailOptin: bodyData.emailOptin,
              servicesNeeded: bodyData.servicesNeeded, 
              leadSource: bodyData.leadSource, 
              submittedAt: new Date().toISOString(),
            }
          }),
        });
        console.log("✅ Saved to Strapi");
      }
    } catch (strapiErr) {
      console.error("⚠️ Strapi Backup Failed (Non-critical):", strapiErr);
    }

    // 9. Final Success
    return res.status(200).json({ success: true, message: 'Submitted successfully to Apollo' });

  } catch (error) {
    console.error('❌ CRITICAL SERVER ERROR:', error);
    return res.status(500).json({ 
        success: false, 
        message: 'Internal Server Error', 
        error: error.message 
    });
  }
}