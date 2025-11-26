"use client";

import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Partners = () => {
  const partners = [
    { name: "Nike", font: "" },
    { name: "", font: "" }, 
    { name: "Verizon", font: "" },
    { name: "", font: "" }, 
    { name: "Vimeo", font: "" },
    { name: "", font: "" }, 
    { name: "Reebok", font: "" },
    { name: "", font: "" }, 
    { name: "Upwork", font: "" },
    { name: "", font: "" }, 
    { name: "Vice", font: "" },
    { name: "", font: "" }, 
    { name: "Billboard", font: "" },
  ];

  const mobilePartners = partners.filter(p => p.name !== "");

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 3000,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    variableWidth: true,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="partner-section-wrapper d-flex flex-column flex-xl-row align-items-center justify-content-between">
      
      {/* 1. Title Section */}
      <div className="title-wrapper mb-4 mb-xl-0 flex-shrink-0">
        {/* CHANGED: Removed custom color classes, used 'tx-dark' to force Black Text */}
        <h3 className="title tx-dark d-flex justify-content-center justify-content-xl-start align-items-center m0">
          <span className="fw-bold">100+</span>
          <span className="font-recoleta ps-2">Trusted Partners</span>
          
          <span className="ms-4 d-none d-sm-inline-block">
            <Image
              src="/images/shape/shape_119.svg"
              alt="img"
              className="lazy-img"
              width={100}
              height={5}
            />
          </span>
        </h3>
      </div>

      {/* 2. Logos Container */}
      {/* FIX: minWidth: 0 prevents flexbox overflow issues */}
      <div className="logo-container w-100 ps-xl-5" style={{ minWidth: 0 }}>
        
        {/* DESKTOP: Static List */}
        <div className="logo-wrapper fw-500 tx-dark d-none d-xl-flex flex-wrap flex-xl-nowrap justify-content-between">
          {partners.map((partner, index) => (
            <div key={index} className={`partner-item ${partner.font || ''}`}>
              {partner.name ? partner.name : '.'}
            </div>
          ))}
        </div>

        {/* MOBILE: Rotating Slider */}
        <div className="mobile-slider-wrapper d-block d-xl-none">
          <Slider {...sliderSettings}>
            {mobilePartners.map((partner, index) => (
              <div key={index} className="slider-item px-4">
                {/* CHANGED: Used 'tx-dark' to force Black Text here as well */}
                <h4 className={`m0 tx-dark fw-500 text-center ${partner.font || ''}`} style={{ whiteSpace: 'nowrap' }}>
                  {partner.name}
                </h4>
              </div>
            ))}
          </Slider>
        </div>

      </div>

      <style jsx>{`
        .partner-section-wrapper {
            width: 100%;
            position: relative;
            /* Ensure no horizontal scroll triggers */
            overflow: hidden; 
        }

        .title-wrapper {
            text-align: center;
            width: 100%; 
        }

        @media (min-width: 1200px) {
            .title-wrapper {
                text-align: left;
                width: auto;
            }
        }
        
        .mobile-slider-wrapper {
            width: 100%;
            overflow: hidden;
            margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Partners;