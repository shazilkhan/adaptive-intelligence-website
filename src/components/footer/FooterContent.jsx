import { useState, useEffect } from "react";
import { getStrapiApiUrl } from "@/utils/strapi";

const FooterContent = () => {
  const [latestCaseStudies, setLatestCaseStudies] = useState([]);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const apiUrl = getStrapiApiUrl();
        const res = await fetch(
          `${apiUrl}/api/case-studies?sort=publishedAt:desc&pagination[limit]=3`
        );
        const data = await res.json();

        // Strapi v5 returns a flat data structure in 'data'
        if (data.data) {
          setLatestCaseStudies(data.data);
        }
      } catch (error) {
        console.error("Error fetching footer case studies:", error);
      }
    };

    fetchCaseStudies();
  }, []);

  // Dynamic Footer Structure
  const footerData = [
    {
      title: "Links",
      links: [
        { title: "Home", url: "/" },
        { title: "About", url: "/about" },
        { title: "Services", url: "/services" },
        { title: "Eco", url: "/eco" },
        { title: "Contact", url: "/contact" },
      ],
    },
    {
      title: "Case Studies",
      // If data exists, map it. Otherwise, show a fallback or empty list.
      links: latestCaseStudies.length > 0 
        ? latestCaseStudies.map((item) => ({
            title: item.title,
            url: `/case-studies/${item.slug}`,
          }))
        : [
            // Optional: Keep static fallback or loading text if desired during fetch
            { title: "Loading...", url: "#" } 
          ],
    },
    {
      title: "Legal",
      links: [
        { title: "Privacy Policy", url: "/privacy-policy" },
        { title: "Terms & Conditions", url: "/terms-and-conditions" },
        { title: "Terms of Use", url: "/terms-of-use" },
        { title: "Cookie Policy", url: "/cookie-policy" },
      ],
    },
  ];

  return (
    <>
      {footerData.map((section, index) => (
        <div key={index} className="col-lg-2 col-sm-4 mb-30">
          <h5 className="footer-title fw-normal">{section.title}</h5>
          <ul className="footer-nav-link style-none">
            {section.links.map((item, i) => (
              <li key={i}>
                {/* Using standard <a> tag for broader compatibility */}
                <a href={item.url}>{item.title}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

export default FooterContent;