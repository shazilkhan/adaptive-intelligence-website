import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";
import Image from "next/image";

const ClientCarousel = () => {
  const [clientLogos, setClientLogos] = useState([]);
  const clientCarouselRef = useRef(null);

  useEffect(() => {
    const fetchClientLogos = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/client-logos?populate=logo`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch logos');
        
        const json = await res.json();
        
        const formattedLogos = (json.data || json).map(item => ({
          name: item.name,
          logo: item.logo?.url
            ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${item.logo.url}`
            : ""
        })).filter(item => item.logo);

        setClientLogos(formattedLogos);
      } catch (error) {
        console.error("Error fetching client logos:", error);
      }
    };

    fetchClientLogos();
  }, []);

  // Settings for Infinite Loop (Ticker Effect)
  const clientSettings = {
    dots: false,
    infinite: true,
    speed: 5000,         // Time for one full transition (slower = smoother)
    slidesToShow: 6,     // Show more logos on big screens
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,    // 0 delay = continuous movement
    cssEase: "linear",   // Constant speed, no stopping
    pauseOnHover: false, // Keep moving even on hover
    arrows: false,
    responsive: [
      { breakpoint: 1600, settings: { slidesToShow: 6 } },
      { breakpoint: 1200, settings: { slidesToShow: 5 } },
      { breakpoint: 992, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  if (clientLogos.length === 0) return null;

  return (
    <>
      <div className="full-width-slider-wrapper">
          <Slider {...clientSettings} ref={clientCarouselRef}>
            {clientLogos.map((client, index) => (
              <div key={index} className="client-slide-modern">
                <div className="client-logo-wrapper-modern">
                  <Image 
                    src={client.logo} 
                    alt={client.name}
                    width={200} // High base resolution
                    height={100}
                    // Style ensures logo fits vertically but keeps aspect ratio
                    style={{ 
                      width: 'auto', 
                      height: 'auto', 
                      maxHeight: '80px', // Fits inside the 100px box
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </div>
            ))}
          </Slider>
      </div>

      <style jsx>{`
        /* Wrapper to ensure no overflow scrollbars */
        .full-width-slider-wrapper {
            width: 100%;
            overflow: hidden;
        }

        .client-slide-modern {
          padding: 0 15px; /* Spacing between logos */
        }
        
        .client-logo-wrapper-modern {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100px; /* Fixed height container */
          background: white;
          /* Removed border for cleaner look */
        }
      `}</style>
    </>
  );
};

export default ClientCarousel;