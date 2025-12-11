import React from 'react';
import Image from 'next/image';

const OurValues = ({ values }) => {
  // Config for API URL
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

  if (!values || values.length === 0) return null;

  return (
    <div className="our-values-section position-relative pt-100 pb-100 md-pt-70 md-pb-70">
      <div className="container">
        
        {/* Section Title */}
        <div className="row">
          <div className="col-12 text-center mb-60 lg-mb-40" data-aos="fade-up">
            <h2 className="section-title font-recoleta text-white fw-normal">
              Our Values
            </h2>
          </div>
        </div>

        {/* Values List */}
        <div className="values-wrapper mx-auto" style={{ maxWidth: '900px' }}>
          {values.map((item, index) => {
            const data = item.attributes;
            const iconUrl = data.icon?.data?.attributes?.url;
            // Fix URL if needed
            const fullIconUrl = iconUrl ? (iconUrl.startsWith('http') ? iconUrl : `${API_URL}${iconUrl}`) : null;

            return (
              <div 
                key={item.id} 
                className="value-card d-flex align-items-start mb-25"
                data-aos="fade-up" 
                data-aos-delay={index * 100}
              >
                {/* Icon Box */}
                <div className="icon-box flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle">
                  {fullIconUrl && (
                    <Image 
                      src={fullIconUrl} 
                      width={40} 
                      height={40} 
                      alt={data.title} 
                      className="icon-svg"
                    />
                  )}
                </div>

                {/* Text Content */}
                <div className="text-content ps-4">
                  <h4 className="value-title text-white font-recoleta mb-15">
                    {data.title}
                  </h4>
                  <p className="value-desc text-white opacity-75 m-0 lh-lg">
                    {data.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .our-values-section {
          background-color: #0d1026; /* Dark Navy Background */
        }

        .value-card {
          background: #181d36; /* Slightly lighter card bg */
          padding: 40px;
          border-radius: 12px;
          transition: transform 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .value-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 18, 146, 0.3); /* Pink hint on hover */
        }

        .icon-box {
          width: 80px;
          height: 80px;
          background: transparent;
          border: 1px solid #FFC107; /* Yellow Border matching screenshot */
          padding: 15px;
        }

        /* Enforce styling on the SVG icon to match theme if needed */
        .icon-svg {
          width: 100%;
          height: auto;
        }

        .section-title {
          font-size: 48px;
        }

        .value-title {
          font-size: 24px;
          letter-spacing: 0.5px;
        }

        .value-desc {
          font-size: 17px;
          line-height: 1.7em;
        }

        @media (max-width: 768px) {
          .value-card {
            flex-direction: column;
            text-align: center;
            padding: 30px 20px;
          }
          .icon-box {
            margin: 0 auto 20px auto;
          }
          .text-content {
            padding-left: 0 !important;
          }
          .section-title {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default OurValues;