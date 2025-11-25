"use client";

import { useEffect, useState } from "react";

const Faq = () => {
  const [accordionItems, setAccordionItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/faqs?sort=order:asc`
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
      answer: "Adaptive Intelligence partners with a wide range of brands, from startups to Fortune 500 companies. We specialize in brand strategy, content marketing, and digital campaigns for businesses that want to make a lasting impact in their industry. Our clients value innovative, data-driven solutions and strategic storytelling.",
    },
    {
      id: "faq-2",
      question: "Why should I invest in branding?",
      answer: "A strong brand drives long-term growth. While marketing campaigns may grab attention briefly, strategic branding ensures your business is remembered, trusted, and differentiated. We focus on building brand identity, voice, and messaging that resonate globally and create measurable business outcomes.",
    },
    {
      id: "faq-3",
      question: "What is your creative process?",
      answer: "Every project begins with a comprehensive discovery phase, including founder interviews, stakeholder workshops, and audience research. From there, we develop a strategic plan and execute campaigns with SEO-optimized content, PPC strategy, and multi-channel creative. We provide clear communication at every milestone to ensure alignment and transparency.",
    },
    {
      id: "faq-4",
      question: "How long do projects typically take?",
      answer: "Project timelines vary based on size and complexity. Smaller branding or content initiatives can take weeks, while multi-channel campaigns or full brand development may take months. Rush services are available when time is critical.",
    },
    {
      id: "faq-5",
      question: "How do you communicate with clients?",
      answer: "We adapt to your preferred communication style—regular updates, milestone reviews, or a hands-off approach. Transparency and collaboration are core to our workflow, so you always know the decisions we're making and why.",
    },
    {
      id: "faq-6",
      question: "What kind of ROI can I expect from working with Adaptive Intelligence?",
      answer: "Our work is designed for measurable impact. From higher search engine visibility to increased lead generation and audience engagement, we combine creative storytelling with data-driven strategy to ensure your investment translates into results.",
    },
    {
      id: "faq-7",
      question: "What services can help my brand grow?",
      answer: "We offer brand strategy, content creation, SEO copywriting, social media campaigns, PPC management, and full digital marketing strategy. Each service is tailored to your audience, goals, and market, ensuring every campaign contributes to your brand's growth.",
    },
    {
      id: "faq-8",
      question: "Do you incorporate sustainability or eco-friendly practices?",
      answer: "Yes. We prioritize sustainable creative practices, responsible digital design, and eco-conscious partnerships wherever possible. Our approach ensures your brand grows without compromising values or the planet.",
    },
    {
      id: "faq-9",
      question: "How do you handle pricing and engagement models?",
      answer: "Our pricing is project-based or retainer-based depending on the scope. Every engagement is scoped with clear deliverables, timelines, and reporting metrics so clients know exactly what to expect.",
    },
  ];

  if (loading) {
    return <div className="text-center py-5"><p>Loading FAQs...</p></div>;
  }

  if (accordionItems.length === 0) {
    return <div className="text-center py-5"><p>No FAQs available.</p></div>;
  }

  return (
    <>
      <div className="accordion accordion-style-four" id="accordionOne">
        {accordionItems.map((item, index) => (
          <div className="accordion-item" key={item.id}>
            <div className="accordion-header" id={`heading-${index}`}>
              <button
                className={`accordion-button ${index === 0 ? "" : "collapsed"}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${index}`}
                aria-expanded={index === 0 ? "true" : "false"}
                aria-controls={`collapse-${index}`}
              >
                <span>{`0${index + 1}.`}</span> {item.question}
              </button>
            </div>
            <div
              id={`collapse-${index}`}
              className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
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
        /* --- MOBILE OPTIMIZATION (< 768px) --- */
        @media (max-width: 767px) {
          
          /* 1. Add Padding back to the Question Button so text isn't on the edge */
          :global(.accordion-style-four .accordion-button) {
            padding: 15px 20px !important; 
          }

          /* 2. Add Padding to the Answer Body */
          :global(.accordion-style-four .accordion-body) {
            padding: 0 20px 25px 20px !important;
          }
          
          /* Ensure paragraph uses full width available inside the padding */
          :global(.accordion-style-four .accordion-body p) {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </>
  );
};

export default Faq;