import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header/Header';
import FooterWithSettings from "@/components/footer/FooterWithSettings";
import LetsTalkButton from '@/components/LetsTalkButton';
import SEO from '@/components/SEO';
import { getStrapiApiUrl, getStrapiMediaUrl } from '@/utils/strapi';

const PreferredPartnersPage = ({ pageData }) => {
  const d = pageData || {};

  // Hero background
  const heroType = d.heroBackgroundType || 'Image';
  const heroVideoUrl = getStrapiMediaUrl(d.heroBackgroundVideo?.url);
  const heroImageUrl = getStrapiMediaUrl(d.heroBackgroundImage?.url) || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=2400&q=80';

  // Section images
  const rateImgUrl = getStrapiMediaUrl(d.rateImage?.url) || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
  const relationshipImgUrl = getStrapiMediaUrl(d.relationshipImage?.url) || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80';
  const qualificationsImgUrl = getStrapiMediaUrl(d.qualificationsImage?.url) || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';

  // Qualifications bullet list: one bullet per non-empty line.
  const qualificationsBullets = (
    d.qualificationsList ||
    `Champion innovation and forward-thinking ideas
Value strategic collaboration over transactional execution
Are committed to sustainable, long-term growth
Prioritize quality, creativity, and thoughtful decision-making
Understand the importance of building meaningful relationships with their audiences`
  )
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <SEO
        pageTitle={d.pageTitle || "Preferred Partners"}
        metaDescription={d.metaDescription || "Our Preferred Partner Program — a reduced rate for organizations whose mission and values align with ours."}
        ogImage={d.pagePreviewImage}
      />
      <Header menuTextColor="white" />

      {/* Section 1: Hero */}
      <section className="pp-hero">
        <div className="hero-background">
          {heroType === 'Video' && heroVideoUrl ? (
            <video autoPlay loop muted playsInline className="hero-bg-media">
              <source src={heroVideoUrl} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={heroImageUrl}
              alt="Hero Background"
              fill
              style={{ objectFit: 'cover' }}
              quality={80}
              priority
            />
          )}
          <div className="hero-overlay" />
        </div>
        <div className="container position-relative z-2">
          <div className="row">
            <div className="col-lg-9 mx-auto text-center">
              <p className="hero-breadcrumb">
                <Link href="/">Home</Link>
                <span className="separator">/</span>
                <span>Preferred Partners</span>
              </p>
              <h1 className="hero-title font-recoleta">
                {d.heroTitle || 'Preferred Partners'}
              </h1>
              <p className="hero-subtitle">
                {d.heroSubtitle || 'Adaptive Intelligence is at the forefront of ethical, sustainable innovation. We want to acknowledge clients who do the same.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Preferred Partner Rate — text left, image right */}
      <section className="content-section pt-150 pb-100 lg-pt-120 lg-pb-80 md-pt-80 md-pb-60">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-50 lg-mb-0">
              <div className="sc-title">{d.rateTagline || 'For Sustainable Innovators'}</div>
              <h2 className="section-title font-recoleta">
                {d.rateTitle || 'Preferred Partner Rate'}
              </h2>
              <p className="section-text">
                {d.rateParagraph1 || 'Clients choose us for our precision in marketing that scales with intelligence and resonates with emotion.'}
              </p>
              <p className="section-text">
                {d.rateParagraph2 || 'We believe exceptional marketing happens when strategy and creativity work in harmony. Every campaign, message, and customer touch-point should not only drive measurable growth, but also strengthen the relationship between a brand and the people it serves.'}
              </p>
              <p className="section-text">
                {d.rateParagraph3 || 'Our work is designed to help brands grow consciously, sustainably, and ahead of the curve. We partner with organizations that are committed to building something meaningful — brands that understand growth is most valuable when it creates lasting impact for customers, communities, and the industries they help shape.'}
              </p>
            </div>
            <div className="col-lg-6">
              <div className="section-image-wrapper ps-lg-5">
                <Image
                  src={rateImgUrl}
                  alt="Preferred Partner Rate"
                  width={600}
                  height={500}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  className="section-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: A Relationship Based on Shared Visions — image left, text right */}
      <section className="content-section relationship-bg pt-150 pb-100 lg-pt-120 lg-pb-80 md-pt-80 md-pb-60">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-1 order-2 mb-50 lg-mb-0">
              <div className="section-image-wrapper pe-lg-5">
                <Image
                  src={relationshipImgUrl}
                  alt="A Relationship Based on Shared Visions"
                  width={600}
                  height={500}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  className="section-image"
                />
              </div>
            </div>
            <div className="col-lg-6 order-lg-2 order-1 mb-50 lg-mb-0">
              <div className="sc-title">{d.relationshipTagline || 'Acknowledging Those Who Make a Difference'}</div>
              <h2 className="section-title font-recoleta">
                {d.relationshipTitle || 'A Relationship Based on Shared Visions'}
              </h2>
              <p className="section-text">
                {d.relationshipParagraph1 || 'The modern business landscape often rewards short-term wins over long-term value. We take a different approach.'}
              </p>
              <p className="section-text">
                {d.relationshipParagraph2 || "The strongest client relationships are built on shared vision, mutual trust, and a commitment to doing exceptional work together. That's why we created our Preferred Partner Program."}
              </p>
              <p className="section-text">
                {d.relationshipParagraph3 || 'This program is reserved for organizations whose mission, leadership, and dedication align with the values we prioritize as an agency. Rather than treating every engagement as a transactional service, we invest deeply in partnerships where both teams are committed to building sustainable growth over time.'}
              </p>
              <p className="section-text">
                {d.relationshipParagraph4 || "Preferred Partners receive access to our Adaptive team's specialized marketing services at a reduced rate as a reflection of that commitment."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Qualifications — text left, image right */}
      <section className="content-section pt-150 pb-100 lg-pt-120 lg-pb-80 md-pt-80 md-pb-60">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-50 lg-mb-0">
              <div className="sc-title">{d.qualificationsTagline || 'Becoming a Partner'}</div>
              <h2 className="section-title font-recoleta">
                {d.qualificationsTitle || 'Qualifications'}
              </h2>
              <p className="section-text">
                {d.qualificationsIntro || 'We intentionally choose our clients just as carefully as our clients choose us.'}
              </p>
              <p className="section-text mb-2">
                {d.qualificationsListIntro || 'Our Preferred Partner Program is best suited for organizations that:'}
              </p>
              <ul className="qualifications-list">
                {qualificationsBullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
              <p className="section-text">
                {d.qualificationsClosing || "Whether you're an emerging company creating a new category or an established brand evolving for the future, we look for partners who are dedicated to building something that lasts."}
              </p>
            </div>
            <div className="col-lg-6">
              <div className="section-image-wrapper ps-lg-5">
                <Image
                  src={qualificationsImgUrl}
                  alt="Qualifications"
                  width={600}
                  height={500}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  className="section-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: CTA */}
      <section className="pp-cta-section">
        <div className="cta-bg-holder">
          <div className="cta-fallback-bg" />
        </div>
        <div className="container position-relative z-2">
          <div className="row">
            <div className="col-lg-9 mx-auto text-center">
              <h2 className="cta-title font-recoleta">
                {d.ctaTitle || 'Interested in Becoming a Preferred Partner?'}
              </h2>
              <p className="cta-subtitle">
                {d.ctaSubtitle || "We welcome conversations with organizations that are building for the future and seeking a marketing partner equally committed to the journey. Let's explore what's possible together. Click below to apply as a preferred partner and get access to the Adaptive Team at a discounted rate."}
              </p>
              <div className="d-inline-block">
                <LetsTalkButton
                  buttonText={d.ctaButtonText || 'Apply as a Preferred Partner'}
                  href={d.ctaButtonUrl || '/contact'}
                  showIcon={false}
                  className="cta-btn-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterWithSettings />

      <style jsx>{`
        /* White header for hero */
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-link) { color: white !important; }
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item:hover .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.active .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.current-menu-item .nav-link) { color: #FF1292 !important; }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn) { color: white !important; border-color: white !important; background: transparent !important; }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn:hover) { color: black !important; background: white !important; }

        .z-2 { position: relative; z-index: 2; }
        .sc-title { color: #FF1292; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; font-weight: 600; margin-bottom: 20px; }
        .section-title { font-weight: 400; color: #151937; margin-bottom: 30px; font-size: 2.8rem; }
        .section-text { font-size: 1.05rem; color: #555; line-height: 1.8; margin-bottom: 20px; }
        .qualifications-list { list-style: disc; padding-left: 22px; margin-bottom: 20px; }
        .qualifications-list li { font-size: 1.05rem; color: #555; line-height: 1.8; margin-bottom: 8px; }

        /* Hero */
        .pp-hero { position: relative; height: 70vh; min-height: 500px; display: flex; align-items: center; color: white; text-align: center; }
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
        .relationship-bg { background: #f8f9fa; }
        .section-image-wrapper { position: relative; }
        :global(.section-image) { border-radius: 8px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12); }

        /* CTA — solid magenta band (matches design) */
        .pp-cta-section { position: relative; padding: 110px 0; }
        .cta-bg-holder { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
        .cta-fallback-bg { width: 100%; height: 100%; background: linear-gradient(90deg, #ff1292 0%, #e6118a 100%); }
        .cta-title { font-size: 3rem; font-weight: 400; color: white; margin-bottom: 20px; }
        .cta-subtitle { font-size: 1.1rem; color: rgba(255, 255, 255, 0.92); max-width: 760px; margin: 0 auto 40px; line-height: 1.7; }

        :global(.cta-btn-white) {
          background-color: #ffffff !important;
          color: #d61096 !important;
          border: none !important;
          padding: 16px 40px !important;
          border-radius: 0 !important;
          font-weight: 600 !important;
        }
        :global(.cta-btn-white:hover) {
          background-color: #f2f2f2 !important;
          transform: translateY(-2px);
          color: #b00d7c !important;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .hero-title { font-size: 2.8rem; }
          .section-title { font-size: 2.2rem; }
          .section-image-wrapper { margin-top: 40px; }
        }
        @media (max-width: 768px) {
          .pp-hero { height: 60vh; min-height: 400px; }
          .hero-title { font-size: 2rem; }
          .hero-subtitle { font-size: 1rem; }
          .pp-cta-section { padding: 80px 0; }
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
    const url = `${getStrapiApiUrl()}/api/preferred-partners-page?populate=*`;
    const res = await fetch(url);

    if (res.ok) {
      const json = await res.json();
      pageData = json.data || null;
    }
  } catch (error) {
    console.error("Error fetching Preferred Partners page data:", error.message);
  }

  return {
    props: { pageData },
    revalidate: 60,
  };
}

export default PreferredPartnersPage;
