"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from '@mui/material/Grid';
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  FormGroup,
  FormHelperText,
  Button,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const WhiteTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.7)',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'white',
  },
  '& .MuiOutlinedInput-input': {
    color: 'white',
  },
  '& .MuiFormHelperText-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

const WhiteFormControl = styled(FormControl)({
  '& .MuiFormLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiFormLabel-root.Mui-focused': {
    color: 'white',
  },
  '& .MuiCheckbox-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiCheckbox-root.Mui-checked': {
    color: 'white',
  },
  '& .MuiRadio-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiRadio-root.Mui-checked': {
    color: 'white',
  },
  '& .MuiFormControlLabel-label': {
    color: 'white',
  },
  '& .MuiFormHelperText-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& small': {
    color: 'rgba(255, 255, 255, 0.7) !important',
  },
});

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const ContactForm4 = () => {
  const [submitStatus, setSubmitStatus] = useState(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef(null);
  const turnstileWidgetId = useRef(null);

  // Load Cloudflare Turnstile script and render widget
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    if (!document.getElementById('cf-turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      document.head.appendChild(script);
    }
    const interval = setInterval(() => {
      if (window.turnstile && turnstileRef.current && turnstileWidgetId.current === null) {
        clearInterval(interval);
        turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'dark',
          callback: (token) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(""),
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const serviceOptions = [
    {
      id: "marketing_consulting",
      label: "Marketing Consulting",
      description: "Strategic marketing advisory and planning services"
    },
    {
      id: "brand_strategy",
      label: "Brand Strategy",
      description: "Strategic brand advisory and planning services"
    },
    {
      id: "email_marketing",
      label: "Email Marketing",
      description: "Strategic email marketing advisory and planning services"
    },
    {
      id: "social_media_marketing",
      label: "Social Media Marketing",
      description: "Strategic social media marketing advisory and planning services"
    },
    {
      id: "content_creation",
      label: "Content Creation",
      description: "Strategic content creation advisory and planning services"
    },
    {
      id: "pay_per_click_advertising",
      label: "Pay Per Click Advertising (PPC)",
      description: "Strategic pay per click advertising advisory and planning services"
    },
    {
      id: "search_engine_optimization",
      label: "Search Engine Optimization (SEO)",
      description: "Strategic search engine optimization advisory and planning services"
    }
  ];

  const leadSourceOptions = [
    { id: "website", label: "Website", description: "From our website" },
    { id: "clutch", label: "Clutch", description: "From Clutch" },
    { id: "linkedin", label: "LinkedIn", description: "From LinkedIn" },
    { id: "google", label: "Google", description: "From Google" },
    { id: "referral", label: "Referral", description: "From a referral" },
    { id: "instagram", label: "Instagram", description: "From Instagram" },
    { id: "other", label: "Other", description: "From another source" },
  ];

  const defaultValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company_name: "",
    message: "",
  };

  const contactSchema = yup.object().shape({
    first_name: yup.string().required("First Name is required"),
    last_name: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone Number is required"),
    company_name: yup.string().required("Company Name is required"),
    message: yup.string().required("Message is required"),
  });

  const methods = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = methods;

  const onSubmit = async (data) => {
    setSubmitStatus(null);

    try {
      // 1. Send data to the dedicated Internal API Route
      const response = await fetch('/api/submit-contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            companyName: data.company_name,
            message: data.message,
            emailOptin: true,
            turnstileToken,
          }
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to submit form';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          if (errorData.details) {
            const detailsStr = Array.isArray(errorData.details) ? errorData.details.join('; ') : JSON.stringify(errorData.details);
            errorMessage += ` [Details: ${detailsStr}]`;
          }
        } catch (e) {
          console.error("Failed to parse error response:", e);
          errorMessage = `Server Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // 2. Open Apollo Meetings widget
      if (typeof window !== 'undefined' && window.ApolloMeetings) {
        window.ApolloMeetings.submit({
          email: data.email,
          full_name: `${data.first_name} ${data.last_name}`,
          company_name: data.company_name,
          message: data.message,
          phone_number: data.phone,
          consent_approval: "yes",
        });
      }

      setSubmitStatus({ type: 'success', message: 'Form submitted successfully!' });
      reset();
      setTurnstileToken("");
      if (turnstileWidgetId.current !== null && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({ type: 'error', message: error.message || 'Failed to submit form. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        {submitStatus && (
          <Grid item xs={12}>
            <Alert severity={submitStatus.type} onClose={() => setSubmitStatus(null)}>
              {submitStatus.message}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <WhiteTextField
            fullWidth
            label="First Name"
            variant="outlined"
            {...register("first_name")}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <WhiteTextField
            fullWidth
            label="Last Name"
            variant="outlined"
            {...register("last_name")}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <WhiteTextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <WhiteTextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            type="tel"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <WhiteTextField
            fullWidth
            label="Company Name"
            variant="outlined"
            {...register("company_name")}
            error={!!errors.company_name}
            helperText={errors.company_name?.message}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <WhiteTextField
            fullWidth
            label="Tell us a little bit more:"
            variant="outlined"
            multiline
            rows={4}
            {...register("message")}
            error={!!errors.message}
            helperText={errors.message?.message}
            required
          />
        </Grid>

        {TURNSTILE_SITE_KEY && (
          <Grid item xs={12}>
            <div ref={turnstileRef} />
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            type="submit"
            disabled={isSubmitting || (TURNSTILE_SITE_KEY && !turnstileToken)}
            aria-label="Submit"
            variant="contained"
            style={{
              background: 'white',
              color: 'black',
              padding: '12px 50px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: '500',
              borderRadius: '0',
              width: 'auto',
              minWidth: '150px'
            }}
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ContactForm4;
