import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header/Header';
import FooterWithSettings from "@/components/footer/FooterWithSettings";
import LetsTalkButton from '@/components/LetsTalkButton';
import SEO from '@/components/SEO';
import IndustryCards from '@/components/NonCompliantIndustry';
import { getStrapiApiUrl, getStrapiMediaUrl } from '@/utils/strapi';

// --- Fallback company data (used until the CMS entry is populated) ---
const FB_BIG_OIL = [
  { name: 'ExxonMobil', description: 'Long-documented history of funding climate denial research while internally acknowledging climate risk since the 1970s.', adaptiveScore: 1 },
  { name: 'Shell', description: 'Responsible for oil spills, methane leaks, and obstructing climate policy.', adaptiveScore: 1 },
  { name: 'Valero Energy', description: 'Operates refineries responsible for significant air and water quality violations across multiple U.S. communities.', adaptiveScore: 1 },
  { name: 'Chevron', description: 'Ongoing carbon emissions at industrial scale while lobbying against clean energy regulation.', adaptiveScore: 1 },
  { name: 'BP', description: 'Responsible for the Deepwater Horizon disaster — one of the largest marine oil spills in history. Continues to expand fossil fuel extraction capacity.', adaptiveScore: 1 },
  { name: 'ConocoPhillips', description: "Operates oil extraction projects in ecologically sensitive areas including Alaska's North Slope. Consistently among the top U.S. corporate greenhouse gas emitters.", adaptiveScore: 1 },
  { name: 'Marathon Petroleum', description: 'Has exhibited a pattern of environmental compliance failures and air quality violations across refinery communities.', adaptiveScore: 1 },
  { name: 'Saudi Aramco', description: "The world's single largest corporate emitter of greenhouse gases. Holds little accountability to environmental standards.", adaptiveScore: 1 },
];

const FB_DEFENSE = [
  { name: 'Lockheed Martin', description: "World's largest defense contractor by revenue. Responsible for Superfund sites and ongoing toxic contamination from manufacturing facilities across the U.S.", adaptiveScore: 1 },
  { name: 'RTX Corporation (Raytheon)', description: 'Implicated in Superfund contamination sites and the production of technologies used in conflicts with documented civilian impact.', adaptiveScore: 1 },
  { name: 'Palantir Technologies', description: 'Raises serious concerns around ethical AI deployment, civilian surveillance, and applications in conflict zones.', adaptiveScore: 1 },
  { name: 'Northrop Grumman', description: 'Linked to toxic groundwater contamination and listed on multiple EPA Superfund registers. Primary contractor for nuclear weapon systems.', adaptiveScore: 1 },
  { name: 'General Dynamics', description: 'Historical pollution from manufacturing sites and ongoing involvement in contested international arms contracts.', adaptiveScore: 1 },
  { name: 'Boeing (Defense)', description: 'Defense division produces fighter jets, missiles, and surveillance systems. Has faced environmental enforcement actions tied to hazardous chemical disposal.', adaptiveScore: 1 },
  { name: 'BAE Systems', description: 'Involved in weapons exports to conflict zones, including sales linked to human rights concerns. Manufacturing legacy includes significant hazardous waste sites.', adaptiveScore: 1 },
  { name: 'Leidos', description: 'Deeply embedded in government surveillance systems. Raises transparency and accountability concerns around data use in national security contexts.', adaptiveScore: 1 },
];

