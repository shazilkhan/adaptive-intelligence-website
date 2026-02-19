// src/components/services/ServicesGridDark.jsx
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import LetsTalkButton from "@/components/LetsTalkButton";
import { getStrapiApiUrl, getStrapiMediaUrl } from "@/utils/strapi";

const ServicesGridDark = () => {
  // State for data, loading, errors
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = `${getStrapiApiUrl()}/api/services?populate=icon`;
        console.log("ServicesGridDark fetching from:", apiUrl);
        const res = await fetch(apiUrl);

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Failed to fetch services: ${res.status}`, errorText);
          throw new Error(`API fetch failed: ${res.status}`);
        }

        const json = await res.json();
        console.log("ServicesGridDark received raw data:", json);

        const formattedServices = (json.data || []).map(item => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          buttonText: item.buttonText,
          buttonUrl: item.buttonUrl,
          color: item.color,
          icon: getStrapiMediaUrl(item.icon?.url) || "/images/shape/content.png"
        }));
        console.log("ServicesGridDark formatted data:", formattedServices);
        setServices(formattedServices);

      } catch (error) {
        console.error("Error fetching services in ServicesGridDark:", error.message);
        setError(error.message);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []); // Empty array ensures this runs only once

  // --- Render based on state ---
  if (isLoading) {
    return <p className="text-center" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading services...</p>;
  }

  if (error) {
    return <p className="text-center text-danger">Error loading services.</p>;
  }

  if (services.length === 0) {
    return null; // Don't render if no services
  }

  // --- Main Render (using dark card style) ---
  return (
    <>
      <div className="row g-4">
        {services.map((service, index) => (
          <div key={service.id || index} className="col-lg-4 col-md-6 d-flex"> {/* Added d-flex */}
            <div className="service-card-dark w-100"> {/* Added w-100 */}
              <div className="service-header-dark">
                <div className="service-number-dark">0{index + 1}</div>
                <div className="service-icon-dark">
                  <Image
                    src={service.icon} // Already formatted with fallback
                    alt={service.title || 'Service Icon'}
                    width={50}
                    height={50}
                    onError={(e) => console.error(`Image error for ${service.icon}`, e.target.src)}
                  />
                </div>
              </div>

              <div className="service-content-dark">
                <h3 className="service-title-dark">{service.title}</h3>
                <p className="service-subtitle-dark">{service.subtitle}</p>
                <p className="service-description-dark">{service.description}</p>
                <div className="service-cta-dark mt-auto d-flex justify-content-center"> {/* Ensure button is at bottom */}
                  <LetsTalkButton
                    buttonText={service.buttonText || "Learn More"} // Use dynamic text
                    href={service.buttonUrl || `/contact`} // Use dynamic URL
                  />
                </div>
              </div>

              <div className="service-accent-dark" style={{ backgroundColor: service.color || '#FF1292' }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Styles specific to this component - Copied from ServicesPage */}
      <style jsx>{`
         .service-card-dark {
           background: rgba(255, 255, 255, 0.05);
           border: 1px solid rgba(255, 255, 255, 0.1);
           height: 100%; /* Use height 100% with d-flex on col */
           position: relative;
           transition: all 0.3s ease;
           display: flex; /* Make card flex */
           flex-direction: column; /* Stack vertically */
           padding: 30px;
           backdrop-filter: blur(10px);
           border-radius: 8px; /* Optional: Rounded corners */
         }
         .service-card-dark:hover {
           transform: translateY(-10px);
           box-shadow: 0 20px 40px rgba(255, 18, 146, 0.2);
           border-color: #FF1292;
           background: rgba(255, 255, 255, 0.08);
         }
         .service-header-dark {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 25px;
           flex-shrink: 0; /* Prevent header shrinking */
         }
         .service-number-dark {
           font-size: 3rem;
           font-weight: 100;
           color: rgba(255, 255, 255, 0.2);
           font-family: 'Recoleta', serif;
         }
         .service-icon-dark {
           width: 70px;
           height: 70px;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           background: rgba(255, 18, 146, 0.1);
           border: 1px solid rgba(255, 18, 146, 0.3);
           flex-shrink: 0; /* Prevent icon shrinking */
         }
         .service-icon-dark img {
           filter: brightness(0) invert(1);
         }
         .service-content-dark {
           flex-grow: 1; /* Allow content to expand */
           display: flex; /* Flex to push button down */
           flex-direction: column;
         }
         .service-title-dark {
           font-size: 1.8rem;
           font-weight: 600;
           color: white;
           margin-bottom: 10px;
           font-family: 'Recoleta', serif;
         }
         .service-subtitle-dark {
           color: #FF1292;
           font-size: 0.9rem;
           text-transform: uppercase;
           letter-spacing: 1px;
           margin-bottom: 20px;
         }
         .service-description-dark {
           color: rgba(255, 255, 255, 0.8);
           line-height: 1.6;
           margin-bottom: 25px;
           font-size: 0.95rem;
           flex-grow: 1; /* Allow description to push button down */
         }
         .service-cta-dark {
           margin-top: auto; /* Push button to bottom */
         }
         .service-accent-dark {
           position: absolute;
           top: 0;
           left: 0;
           width: 4px;
           height: 100%;
           opacity: 0;
           transition: opacity 0.3s ease;
           border-top-left-radius: 8px; /* Match card radius */
           border-bottom-left-radius: 8px; /* Match card radius */
         }
         .service-card-dark:hover .service-accent-dark {
           opacity: 1;
         }
         /* Responsive */
         @media (max-width: 768px) {
           .service-card-dark { padding: 25px; }
           .service-number-dark { font-size: 2.5rem; }
           .service-title-dark { font-size: 1.5rem; }
         }
          @media (max-width: 480px) {
              .service-card-dark { padding: 20px; }
          }
           /* Ensure columns stretch */
          .col-lg-4, .col-md-6 {
              display: flex;
          }
      `}</style>
    </>
  );
};

export default ServicesGridDark;