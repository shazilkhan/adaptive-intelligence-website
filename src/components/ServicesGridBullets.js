import React, { useState, useEffect } from 'react';
import Image from "next/image";
import LetsTalkButton from "@/components/LetsTalkButton";

const ServicesGridBullets = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Updated API URL: Added '&sort=order:asc' at the end
        const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/service-lists?populate[0]=icon&populate[1]=features`;

        const res = await fetch(apiUrl);
        const json = await res.json();

        if (json.data) {
          setServices(json.data);
        }
      } catch (error) {
        console.error("Error fetching Service Lists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-white text-center">Loading...</div>;
  if (services.length === 0) return null;

  return (
    <>
      {services.map((item, index) => {
        // Strapi v5 Flat structure
        const iconUrl = item.icon?.url
          ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${item.icon.url}`
          : "/images/shape/content.png";

        return (
          <div className="col-lg-4 col-md-6" key={item.id || index}>
            <div
              className="service-card-dark h-100"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="service-header-dark">
                <div className="service-number-dark">0{index + 1}</div>
                <div className="service-icon-dark">
                  <Image
                    src={iconUrl}
                    alt={item.title || "icon"}
                    width={40}
                    height={40}
                  />
                </div>
              </div>

              <div className="service-content-dark">
                <h3 className="service-title-dark">{item.title}</h3>
                <div className="service-subtitle-dark">{item.subtitle}</div>

                {/* --- BULLET POINTS LOGIC --- */}
                <div className="service-features-dark">
                  <ul>
                    {item.features?.map((bullet, i) => (
                      <li key={i}>
                        <span className="feature-dot-dark"></span>
                        {bullet.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* --- NEW: Footer Text Section --- */}
                {item.footer_text && (
                  <p className="service-footer-text mt-4 mb-0">
                    {item.footer_text}
                  </p>
                )}
                {/* ------------------------------- */}

              </div>

              <div className="mt-auto d-flex justify-content-center">
                <LetsTalkButton
                  buttonText={item.buttonText || "Learn More"}
                  href={item.buttonUrl || "/contact"}
                  showIcon={true}
                />
              </div>

              <div className="service-accent-dark" style={{ backgroundColor: item.color || '#FF1292' }}></div>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .service-card-dark {
          background: rgba(255, 255, 255, 0.03); /* Very transparent white for dark bg */
          border: 1px solid rgba(255, 255, 255, 0.1);
          height: 100%;
          position: relative;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          padding: 40px 30px;
          backdrop-filter: blur(5px);
        }

        .service-card-dark:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          border-color: #FF1292;
          background: rgba(255, 255, 255, 0.05);
        }

        .service-header-dark {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .service-number-dark {
          font-size: 3rem;
          font-weight: 100;
          color: rgba(255, 255, 255, 0.1);
          font-family: 'Recoleta', serif;
        }

        .service-icon-dark {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* Invert icon color for dark mode visibility */
        .service-icon-dark img {
            filter: brightness(0) invert(1);
        }

        .service-content-dark {
          flex-grow: 1;
          margin-bottom: 30px;
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
          margin-bottom: 25px;
        }

        /* Bullet Styles */
        .service-features-dark ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .service-features-dark li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 12px;
          color: rgba(255, 255, 255, 0.7); /* Light gray text */
          font-size: 1rem;
          line-height: 1.5;
        }

        .feature-dot-dark {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FF1292;
          margin-top: 9px; /* Align with text line height */
          margin-right: 12px;
          flex-shrink: 0;
        }

        /* Footer Text Style - Matches Bullets */
        .service-footer-text {
            color: rgba(255, 255, 255, 0.7);
            font-size: 1rem;
            line-height: 1.6;
        }

        .service-accent-dark {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .service-card-dark:hover .service-accent-dark {
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default ServicesGridBullets;