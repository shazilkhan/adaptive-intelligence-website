import React, { useState } from "react";
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

const ContactForm4 = () => {
  const [submitStatus, setSubmitStatus] = useState(null);

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
    email_optin: "no",
    services_needed: [],
    lead_source: [],
  };

  const contactSchema = yup.object().shape({
    first_name: yup.string().required("First Name is required"),
    last_name: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone Number is required"),
    company_name: yup.string().required("Company Name is required"),
    email_optin: yup.string().required("Email Optin is required"),
    services_needed: yup.array().min(1, "Please select at least one service"),
    lead_source: yup.array().min(1, "Please select at least one lead source"),
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
      // This route handles both Apollo (List + Contact) and Strapi backup
      const response = await fetch('/api/submit-contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            // Mapping form values (snake_case) to API expectation (camelCase)
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            companyName: data.company_name,
            emailOptin: data.email_optin,
            servicesNeeded: data.services_needed,
            leadSource: data.lead_source,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // 2. Open Apollo Meetings widget (Client-side integration)
      if (typeof window !== 'undefined' && window.ApolloMeetings) {
        window.ApolloMeetings.submit({
          email: data.email,
          full_name: `${data.first_name} ${data.last_name}`,
          phone_number: data.phone,
          company_name: data.company_name,
          consent_approval: data.email_optin,
          services_needed: data.services_needed,
          lead_source: data.lead_source,
        });
      }

      setSubmitStatus({ type: 'success', message: 'Form submitted successfully!' });
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({ type: 'error', message: 'Failed to submit form. Please try again.' });
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

        <Grid item xs={12} md={6}>
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

        <Grid item xs={12} md={6}>
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

        <Grid item xs={12} md={6}>
          <WhiteTextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <WhiteTextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
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
        
        <Grid item xs={12} md={6}></Grid>

        <Grid item xs={12} md={6}>
          <WhiteFormControl component="fieldset" error={!!errors.services_needed}>
            <FormLabel component="legend">Services Needed*</FormLabel>
            <FormGroup>
              {serviceOptions.map((service) => (
                <FormControlLabel
                  key={service.id}
                  control={
                    <Checkbox
                      {...register("services_needed")}
                      value={service.id}
                    />
                  }
                  label={
                    <div>
                      {service.label}
                      <small style={{ display: 'block', color: 'text.secondary' }}>{service.description}</small>
                    </div>
                  }
                />
              ))}
            </FormGroup>
            {errors.services_needed && (
              <FormHelperText>{errors.services_needed.message}</FormHelperText>
            )}
          </WhiteFormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <WhiteFormControl component="fieldset" error={!!errors.lead_source}>
            <FormLabel component="legend">Lead Source*</FormLabel>
            <FormGroup>
              {leadSourceOptions.map((leadSource) => (
                <FormControlLabel
                  key={leadSource.id}
                  control={
                    <Checkbox
                      {...register("lead_source")}
                      value={leadSource.id}
                    />
                  }
                  label={
                    <div>
                      {leadSource.label}
                      <small style={{ display: 'block', color: 'text.secondary' }}>{leadSource.description}</small>
                    </div>
                  }
                />
              ))}
            </FormGroup>
            {errors.lead_source && (
              <FormHelperText>{errors.lead_source.message}</FormHelperText>
            )}
          </WhiteFormControl>
        </Grid>

        <Grid item xs={12}>
          <WhiteFormControl component="fieldset" error={!!errors.email_optin}>
            <FormLabel component="legend">I agree to receive other communications from Adaptive Intelligence International.*</FormLabel>
            <RadioGroup row {...register("email_optin")}>
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
            {errors.email_optin && (
              <FormHelperText>{errors.email_optin.message}</FormHelperText>
            )}
          </WhiteFormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button 
            className="btn-twentyTwo w-100 fw-500 tran3s text-uppercase" 
            type="submit"
            disabled={isSubmitting}
            aria-label="Send Message"
          >
            {isSubmitting ? "Sending..." : "SEND MESSAGE"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ContactForm4;