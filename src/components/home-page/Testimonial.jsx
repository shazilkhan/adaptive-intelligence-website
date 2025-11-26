"use client";

import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";

const Testimonial = () => {
  const sliderRef = useRef(null);
  const [testimonialData, setTestimonialData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/testimonials?sort=order:asc`
        );
        const data = await res.json();
        
        if (data?.data && Array.isArray(data.data)) {
          const formattedData = data.data.map(item => {
            const attrs = item.attributes || item;
            return {
              company: attrs.company || "Unknown Company",
              position: attrs.position || "Position",
              name: attrs.name || "Anonymous",
              background: attrs.background || "#FA0B5F",
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
      background: "#FA0B5F",
      text: "Gifted brand and content strategists. They will work with you to understand your business and your core philosophy at its deepest levels. They fundamentally understand that we write copy for the benefit of people first, SEO second — but certainly not to the latter's detriment.",
    },
    {
      company: "Advantage Benefit Solutions",
      position: "Chief Operating Officer",
      name: "Alexandra",
      background: "#00FCFC",
      text: "I came looking to get fantastic copy and I got just that and so much more. Not only did the agency provide outstanding copy and clarity, they also helped me put together a marketing strategy to take our company to the next level. Would recommend to anyone in a heartbeat, especially if you are the type of person that is looking to hire the very best.",
    },
    {
      company: "Credabl",
      position: "Chief Brand Officer",
      name: "Dina",
      background: "#F27AFF",
      text: "A talented creative team that has the remarkable ability to convert basic text into something very user friendly, meaningful and both interesting and enjoyable to read. Very happy with their work and looking forward to future campaigns with them.",
    },
    {
      company: "Intersect Marketing Group",
      position: "Strategy Director",
      name: "Bob",
      background: "#52C1FF",
      text: "Yet another example of excellent quality of work, ability to meet an agreed upon deadline, and a willingness to communicate questions and ideas as often as needed. I really appreciate that adaptiveintelligence.online takes the time to understand your project and cheerfully suggests methods to make their deliverables better than you anticipated.",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false, // Disable center mode to prevent overflow
          variableWidth: false, // Ensure slides take full calculated width
        },
      },
    ],
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  if (loading) {
    return <div className="text-center py-5"><p>Loading testimonials...</p></div>;
  }

  if (testimonialData.length === 0) {
    return <div className="text-center py-5"><p>No testimonials available.</p></div>;
  }

  return (
    <>
      <div
        className="slider-wrapper feedback_slider_ten pt-70 lg-pt-40"
        data-aos="fade-up"
      >
        <Slider {...settings} arrows={false} ref={sliderRef}>
          {testimonialData.map((testimonial, index) => (
            <div key={`${testimonial.company}-${index}`} className="item">
              <div
                className="feedback-block-ten"
                style={{ background: testimonial.background }}
              >
                <div className="cmp-name fw-500 tx-dark testimonial-company">
                  {testimonial.company}
                </div>
                
                <p className="tx-dark mt-20 mb-30 lg-mt-15 lg-mb-25 testimonial-text">
                  {testimonial.text}
                </p>
                <div className="fw-500 tx-dark fs-18">
                  {testimonial.name}
                </div>
                <div className="fs-18 tx-dark">{testimonial.position}</div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <ul
        className="slider-arrows slick-arrow-five d-flex justify-content-center style-none"
        data-aos="fade-left"
      >
        <li className="prev_f5 slick-arrow text-center tran3s" onClick={handlePrev}>
          <i className="bi bi-arrow-left" />
        </li>
        <li className="next_f5 slick-arrow text-center tran3s" onClick={handleNext}>
          <i className="bi bi-arrow-right" />
        </li>
      </ul>

      <style jsx>{`
        .testimonial-company {
            font-size: 30px;
        }
        .testimonial-text {
            font-size: 18px;
        }

        /* --- MOBILE OPTIMIZATION --- */
        @media (max-width: 767px) {
            /* 1. Constrain the width of the card */
            .feedback-block-ten {
                width: 90% !important; /* Use 90% of the slide width to leave margin */
                margin: 0 auto !important; /* Center it */
                padding: 30px 20px !important;
                min-height: auto;
                /* Ensure text breaks inside the card */
                word-wrap: break-word;
            }

            /* 2. Ensure the slide item container doesn't have weird padding */
            .item {
                padding: 0 !important;
                display: flex !important;
                justify-content: center;
            }

            /* 3. Fix Typography */
            .testimonial-company {
                font-size: 24px !important;
                line-height: 1.2;
            }
            
            .testimonial-text {
                font-size: 16px !important;
                line-height: 1.5;
            }
        }
      `}</style>
    </>
  );
};

export default Testimonial;