const FB_MINING = [
  { name: 'USA Rare Earth', description: 'Tied to significant land disruption and habitat destruction. Extraction of rare earth elements carries documented risks to soil, water, and surrounding ecosystems.', adaptiveScore: 1 },
  { name: 'Glencore', description: 'Multiple regulatory actions across Africa, South America, and Australia related to toxic spills, bribery, and human rights violations in mining communities.', adaptiveScore: 1 },
  { name: 'Freeport-McMoRan', description: "Responsible for massive tailings dumping in Indonesia's Ajkwa River system — one of the largest aquatic disposal operations of mining waste in the world.", adaptiveScore: 1 },
  { name: 'EQT Corporation', description: 'Fracking operations linked to groundwater contamination, methane leaks, and community health impacts.', adaptiveScore: 1 },
  { name: 'BP', description: 'Faced significant scrutiny following the Deepwater Horizon disaster, in which its cement work played a role.', adaptiveScore: 1 },
  { name: 'Newmont Corp.', description: 'Operations in Ghana, Peru, and Nevada have been linked to mercury contamination, water system disruption, and community displacement.', adaptiveScore: 1 },
  { name: 'Chesapeake Energy', description: 'Documented record of environmental violations. Previously filed for bankruptcy while continuing to lobby against fracking restrictions.', adaptiveScore: 1 },
  { name: 'Anglo American', description: 'Linked to water contamination, land degradation, and displacement of communities in South Africa, Chile, and Brazil.', adaptiveScore: 1 },
];

const FB_QUALIFICATIONS = `Champion innovation and forward-thinking ideas
Value strategic collaboration over transactional execution
Are committed to sustainable, long-term growth
Prioritize quality, creativity, and thoughtful decision-making
Understand the importance of building meaningful relationships with their audiences`;

