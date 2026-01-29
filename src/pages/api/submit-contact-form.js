// pages/api/submit-contact-form.js

export default async function handler(req, res) {
  // 1. Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

    // Minimal logging: keep errors actionable without noisy debug output

  try {
    // Support both `{ data: {...} }` and direct `{...}` payloads
    const bodyData = (req.body && (req.body.data || req.body)) || {};
    // Extract fields
    const firstName = bodyData.firstName || "";
    const lastName = bodyData.lastName || "";
    const email = bodyData.email || "";
    const phone = bodyData.phone || "";
    const companyName = bodyData.companyName || "";
    const services = Array.isArray(bodyData.servicesNeeded) ? bodyData.servicesNeeded.join(', ') : "None";
    const sources = Array.isArray(bodyData.leadSource) ? bodyData.leadSource.join(', ') : "None";
    const userMessage = bodyData.message || "";

    // (intentionally no verbose console logging here)

    let apolloSuccess = false;
    let strapiSuccess = false;
    let errorDetails = [];

    // --- 3. Apollo Submission (Primary) ---
    // Previously this route could "succeed" via Strapi or mock success even if Apollo never ran.
    // If your goal is "send to Apollo", we should fail loudly when Apollo isn't configured or rejects the request.
    if (!process.env.APOLLO_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error: APOLLO_API_KEY is missing",
      });
    }

    // Basic validation so Apollo doesn't receive empty records
    if (!email || !firstName || !lastName || !companyName || !userMessage) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        details: {
          email: !!email,
          firstName: !!firstName,
          lastName: !!lastName,
          companyName: !!companyName,
          message: !!userMessage,
        },
      });
    }

    try {
      const targetListId = process.env.APOLLO_LIST_ID_CONTACT_FORM;
      const apolloPayload = {
        api_key: process.env.APOLLO_API_KEY,
        first_name: firstName,
        last_name: lastName,
        email: email,
        organization_name: companyName,
        label_ids: targetListId ? [targetListId] : [],
        // Keep consistent with other routes in this repo
        custom_fields: {
          initial_message: `Message: ${userMessage} | Services: ${services} | Source: ${sources}`,
        },
      };

      // NOTE: We intentionally do not send `phone_numbers` here to avoid Apollo schema rejections.

      const apolloResponse = await fetch('https://api.apollo.io/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(apolloPayload),
      });

      const apolloText = await apolloResponse.text();
      let apolloData = null;
      try {
        apolloData = apolloText ? JSON.parse(apolloText) : null;
      } catch {
        apolloData = { raw: apolloText };
      }

      if (!apolloResponse.ok) {
        return res.status(400).json({
          success: false,
          message: "Apollo rejected the entry",
          details: apolloData,
        });
      }

      apolloSuccess = true;
    } catch (apolloErr) {
      return res.status(500).json({
        success: false,
        message: "Apollo submission failed (server error)",
        details: apolloErr?.message || String(apolloErr),
      });
    }

    // --- 4. Attempt Strapi Submission (Backup) ---
    if (process.env.NEXT_PUBLIC_STRAPI_API_URL) {
      try {
        const strapiRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/contact-form-submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              firstName,
              lastName,
              email,
              companyName,
              // Removed extra fields that were causing Strapi 400 errors
              // message, phone, emailOptin, servicesNeeded, leadSource are excluded based on user request
            }
          }),
        });

        if (strapiRes.ok) {
          strapiSuccess = true;
          // saved to Strapi
        } else {
          const errorText = await strapiRes.text();
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
        errorDetails.push("Strapi connection failed");
      }
    } else {
      // Strapi not configured (optional backup)
    }

    // --- 5. Return Success if At Least One Succeeded ---
    if (apolloSuccess || strapiSuccess) {
      return res.status(200).json({
        success: true,
        message: 'Submitted successfully',
        apolloSuccess,
        strapiSuccess,
      });
    }

    // If we had keys but both failed:
    return res.status(500).json({
      success: false,
      message: 'Submission failed. System configuration issue.',
      details: errorDetails
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
}