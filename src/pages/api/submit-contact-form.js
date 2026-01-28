// pages/api/submit-contact-form.js

export default async function handler(req, res) {
  // 1. Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log("API Route Hit: /api/submit-contact-form");

  try {
    const bodyData = req.body.data || {};
    // Extract fields
    const firstName = bodyData.firstName || "";
    const lastName = bodyData.lastName || "";
    const email = bodyData.email || "";
    const phone = bodyData.phone || "";
    const companyName = bodyData.companyName || "";
    const services = Array.isArray(bodyData.servicesNeeded) ? bodyData.servicesNeeded.join(', ') : "None";
    const sources = Array.isArray(bodyData.leadSource) ? bodyData.leadSource.join(', ') : "None";
    const userMessage = bodyData.message || "";

    console.log("👉 Processing submission for:", email);

    let apolloSuccess = false;
    let strapiSuccess = false;
    let errorDetails = [];

    // --- 3. Attempt Apollo Submission (Optional) ---
    if (process.env.APOLLO_API_KEY) {
      try {
        const targetListId = process.env.APOLLO_LIST_ID_CONTACT_FORM;
        const apolloPayload = {
          api_key: process.env.APOLLO_API_KEY,
          first_name: firstName,
          last_name: lastName,
          email: email,
          organization_name: companyName,
          phone_numbers: phone ? [{ value: phone, type: "work" }] : [],
          label_ids: targetListId ? [targetListId] : [],
          custom_fields: {
            "initial_message": `Message: ${userMessage} | Services: ${services} | Source: ${sources}`
          }
        };

        const apolloResponse = await fetch('https://api.apollo.io/v1/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
          body: JSON.stringify(apolloPayload),
        });

        const contactData = await apolloResponse.json();

        if (!apolloResponse.ok) {
          console.error("❌ Apollo API Error:", JSON.stringify(contactData, null, 2));
          errorDetails.push("Apollo API rejected request");
        } else {
          console.log("✅ Apollo Contact Created. ID:", contactData.contact?.id);
          apolloSuccess = true;
        }
      } catch (apolloErr) {
        console.error("❌ Apollo Exception:", apolloErr);
        errorDetails.push("Apollo logic failed");
      }
    } else {
      console.warn("⚠️ Skipping Apollo: APOLLO_API_KEY not set");
    }

    // --- 4. Attempt Strapi Submission (Backup) ---
    if (process.env.NEXT_PUBLIC_STRAPI_API_URL) {
      try {
        const strapiRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/contact-form-submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              firstName, lastName, email, phone, companyName,
              emailOptin: bodyData.emailOptin ? 'yes' : 'no',
              servicesNeeded: bodyData.servicesNeeded,
              leadSource: bodyData.leadSource,
              submittedAt: new Date().toISOString(),
            }
          }),
        });

        if (strapiRes.ok) {
          strapiSuccess = true;
          console.log("✅ Saved to Strapi Database");
        } else {
          const errorText = await strapiRes.text();
          console.error("⚠️ Strapi Error:", errorText);
          let strapiErrorMessage = `Strapi save failed (${strapiRes.status})`;
          try {
            const strapiJson = JSON.parse(errorText);
            if (strapiJson.error && strapiJson.error.message) {
              strapiErrorMessage += `: ${strapiJson.error.message}`;
            }
          } catch (e) {
            if (errorText.length < 200) strapiErrorMessage += `: ${errorText}`;
          }
          errorDetails.push(strapiErrorMessage);
        }
      } catch (strapiErr) {
        console.error("⚠️ Strapi Exception:", strapiErr);
        errorDetails.push("Strapi connection failed");
      }
    } else {
      console.warn("⚠️ Skipping Strapi: NEXT_PUBLIC_STRAPI_API_URL not set");
    }

    // --- 5. Return Success if At Least One Succeeded ---
    if (apolloSuccess || strapiSuccess) {
      return res.status(200).json({ success: true, message: 'Submitted successfully' });
    }

    // --- 6. Fallback Success for "No Config" Case (Local Dev) ---
    // If NO keys are set, we don't want to crash. We just log and return 200 mock.
    if (!process.env.APOLLO_API_KEY && !process.env.NEXT_PUBLIC_STRAPI_API_URL) {
      console.warn("⚠️ no backend keys configured. Mocking success.");
      return res.status(200).json({ success: true, message: 'Mock Success (No keys configured)' });
    }

    // If we had keys but both failed:
    console.error("❌ form submission failed completely.");
    return res.status(500).json({
      success: false,
      message: 'Submission failed. System configuration issue.',
      details: errorDetails
    });

  } catch (error) {
    console.error('❌ CRITICAL SERVER ERROR:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
}