const NonCompliantIndustriesPage = ({ pageData }) => {
  const d = pageData || {};

  const heroType = d.heroBackgroundType || 'Image';
  const heroVideoUrl = getStrapiMediaUrl(d.heroBackgroundVideo?.url);
  const heroImageUrl = getStrapiMediaUrl(d.heroBackgroundImage?.url) || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=2400&q=80';
  const introImgUrl = getStrapiMediaUrl(d.introImage?.url) || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
  const qualImgUrl = getStrapiMediaUrl(d.qualificationsImage?.url) || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';

  const industries = [
    {
      label: d.industry1Label || 'Non-Compliant Industry: #1',
      title: d.industry1Title || 'Big Oil & Petroleum',
      description: d.industry1Description || "Every strategy we create, every campaign we launch, and every solution we deliver is designed with both growth and responsibility in mind. Partnering with fossil fuel companies means lending our creative intelligence — and our reputation — to the active dismantling of the future we're working to build. Adaptive Intelligence does not accept clients in the petroleum or fossil fuel extraction sector. This isn't a political position; it's a business one. We believe the brands that will define the next era of industry are building sustainable energy systems, not defending the old ones. Our work belongs there.",
      companies: (d.industry1Companies && d.industry1Companies.length > 0) ? d.industry1Companies : FB_BIG_OIL,
    },
    {
      label: d.industry2Label || 'Non-Compliant Industry: #2',
      title: d.industry2Title || 'Defense Contractors',
      description: d.industry2Description || "Adaptive Intelligence was built on the belief that creativity and responsibility must go hand in hand. Defense contractors — particularly those whose core business is weapons manufacturing, military surveillance, and the production of systems deployed in active conflict zones — operate in direct contradiction to that principle. We do not partner with companies whose primary revenue is derived from weapons systems, military contracting, or the development of technology designed to harm. Where AI is concerned, we hold an especially firm line: we believe ethical AI deployment means building tools that expand human potential, not tools designed to target, track, or surveil people without accountability. That's not a market we're interested in serving.",
      companies: (d.industry2Companies && d.industry2Companies.length > 0) ? d.industry2Companies : FB_DEFENSE,
    },
    {
      label: d.industry3Label || 'Non-Compliant Industry: #3',
      title: d.industry3Title || 'Mining, Fracking & Drilling',
      description: d.industry3Description || "Mining, fracking, and drilling operations sit at the intersection of environmental destruction and community harm — contaminating water systems, destabilizing land, and disproportionately impacting the communities with the least power to push back. Adaptive Intelligence does not work with companies in the extractive industries whose business models depend on the disruption of ecosystems or the displacement of communities. We're committed to helping build the next era of industry — one where innovation doesn't come at the cost of the environment it depends on. Infusing modern business with real sustainability efforts is work we take seriously, and it starts with who we choose to work with.",
      companies: (d.industry3Companies && d.industry3Companies.length > 0) ? d.industry3Companies : FB_MINING,
    },
  ];

  const qualificationsBullets = (d.qualificationsList || FB_QUALIFICATIONS)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <SEO
        pageTitle={d.pageTitle || 'Non-Compliant Industries'}
        metaDescription={d.metaDescription || "The industries and organizations Adaptive Intelligence declines to work with — and why. Transparency about the values behind our client standards."}
        ogImage={d.pagePreviewImage}
      />
      <Header menuTextColor="white" />

      {/* Hero */}
      <section className="nci-hero">
        <div className="hero-background">
          {heroType === 'Video' && heroVideoUrl ? (
            <video autoPlay loop muted playsInline className="hero-bg-media">
              <source src={heroVideoUrl} type="video/mp4" />
            </video>
          ) : (
            <Image src={heroImageUrl} alt="Hero Background" fill style={{ objectFit: 'cover' }} quality={80} priority />
          )}
          <div className="hero-overlay" />
        </div>
        <div className="container position-relative z-2">
          <div className="row">
            <div className="col-lg-9 mx-auto text-center">
              <p className="hero-breadcrumb">
                <Link href="/eco">Eco</Link>
                <span className="separator">/</span>
                <span>Non-Compliant Industries</span>
              </p>
              <h1 className="hero-title font-recoleta">{d.heroTitle || 'Drawing The Line'}</h1>
              <p className="hero-subtitle">
                {d.heroSubtitle || 'Adaptive Intelligence is at the forefront of ethical, sustainable innovation. We want to partner with clients who do the same.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro — text left, image right */}
      <section className="content-section pt-150 pb-100 lg-pt-120 lg-pb-80 md-pt-80 md-pb-60">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-50 lg-mb-0">
              <div className="sc-title">{d.introTagline || 'Values That Set The Standard'}</div>
              <h2 className="section-title font-recoleta">{d.introTitle || 'Outside of Adaptive Values'}</h2>
              <p className="section-text">
                {d.introParagraph1 || "At Adaptive Intelligence, sustainability is not a side project — it's at the core of how we work. Building the future of industries means being honest about who is working against them. The relationships listed here have been declined based on their environmental track records, ESG performance, and active contributions to climate harm across three core industries."}
              </p>
              <p className="section-text">
                {d.introParagraph2 || "We publish this list for the same reason we host the NOAA papers: transparency matters. The more clearly we state what's wrong, the better equipped we all are to build what's right."}
              </p>
            </div>
            <div className="col-lg-6">
              <div className="section-image-wrapper ps-lg-5">
                <Image src={introImgUrl} alt={d.introTitle || 'Outside of Adaptive Values'} width={600} height={500} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} className="section-image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry sections */}
      <div className="industries-band">
        {industries.map((ind, idx) => (
          <section key={idx} className={`industry-section ${idx % 2 === 1 ? 'industry-alt' : ''} pt-100 pb-100 md-pt-60 md-pb-60`}>
            <div className="container">
              <div className="row">
                <div className="col-lg-9 mx-auto text-center mb-50">
                  <div className="sc-title">{ind.label}</div>
                  <h2 className="section-title font-recoleta mb-20">{ind.title}</h2>
                  <p className="section-text industry-desc">{ind.description}</p>
                  <div className="examples-label">Top 10 Examples</div>
                </div>
              </div>
              <IndustryCards companies={ind.companies} />
            </div>
          </section>
        ))}
      </div>

      {/* Scoring Standards — navy band */}
      <section className="scoring-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="scoring-title font-recoleta">{d.scoringTitle || 'Our Scoring Standards'}</h2>
              <p className="scoring-text">
                {d.scoringDescription || 'The ESG scores linked to each organization are sourced from publicly available ratings agencies. Our eco initiatives are available on the Eco page. To submit a resource, flag an update, or suggest an addition, contact us.'}
              </p>
              <div className="d-inline-block">
                <LetsTalkButton buttonText={d.scoringButtonText || 'Learn More'} href={d.scoringButtonUrl || '/eco'} showIcon={true} className="scoring-btn" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications — text left, image right */}
      <section className="content-section pt-150 pb-100 lg-pt-120 lg-pb-80 md-pt-80 md-pb-60">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-50 lg-mb-0">
              <div className="sc-title">{d.qualificationsTagline || 'Working With Adaptive Intelligence'}</div>
              <h2 className="section-title font-recoleta">{d.qualificationsTitle || 'Qualifications'}</h2>
              <p className="section-text">{d.qualificationsIntro || 'We intentionally choose our clients just as carefully as our clients choose us.'}</p>
              <p className="section-text mb-2">{d.qualificationsListIntro || 'Our Preferred Partner Program is best suited for organizations that:'}</p>
              <ul className="qualifications-list">
                {qualificationsBullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
              <p className="section-text">{d.qualificationsClosing || "Whether you're an emerging company creating a new category or an established brand evolving for the future, we look for partners who are dedicated to building something that lasts."}</p>
            </div>
            <div className="col-lg-6">
              <div className="section-image-wrapper ps-lg-5">
                <Image src={qualImgUrl} alt="Qualifications" width={600} height={500} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} className="section-image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — pink, two buttons */}
      <section className="nci-cta-section">
        <div className="cta-bg-holder"><div className="cta-fallback-bg" /></div>
        <div className="container position-relative z-2">
          <div className="row">
            <div className="col-lg-9 mx-auto text-center">
              <h2 className="cta-title font-recoleta">{d.ctaTitle || 'Innovation & Responsibility Can Coexist'}</h2>
              <p className="cta-subtitle">
                {d.ctaSubtitle || "We're building a community of businesses, creatives, and leaders who are ready to do both. If you believe your company is working toward something better — explore our Preferred Partners program, or reach out to collaborate on sustainable strategy."}
              </p>
              <div className="cta-buttons">
                <LetsTalkButton buttonText={d.ctaButton1Text || 'About Preferred Partners'} href={d.ctaButton1Url || '/preferred-partners'} showIcon={false} className="cta-btn-white" />
                <LetsTalkButton buttonText={d.ctaButton2Text || 'About Eco'} href={d.ctaButton2Url || '/eco'} showIcon={false} className="cta-btn-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterWithSettings />

      <style jsx>{`
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-link) { color: white !important; }
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item:hover .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.active .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.current-menu-item .nav-link) { color: #FF1292 !important; }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn) { color: white !important; border-color: white !important; background: transparent !important; }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn:hover) { color: black !important; background: white !important; }

        .z-2 { position: relative; z-index: 2; }
        .sc-title { color: #FF1292; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; font-weight: 600; margin-bottom: 20px; }
        .section-title { font-weight: 400; color: #151937; margin-bottom: 30px; font-size: 2.8rem; }
        .mb-20 { margin-bottom: 20px !important; }
        .section-text { font-size: 1.05rem; color: #555; line-height: 1.8; margin-bottom: 20px; }
        .qualifications-list { list-style: disc; padding-left: 22px; margin-bottom: 20px; }
        .qualifications-list li { font-size: 1.05rem; color: #555; line-height: 1.8; margin-bottom: 8px; }

        /* Hero */
        .nci-hero { position: relative; height: 70vh; min-height: 500px; display: flex; align-items: center; color: white; text-align: center; }
        .hero-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
        .hero-bg-media { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); }
        .hero-breadcrumb { font-size: 0.95rem; color: rgba(255, 255, 255, 0.8); margin-bottom: 20px; }
        .hero-breadcrumb a { color: rgba(255, 255, 255, 0.8); text-decoration: none; transition: color 0.3s; }
        .hero-breadcrumb a:hover { color: #FF1292; }
        .hero-breadcrumb .separator { margin: 0 10px; }
        .hero-title { font-size: 3.5rem; font-weight: 400; color: white; line-height: 1.2; margin-bottom: 20px; }
        .hero-subtitle { font-size: 1.15rem; color: rgba(255, 255, 255, 0.85); max-width: 700px; margin: 0 auto; line-height: 1.7; }

        /* Content Sections */
        .content-section { background: #ffffff; }
        .section-image-wrapper { position: relative; }
        :global(.section-image) { border-radius: 8px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12); }

        /* Industry sections */
        .industries-band { background: #ffffff; }
        .industry-section { background: #ffffff; }
        .industry-alt { background: #f8f9fa; }
        .industry-desc { max-width: 820px; margin-left: auto; margin-right: auto; }
        .examples-label { color: #FF1292; text-transform: uppercase; letter-spacing: 2px; font-size: 13px; font-weight: 600; margin-top: 26px; }

        /* Scoring — navy */
        .scoring-section { background: #151937; padding: 90px 0; }
        .scoring-title { color: #ffffff; font-size: 2.6rem; font-weight: 400; margin-bottom: 22px; }
        .scoring-text { color: rgba(255, 255, 255, 0.8); font-size: 1.05rem; line-height: 1.8; max-width: 720px; margin: 0 auto 36px; }
        :global(.scoring-btn) { background-color: #ffffff !important; color: #151937 !important; border: none !important; padding: 15px 38px !important; border-radius: 0 !important; font-weight: 600 !important; }
        :global(.scoring-btn:hover) { background-color: #FF1292 !important; color: #ffffff !important; }

        /* CTA — pink */
        .nci-cta-section { position: relative; padding: 110px 0; }
        .cta-bg-holder { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
        .cta-fallback-bg { width: 100%; height: 100%; background: linear-gradient(90deg, #ff1292 0%, #e6118a 100%); }
        .cta-title { font-size: 3rem; font-weight: 400; color: white; margin-bottom: 20px; }
        .cta-subtitle { font-size: 1.1rem; color: rgba(255, 255, 255, 0.92); max-width: 760px; margin: 0 auto 40px; line-height: 1.7; }
        .cta-buttons { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
        :global(.cta-btn-white) { background-color: #ffffff !important; color: #d61096 !important; border: none !important; padding: 16px 40px !important; border-radius: 0 !important; font-weight: 600 !important; }
        :global(.cta-btn-white:hover) { background-color: #f2f2f2 !important; transform: translateY(-2px); color: #b00d7c !important; }

        @media (max-width: 991px) {
          .hero-title { font-size: 2.8rem; }
          .section-title { font-size: 2.2rem; }
          .section-image-wrapper { margin-top: 40px; }
          .scoring-title { font-size: 2.1rem; }
        }
        @media (max-width: 768px) {
          .nci-hero { height: 60vh; min-height: 400px; }
          .hero-title { font-size: 2rem; }
          .hero-subtitle { font-size: 1rem; }
          .nci-cta-section { padding: 80px 0; }
          .section-title { font-size: 1.8rem; }
          .cta-title { font-size: 2.2rem; }
        }
      `}</style>
    </>
  );
};

export async function getStaticProps() {
  let pageData = null;
  try {
    const { getStrapiApiUrl } = await import('@/utils/strapi');
    const url = `${getStrapiApiUrl()}/api/non-compliant-page?populate=*`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      pageData = json.data || null;
    }
  } catch (error) {
    console.error('Error fetching Non-Compliant Industries page data:', error.message);
  }
  return { props: { pageData }, revalidate: 60 };
}

export default NonCompliantIndustriesPage;
