"use client";

import { useEffect, useState } from "react";
import { getStrapiApiUrl } from "@/utils/strapi";

const Faq = () => {
  const [accordionItems, setAccordionItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(
          `${getStrapiApiUrl()}/api/faqs?sort=order:asc`
        );
        const data = await res.json();

        if (data?.data && Array.isArray(data.data)) {
          const formattedData = data.data.map((item, index) => {
            const attrs = item.attributes || item;
            return {
              id: `faq-${item.id || index}`,
              question: attrs.question || "Question not available",
              answer: attrs.answer || "Answer not available",
            };
          });
          setAccordionItems(formattedData);
        } else {
          setAccordionItems(getDefaultFaqs());
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setAccordionItems(getDefaultFaqs());
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const getDefaultFaqs = () => [
    {
      id: "faq-1",
      question: "What type of companies do you work with?",
      answer: "Adaptive Intelligence partners with a wide range of brands, from startups to Fortune 500 companies. We specialize in brand strategy, content marketing, and digital campaigns for businesses that want to make a lasting impact in their industry.",
    },
    {
      id: "faq-2",
      question: "Why should I invest in branding?",
      answer: "A strong brand drives long-term growth. While marketing campaigns may grab attention briefly, strategic branding ensures your business is remembered, trusted, and differentiated.",
    },
    {
      id: "faq-3",
      question: "What is your creative process?",
      answer: "Every project begins with a comprehensive discovery phase, including founder interviews, stakeholder workshops, and audience research. From there, we develop a strategic plan and execute campaigns with SEO-optimized content.",
    },
  ];

  if (loading) return <div className="text-center py-5"><p>Loading FAQs...</p></div>;
  if (accordionItems.length === 0) return <div className="text-center py-5"><p>No FAQs available.</p></div>;

  return (
    <>
      {/* Added class 'border-0' and removed theme-specific classes if they cause issues */}
      <div className="accordion accordion-style-four border-0" id="accordionOne">
        {accordionItems.map((item, index) => (
          <div className="accordion-item" key={item.id}>
            <div className="accordion-header" id={`heading-${index}`}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${index}`}
                aria-expanded="false"
                aria-controls={`collapse-${index}`}
              >
                <div className="d-flex w-100 align-items-center justify-content-between">
                    <span className="question-text">
                        <span className="me-2" style={{ color: '#FF1292' }}>{`0${index + 1}.`}</span> 
                        {item.question}
                    </span>
                    
                    {/* CUSTOM ARROW ICON */}
                    <svg 
                        className="arrow-icon" 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
              </button>
            </div>
            <div
              id={`collapse-${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading-${index}`}
              data-bs-parent="#accordionOne"
            >
              <div className="accordion-body">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        /* 1. Global Reset for Accordion Styles */
        :global(.accordion-button::after) {
            display: none !important;
        }

        /* 2. Force Transparent Backgrounds on Wrapper */
        .accordion-item {
            background-color: transparent !important;
            background: transparent !important;
            border: none !important;
            border-bottom: 1px solid #EAEAEA !important;
            margin-bottom: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
        }

        /* 3. Button Styling */
        .accordion-button {
            background-color: transparent !important;
            background: transparent !important;
            box-shadow: none !important;
            padding: 25px 0 !important;
            color: #000 !important;
            font-weight: 500;
            font-size: 1.25rem;
            border: none !important;
        }
        
        /* 4. Answer Body Styling */
        .accordion-body {
            background-color: transparent !important;
            background: transparent !important;
            border: none !important;
            padding: 0 0 30px 35px !important;
            /* ANSWER TEXT COLOR set to BLACK */
            color: #000 !important; 
            font-size: 1.1rem;
            line-height: 1.8;
        }

        /* 5. Arrow Logic */
        .arrow-icon {
            transition: transform 0.3s ease;
            color: #000;
        }
        
        /* Rotate arrow when open */
        :global(.accordion-button:not(.collapsed) .arrow-icon) {
            transform: rotate(180deg);
            color: #FF1292;
        }
        
        /* Highlight text when open */
        :global(.accordion-button:not(.collapsed)) {
            color: #FF1292 !important;
        }

        /* --- MOBILE OPTIMIZATION --- */
        @media (max-width: 767px) {
           .accordion-button {
               font-size: 1.1rem;
               padding: 20px 0 !important;
           }
           .accordion-body {
               padding: 0 0 20px 0 !important;
           }
        }
      `}</style>
    </>
  );
};

export default Faq;