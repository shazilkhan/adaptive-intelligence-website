import React, { useState, useEffect } from 'react';
import Image from "next/image";
import LetsTalkButton from "@/components/LetsTalkButton";

const Leads = () => {
  const [leadItems, setLeadItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Ensure we fetch the icon
        const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/services?populate=icon`;
        const res = await fetch(apiUrl);

        if (!res.ok) {
           const errorText = await res.text();
           throw new Error(`API fetch failed: ${res.status}`);
        }

        const json = await res.json();

        const formattedServices = (json.data || []).map(item => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          
          // --- NEW FIELDS MAPPING ---
          descriptionIntro: item.description_intro || "",
          descriptionBold: item.description_bold || "",
          descriptionEnd: item.description_end || "",
          footerText: item.footer_text || "",
          
          // Fallback to old description if new fields aren't populated yet
          description: item.description, 
          
          buttonText: item.buttonText,
          buttonUrl: item.buttonUrl,
          color: item.color,
          icon: item.icon?.url
            ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${item.icon.url}`
            : "/images/shape/content.png"
        }));
        
        setLeadItems(formattedServices);

      } catch (error) {
        console.error("Error fetching services:", error.message);
        setError(error.message);
        setLeadItems([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (isLoading) return <p className="text-center">Loading services...</p>;
  if (error) return <p className="text-center text-danger">Error loading services.</p>;
  if (leadItems.length === 0) return null;

  return (
    <div className="row g-4">
      {leadItems.map((item, index) => {
        const iconUrl = item.icon;

        return (
          <div className="col-lg-4 col-md-6" key={item.id}>
            <div
              className="service-card-modern h-100"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              {/* HEADER: Number & Icon */}
              <div className="service-header">
                <div className="service-number">0{index + 1}</div>
                <div className="service-icon-wrapper">
                   <Image
                      src={iconUrl}
                      alt={`${item.title || 'Service'} icon`}
                      width={80} height={80}
                      onError={(e) => console.error(`Image load error`, e)}
                    />
                </div>
              </div>
              
              {/* CONTENT BODY */}
              <div className="service-content">
                <h3 className="service-title">{item.title || 'Untitled Service'}</h3>
                <h4 className="service-subtitle">{item.subtitle || ''}</h4>
                
                {/* --- DESCRIPTION WITH BULLET --- */}
                <div className="service-bullet-wrapper">
                    <div className="bullet-dot"></div>
                    <p className="service-description-text">
                        {/* Render new fields if they exist */}
                        {item.descriptionIntro && (
                            <>
                                {item.descriptionIntro} 
                                {item.descriptionBold && <span className="text-dark fw-bold"> {item.descriptionBold} </span>}
                                {item.descriptionEnd}
                            </>
                        )}
                        
                        {/* Fallback to old simple description if new fields are empty */}
                        {(!item.descriptionIntro && !item.descriptionBold) && item.description}
                    </p>
                </div>

                {/* --- FOOTER TEXT WITH ARROW --- */}
                {item.footerText && (
                    <p className="service-footer-text">
                        {item.footerText} 
                    </p>
                )}
              </div>

              {/* BUTTON */}
              <div className="service-footer">
                <LetsTalkButton buttonText={item.buttonText || "Learn More"} href={item.buttonUrl || '/services'} showIcon={true} />
              </div>
              
              {/* COLORED ACCENT LINE */}
              <div className="service-accent" style={{ backgroundColor: item.color || '#cccccc' }}></div>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .service-card-modern {
          background: white;
          border: 1px solid #f0f0f0;
          border-radius: 0;
          padding: 40px 30px;
          position: relative;
          transition: all 0.4s ease;
          display: flex;
          flex-direction: column;
          min-height: 550px;
        }

        .service-card-modern:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border-color: #FF1292;
        }

        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }

        .service-number {
          font-size: 48px;
          font-weight: 300;
          color: #f0f0f0;
          font-family: 'Recoleta', serif;
          line-height: 1;
        }

        .service-icon-wrapper {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .service-card-modern:hover .service-icon-wrapper img {
          filter: brightness(0) invert(1);
        }

        .service-content {
          flex-grow: 1;
          margin-bottom: 30px;
        }

        .service-title {
          font-size: 28px;
          font-weight: 600;
          color: #151937;
          margin-bottom: 8px;
          font-family: 'Recoleta', serif;
        }

        .service-subtitle {
          font-size: 16px;
          color: #FF1292;
          font-weight: 500;
          margin-bottom: 25px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* --- New Bullet Styles --- */
        .service-bullet-wrapper {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 20px;
        }

        .bullet-dot {
            width: 8px;
            height: 8px;
            background-color: #FF1292;
            border-radius: 50%;
            flex-shrink: 0;
            margin-top: 8px; /* Aligns dot with the first line of text */
        }

        .service-description-text {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        /* --- New Footer Text Styles --- */
        .service-footer-text {
            font-size: 18px;
            font-weight: 500;
            color: #151937;
            margin-top: 20px;
            font-family: 'Recoleta', serif;
            line-height: 1.4;
        }

        .service-footer {
          margin-top: auto;
        }

        .service-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .service-card-modern:hover .service-accent {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .service-card-modern {
            padding: 30px 20px;
            min-height: auto;
          }
          .service-number {
            font-size: 36px;
          }
          .service-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default Leads;