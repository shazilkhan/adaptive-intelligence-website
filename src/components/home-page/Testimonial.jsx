"use client";

import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import { getStrapiApiUrl } from "@/utils/strapi";

const Testimonial = () => {
  const sliderRef = useRef(null);
  const [testimonialData, setTestimonialData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(
          `${getStrapiApiUrl()}/api/testimonials?sort=order:asc`
        );
        const data = await res.json();

        if (data?.data && Array.isArray(data.data)) {
          const formattedData = data.data.map(item => {
            const attrs = item.attributes || item;
            return {
              company: attrs.company || "Unknown Company",
              position: attrs.position || "",
              name: attrs.name || "Anonymous",
              text: attrs.text || "No testimonial text provided.",
            };
          });
          setTestimonialData(formattedData);
        } else {
          setTestimonialData(getDefaultTestimonials());
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonialData(getDefaultTestimonials());
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const getDefaultTestimonials = () => [
    {
      company: "Winsite Digital",
      position: "Founder & CEO",
      name: "Jarad",
      text: "Gifted brand and content strategists. They will work with you to understand your business and your core philosophy at its deepest levels.",
    },
    {
      company: "Advantage Benefit Solutions",
      position: "Chief Operating Officer",
      name: "Alexandra",
      text: "I came looking to get fantastic copy and I got just that and so much more. Not only did the agency provide outstanding copy and clarity, they also helped me put together a marketing strategy.",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
  };

  const handlePrev = () => sliderRef.current?.slickPrev();
  const handleNext = () => sliderRef.current?.slickNext();

  if (loading) return <div className="text-white text-center">Loading...</div>;

  return (
    <div className="testimonial-section-wrapper">

      {/* Flex container to keep arrows and slider aligned */}
      <div className="d-flex align-items-center justify-content-center gap-4 gap-xl-5">

        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="arrow-btn d-none d-lg-flex"
          aria-label="Previous Testimonial"
        >
          <i className="bi bi-arrow-left" />
        </button>

        {/* The Slider Window */}
        <div className="slider-container">
          <Slider {...settings} ref={sliderRef}>
            {testimonialData.map((testimonial, index) => (
              <div key={index}>
                <div className="glass-card text-center mx-auto">
                  {/* Company */}
                  <div className="mb-4">
                    <h3 className="company-name font-recoleta fw-normal text-white mb-1">
                      {testimonial.company}
                    </h3>
                  </div>

                  {/* Text */}
                  <p className="testimonial-text text-white lh-lg mb-40 lg-mb-30 m-auto">
                    "{testimonial.text}"
                  </p>

                  {/* Person */}
                  <div>
                    <div className="fw-500 text-white fs-18 text-uppercase ls-1">
                      {testimonial.name}
                    </div>
                    <div className="fs-16 text-white opacity-75">
                      {testimonial.position}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="arrow-btn d-none d-lg-flex"
          aria-label="Next Testimonial"
        >
          <i className="bi bi-arrow-right" />
        </button>
      </div>

      {/* Mobile Arrows */}
      <div className="d-flex d-lg-none justify-content-center gap-3 mt-5">
        <button onClick={handlePrev} className="arrow-btn mobile"><i className="bi bi-arrow-left" /></button>
        <button onClick={handleNext} className="arrow-btn mobile"><i className="bi bi-arrow-right" /></button>
      </div>

      <style jsx>{`
        /* --- LAYOUT --- */
        .slider-container {
            width: 100%;
            /* CHANGE: Increased from 900px to 1100px */
            max-width: 1100px; 
            min-height: 400px;
        }

        /* --- GLASS CARD --- */
        .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            padding: 60px 80px;
            box-shadow: 0 30px 60px rgba(0,0,0,0.2);
        }

        .company-name { font-size: 2.2rem; }
        .testimonial-text { font-size: 1.25rem; max-width: 90%; }
        .ls-1 { letter-spacing: 1px; }

        /* --- ARROWS --- */
        .arrow-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.4);
            background: transparent;
            color: white;
            font-size: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            flex-shrink: 0;
            cursor: pointer;
        }

        .arrow-btn:hover {
            background: white;
            color: #FF1292;
            border-color: white;
        }

        .arrow-btn.mobile {
            width: 50px;
            height: 50px;
            font-size: 1rem;
        }

        @media (max-width: 991px) {
            .glass-card { padding: 40px 30px; }
            .company-name { font-size: 1.8rem; }
            .testimonial-text { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
};

export default Testimonial;