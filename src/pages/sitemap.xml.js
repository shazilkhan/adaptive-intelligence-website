import { getStrapiApiUrl } from '@/utils/strapi';

function generateSiteMap(caseStudies) {
    // Defines the base URL of the website
    const baseUrl = "https://adaptiveintelligence.online";

    // List of all static pages
    const staticPages = [
        "",
        "about",
        "ai",
        "contact",
        "cookie-policy",
        "creatives",
        "download",
        "eco",
        "preferred-partners",
        "privacy-policy",
        "services",
        "team",
        "terms-conditions",
        "terms-of-use",
        "case-studies"
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--Static Pages-->
     ${staticPages
            .map((slug) => {
                return `
       <url>
           <loc>${baseUrl}${slug ? `/${slug}` : ""}</loc>
           <changefreq>weekly</changefreq>
           <priority>${slug === "" ? "1.0" : "0.8"}</priority>
       </url>
     `;
            })
            .join("")}
     <!--Dynamic Pages (Case Studies)-->
     ${caseStudies
            .map((study) => {
                const slug = study.slug || study.attributes?.slug; // Handle both v4 and v5 structures just in case
                if (!slug) return "";
                return `
       <url>
           <loc>${baseUrl}/case-studies/${slug}</loc>
           <changefreq>monthly</changefreq>
           <priority>0.7</priority>
       </url>
     `;
            })
            .join("")}
   </urlset>
 `;
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
    // We make an API call to gather the URLs for our site
    let caseStudies = [];
    try {
        // Fetch all case studies to build dynamic routes
        const request = await fetch(`${getStrapiApiUrl()}/api/case-studies?pagination[limit]=-1`);
        const response = await request.json();
        caseStudies = response.data || [];
    } catch (e) {
        console.error("Sitemap: Error fetching case studies", e);
    }

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(caseStudies);

    res.setHeader("Content-Type", "text/xml");
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;
