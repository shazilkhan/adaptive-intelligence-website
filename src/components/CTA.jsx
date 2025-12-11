"use client";

import React from 'react';
import Image from 'next/image';
import LetsTalkButton from "@/components/LetsTalkButton";

const CTA = ({ data }) => {
  if (!data) return null;

  // 1. Text Fields
  const title = data.ctaBgTitle || data.ctaTitle || "Feeling Inspired Yet?";
  const subtitle = data.ctaBgSubtitle || data.ctaSubtitle || "We're only a click away.";
  const btnText = data.ctaBgBtnText || data.ctaBtnText || "Schedule a Marketing Audit";
  const btnUrl = data.ctaBgBtnUrl || data.ctaBtnUrl || "/contact";
  
  // 2. Smart Image Logic
  const getBgUrl = (obj) => {
    const imgField = obj.ctaBgImage || obj['cta-bg'];
    if (!imgField) return null;
    if (imgField.data?.attributes?.url) return imgField.data.attributes.url; // v4
    if (imgField.url) return imgField.url; // v5 flat
    if (imgField.data?.url) return imgField.data.url; // v5 nested
    return null;
  };

  const rawUrl = getBgUrl(data);
  const fullUrl = rawUrl ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${rawUrl}` : null;

  return (
    <div className="cta-hardcoded-wrapper">
      
      {/* Background Image Container */}
      <div className="bg-image-holder">
        {fullUrl ? (
          <Image 
            src={fullUrl} 
            alt="Background" 
            fill 
            className="cta-cover-image"
            style={{ 
                objectFit: 'cover', 
                objectPosition: 'center',
                width: '100%',
                height: '100%'
            }}
            priority
          />
        ) : (
          <div className="fallback-bg"></div>
        )}
        
        {/* The Purple/Pink Gradient Overlay */}
        <div className="overlay"></div>
      </div>

      <div className="container position-relative z-2">
        <div className="row">
          <div className="col-lg-10 m-auto text-center">
            
            <h2 className="main-title" data-aos="fade-up">
              {title}
            </h2>
            
            <p className="subtitle" data-aos="fade-up" data-aos-delay="100">
              {subtitle}
            </p>

            <div className="btn-holder" data-aos="fade-up" data-aos-delay="200">
              <div className="d-inline-block">
                <LetsTalkButton 
                    buttonText={btnText}
                    href={btnUrl}
                    showIcon={false}
                    className="custom-cta-button"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        .cta-hardcoded-wrapper {
          position: relative;
          padding: 140px 0;
          overflow: hidden;
          width: 100%;
        }

        /* --- Backgrounds --- */
        .bg-image-holder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
        
        /* Ensures the image stays behind everything */
        :global(.cta-cover-image) {
            z-index: 0;
        }

        .fallback-bg {
          width: 100%;
          height: 100%;
          background-color: #371440;
        }
        
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(55, 20, 64, 0.9) 0%, rgba(149, 18, 99, 0.85) 100%);
          z-index: 1; /* Sits on top of image, below text */
        }
        
        .z-2 { z-index: 2; } /* Text sits on top of overlay */

        /* --- Typography --- */
        .main-title {
          font-family: 'Recoleta', serif; 
          font-weight: 400;
          font-size: 3.5rem;
          color: white;
          margin-bottom: 20px;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.25rem;
          margin-bottom: 45px;
        }

        /* --- Button Override --- */
        :global(.custom-cta-button) {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: none !important;
            padding: 18px 45px !important;
            font-size: 1.1rem !important;
            border-radius: 0 !important;
            font-weight: 700 !important;
        }
        :global(.custom-cta-button:hover) {
            background-color: #f2f2f2 !important;
            transform: translateY(-2px);
            color: #d61096 !important;
        }

        @media (max-width: 768px) {
          .cta-hardcoded-wrapper { padding: 80px 0; }
          .main-title { font-size: 2.5rem; }
          .subtitle { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
};

export default CTA;