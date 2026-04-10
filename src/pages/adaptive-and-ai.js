import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header/Header';
import FooterWithSettings from "@/components/footer/FooterWithSettings";
import LetsTalkButton from '@/components/LetsTalkButton';
import SEO from '@/components/SEO';
import { getStrapiApiUrl, getStrapiMediaUrl } from '@/utils/strapi';

const AdaptiveAndAiPage = ({ pageData }) => {
  const d = pageData || {};

  // Hero background
  const heroType = d.heroBackgroundType || 'Image';
  const heroVideoUrl = getStrapiMediaUrl(d.heroBackgroundVideo?.url);
  const heroImageUrl = getStrapiMediaUrl(d.heroBackgroundImage?.url) || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=2400&q=80';

  // Section images
  const methodologyImgUrl = getStrapiMediaUrl(d.methodologyImage?.url) || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
  const aiModelImgUrl = getStrapiMediaUrl(d.aiModelImage?.url) || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80';


  return (
    <>
      <SEO
        pageTitle={d.pageTitle || "Adaptive & AI"}
        metaDescription={d.metaDescription || "Our methodology and AI model — how human creativity and adaptive intelligence work together."}
        ogImage={d.pagePreviewImage}
      />
      <Header menuTextColor="white" />

      {/* Section 1: Hero */}
      <section className="aai-hero">
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
                <Link href="/about">About Us</Link>
                <span className="separator">/</span>
                <span>Adaptive &amp; AI</span>
              </p>
              <h1 className="hero-title font-recoleta">
                {d.heroTitle || 'Human-Led Creativity, AI-Enhanced Execution'}
              </h1>
              {d.heroSubtitle && (
                <p className="hero-subtitle">{d.heroSubtitle}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Our Methodology — text left, image right */}
      <section className="content-section pt-150 pb-100 lg-pt-120 lg-pb-80 md-pt-80 md-pb-60">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-50 lg-mb-0">
              <div className="sc-title">{d.methodologyTagline || 'Our Approach'}</div>
              <h2 className="section-title font-recoleta">
                {d.methodologyTitle || 'Our Methodology'}
              </h2>
              <p className="section-text">
                {d.methodologyParagraph1 || 'Adaptive Intelligence is led by the ingenuity of the human mind and spirit. We believe that the most impactful creative direction — brand narrative, positioning, and messaging — originates from human insight, intuition, and lived experience. While AI continues to evolve rapidly, it does not replicate the depth of original thought and analogue creativity that drives meaningful growth.'}
              </p>
              <p className="section-text pink-highlight">
                {d.methodologyParagraph2 || 'Our position is clear: AI is a powerful tool, but it is not a substitute for — or a means to amplify human capability — not replace it.'}
              </p>
            </div>
            <div className="col-lg-6">
              <div className="section-image-wrapper ps-lg-5">
                <Image
                  src={methodologyImgUrl}
                  alt="Our Methodology"
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

      {/* Section 3: Our AI Model — image left, text right */}
      <section className="content-section ai-model-bg pt-150 pb-100 lg-pt-120 lg-pb-80 md-pt-80 md-pb-60">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-1 order-2 mb-50 lg-mb-0">
              <div className="section-image-wrapper pe-lg-5">
                <Image
                  src={aiModelImgUrl}
                  alt="Our AI Model"
                  width={600}
                  height={500}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  className="section-image"
                />
              </div>
            </div>
            <div className="col-lg-6 order-lg-2 order-1 mb-50 lg-mb-0">
              <div className="sc-title">{d.aiModelTagline || 'Creative Excellence'}</div>
              <h2 className="section-title font-recoleta">
                {d.aiModelTitle || 'Our AI Model'}
              </h2>
              <h3 className="pink-subtitle">
                {d.aiModelSubtitle || 'Creativity Over Automation'}
              </h3>
              <p className="section-text">
                {d.aiModelParagraph1 || 'Our model is designed to reflect our philosophy: all core creative — campaign concepts, design direction, and messaging frameworks — is developed organically by our team. From there, AI is introduced as a secondary layer to enhance performance and efficiency, not to replace the creative process.'}
              </p>
              <p className="section-text">
                {d.aiModelParagraph2 || 'Initial campaigns are developed and launched through a fully human-led process to establish performance benchmarks. Once data is collected, we use AI to generate and test intuitive audience variables by audience, keyword, regional focus, or unique value proposition — allowing us to scale output efficiently while maintaining campaign integrity.'}
              </p>
              <p className="section-text">
                {d.aiModelParagraph3 || 'All final output — creative direction, messaging, and publishing — remain human-reviewed and approved. In parallel, we are actively developing a dedicated AI framework that prioritizes ethical usage, data integrity, and indigenous creative independence. This multi-year initiative governs data sourcing, licensing, and responsible implementation across our technology stack.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: CTA */}
      <section className="aai-cta-section">
        <div className="cta-bg-holder">
          <div className="cta-fallback-bg" />
          <div className="cta-overlay" />
        </div>
        <div className="container position-relative z-2">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="cta-title font-recoleta">
                {d.ctaTitle || 'Want To Know More?'}
              </h2>
              <p className="cta-subtitle">
                {d.ctaSubtitle || "Our commitment to progress doesn't come at the expense of human creativity. Instead, they work in tandem. Learn more about how we are pushing the boundaries of human creativity."}
              </p>
              <div className="d-inline-block">
                <LetsTalkButton
                  buttonText={d.ctaButtonText || 'Our Services'}
                  href={d.ctaButtonUrl || '/services'}
                  showIcon={true}
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
        .pink-highlight { color: #FF1292; font-style: italic; font-weight: 500; }
        .pink-subtitle { color: #FF1292; font-size: 1.25rem; font-weight: 500; margin-bottom: 25px; }

        /* Hero */
        .aai-hero { position: relative; height: 70vh; min-height: 500px; display: flex; align-items: center; color: white; text-align: center; }
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
        .ai-model-bg { background: #f8f9fa; }
        .section-image-wrapper { position: relative; }
        :global(.section-image) { border-radius: 8px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12); }

        /* CTA */
        .aai-cta-section { position: relative; padding: 120px 0; }
        .cta-bg-holder { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
        .cta-fallback-bg { width: 100%; height: 100%; background: #371440; }
        .cta-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(90deg, rgba(55, 20, 64, 0.9) 0%, rgba(149, 18, 99, 0.85) 100%); z-index: 1; }
        .cta-title { font-size: 3rem; font-weight: 400; color: white; margin-bottom: 20px; }
        .cta-subtitle { font-size: 1.1rem; color: rgba(255, 255, 255, 0.85); max-width: 650px; margin: 0 auto 40px; line-height: 1.7; }

        :global(.cta-btn-white) {
          background-color: #ffffff !important;
          color: #000000 !important;
          border: none !important;
          padding: 16px 40px !important;
          border-radius: 0 !important;
          font-weight: 600 !important;
        }
        :global(.cta-btn-white:hover) {
          background-color: #f2f2f2 !important;
          transform: translateY(-2px);
          color: #d61096 !important;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .hero-title { font-size: 2.8rem; }
          .section-title { font-size: 2.2rem; }
          .section-image-wrapper { margin-top: 40px; }
        }
        @media (max-width: 768px) {
          .aai-hero { height: 60vh; min-height: 400px; }
          .hero-title { font-size: 2rem; }
          .hero-subtitle { font-size: 1rem; }
          .aai-cta-section { padding: 80px 0; }
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
    const url = `${getStrapiApiUrl()}/api/adaptive-ai-page?populate=*`;
    const res = await fetch(url);

    if (res.ok) {
      const json = await res.json();
      pageData = json.data || null;
    }
  } catch (error) {
    console.error("Error fetching Adaptive & AI page data:", error.message);
  }

  return {
    props: { pageData },
    revalidate: 60,
  };
}

export default AdaptiveAndAiPage;
