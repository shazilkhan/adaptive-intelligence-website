import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header/Header';
import FooterWithSettings from "@/components/footer/FooterWithSettings";
import LetsTalkButton from '@/components/LetsTalkButton';
import SEO from '@/components/SEO';
import { getStrapiApiUrl, getStrapiMediaUrl } from '@/utils/strapi';

const DEFAULT_SPOTIFY_EMBED = 'https://open.spotify.com/embed/playlist/37i9dQZF1EpoYM2VvfSDDr?utm_source=generator';

const AdaptivePlaylistPage = ({ pageData }) => {
  const d = pageData || {};

  const heroType = d.heroBackgroundType || 'Image';
  const heroVideoUrl = getStrapiMediaUrl(d.heroBackgroundVideo?.url);
  const heroImageUrl = getStrapiMediaUrl(d.heroBackgroundImage?.url) || 'https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=2400&q=80';
  const creativesImgUrl = getStrapiMediaUrl(d.creativesImage?.url) || 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?auto=format&fit=crop&w=1200&q=80';
  const ctaBgUrl = getStrapiMediaUrl(d.ctaBackgroundImage?.url) || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80';

  const spotifyEmbedUrl = (d.spotifyEmbedUrl && d.spotifyEmbedUrl.trim()) || DEFAULT_SPOTIFY_EMBED;

  return (
    <>
      <SEO
        pageTitle={d.pageTitle || 'Adaptive Playlist'}
        metaDescription={d.metaDescription || "The soundtrack to our work. The Adaptive Playlist is the living playlist inside Adaptive Intelligence — follow along and find your people."}
        ogImage={d.pagePreviewImage}
      />
      <Header menuTextColor="white" />

      {/* Hero */}
      <section className="ab-hero">
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
                <Link href="/creatives">Creatives</Link>
                <span className="separator">/</span>
                <span>Adaptive Playlist</span>
              </p>
              <h1 className="hero-title font-recoleta">{d.heroTitle || 'Adaptive Playlist'}</h1>
              <p className="hero-subtitle">
                {d.heroSubtitle || 'This is what it sounds like inside Adaptive Intelligence. Follow along and find your people.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Creatives, By Creatives — text left, image right */}
      <section className="content-section pt-150 pb-100 lg-pt-120 lg-pb-80 md-pt-80 md-pb-60">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-50 lg-mb-0">
              <div className="sc-title">{d.creativesTagline || 'The Soundtrack To Our Work'}</div>
              <h2 className="section-title font-recoleta">{d.creativesTitle || 'For Creatives, By Creatives'}</h2>
              <p className="section-text">
                {d.creativesParagraph1 || "Great work doesn't happen in silence. Adaptive Beats is our living, breathing playlist. Updated by the team, shaped by the projects we're building and the people building them. If this is the kind of energy you work in, we'd love to meet you."}
              </p>
              <p className="section-text">
                {d.creativesParagraph2 || "Adaptive is home to designers, strategists, developers, and storytellers who don't separate their craft from their culture. The music changes as the work does — and right now, this is what's driving it."}
              </p>
              <p className="section-text">
                {d.creativesParagraph3 || "Great creative communities don't happen by accident. They're built by people who show up with curiosity, care about the craft, and push each other to go further. If that sounds like you, follow along."}
              </p>
            </div>
            <div className="col-lg-6">
              <div className="section-image-wrapper ps-lg-5">
                <Image src={creativesImgUrl} alt={d.creativesTitle || 'For Creatives, By Creatives'} width={600} height={620} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} className="section-image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Current Rotation — Spotify embed left, text right */}
      <section className="content-section rotation-bg pt-150 pb-100 lg-pt-120 lg-pb-80 md-pt-80 md-pb-60">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-1 order-2 mb-50 lg-mb-0">
              <div className="spotify-embed-wrapper pe-lg-5">
                <iframe
                  data-testid="embed-iframe"
                  className="spotify-embed"
                  src={spotifyEmbedUrl}
                  width="100%"
                  height="452"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Adaptive Playlist"
                />
              </div>
            </div>
            <div className="col-lg-6 order-lg-2 order-1 mb-50 lg-mb-0">
              <div className="sc-title">{d.rotationTagline || 'Now Playing'}</div>
              <h2 className="section-title font-recoleta">{d.rotationTitle || 'The Current Rotation'}</h2>
              <p className="section-text">
                {d.rotationParagraph1 || "Every track on this playlist earned its spot the same way our creatives do: by bringing something real to the table. Adaptive Beats isn't curated for optics. It's what's actually playing when the work is getting done."}
              </p>
              <p className="section-text">
                {d.rotationParagraph2 || "The playlist you're looking at was built by the same people who build campaigns, brand identities, and creative strategies for clients around the world. It's eclectic by design — because that's how we work. Whether you're a designer, strategist, developer, or storyteller, if this is the kind of culture you want to be part of, there's a place for you here."}
              </p>
              <p className="section-text">
                {d.rotationParagraph3 || "Browse the rotation, get a feel for who we are, and if it resonates, we're always looking for talented people who care about what they make and why they make it. Follow the playlist, then come find us."}
              </p>
              <div className="d-inline-block">
                <LetsTalkButton buttonText={d.rotationButtonText || 'Join Our Playlist'} href={d.rotationButtonUrl || 'https://open.spotify.com/playlist/37i9dQZF1EpoYM2VvfSDDr'} showIcon={false} className="rotation-btn" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — image bg with pink overlay */}
      <section className="ab-cta-section">
        <div className="cta-bg-holder">
          <Image src={ctaBgUrl} alt="" fill style={{ objectFit: 'cover' }} quality={70} />
          <div className="cta-overlay" />
        </div>
        <div className="container position-relative z-2">
          <div className="row">
            <div className="col-lg-9 mx-auto text-center">
              <h2 className="cta-title font-recoleta">{d.ctaTitle || 'Feeling Inspired Yet?'}</h2>
              <p className="cta-subtitle">{d.ctaSubtitle || 'Join The Adaptive Team'}</p>
              <div className="d-inline-block">
                <LetsTalkButton buttonText={d.ctaButtonText || 'Learn More'} href={d.ctaButtonUrl || '/contact'} showIcon={false} className="cta-btn-white" />
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
        .section-text { font-size: 1.05rem; color: #555; line-height: 1.8; margin-bottom: 20px; }

        /* Hero */
        .ab-hero { position: relative; height: 70vh; min-height: 500px; display: flex; align-items: center; color: white; text-align: center; }
        .hero-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
        .hero-bg-media { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.45); }
        .hero-breadcrumb { font-size: 0.95rem; color: rgba(255, 255, 255, 0.8); margin-bottom: 20px; }
        .hero-breadcrumb a { color: rgba(255, 255, 255, 0.8); text-decoration: none; transition: color 0.3s; }
        .hero-breadcrumb a:hover { color: #FF1292; }
        .hero-breadcrumb .separator { margin: 0 10px; }
        .hero-title { font-size: 3.5rem; font-weight: 400; color: white; line-height: 1.2; margin-bottom: 20px; }
        .hero-subtitle { font-size: 1.15rem; color: rgba(255, 255, 255, 0.85); max-width: 700px; margin: 0 auto; line-height: 1.7; }

        /* Content Sections */
        .content-section { background: #ffffff; }
        .rotation-bg { background: #f8f9fa; }
        .section-image-wrapper { position: relative; }
        :global(.section-image) { border-radius: 12px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); }

        /* Spotify embed */
        .spotify-embed-wrapper { position: relative; width: 100%; }
        .spotify-embed { border: 0; border-radius: 12px; display: block; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18); }

        :global(.rotation-btn) { background-color: #ffffff !important; color: #151937 !important; border: 1px solid #ff1292 !important; padding: 15px 34px !important; border-radius: 0 !important; font-weight: 600 !important; }
        :global(.rotation-btn:hover) { background-color: #FF1292 !important; color: #ffffff !important; }

        /* CTA */
        .ab-cta-section { position: relative; padding: 120px 0; }
        .cta-bg-holder { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
        .cta-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(90deg, rgba(55, 20, 64, 0.85) 0%, rgba(230, 17, 138, 0.82) 100%); }
        .cta-title { font-size: 3.2rem; font-weight: 400; color: white; margin-bottom: 10px; }
        .cta-subtitle { font-size: 1.6rem; color: rgba(255, 255, 255, 0.92); margin: 0 auto 40px; line-height: 1.5; font-family: 'Recoleta', serif; }
        :global(.cta-btn-white) { background-color: #ffffff !important; color: #000000 !important; border: none !important; padding: 16px 40px !important; border-radius: 0 !important; font-weight: 600 !important; }
        :global(.cta-btn-white:hover) { background-color: #f2f2f2 !important; transform: translateY(-2px); color: #d61096 !important; }

        @media (max-width: 991px) {
          .hero-title { font-size: 2.8rem; }
          .section-title { font-size: 2.2rem; }
          .section-image-wrapper { margin-top: 40px; }
          .spotify-embed-wrapper { margin-top: 10px; }
        }
        @media (max-width: 768px) {
          .ab-hero { height: 60vh; min-height: 400px; }
          .hero-title { font-size: 2rem; }
          .hero-subtitle { font-size: 1rem; }
          .ab-cta-section { padding: 80px 0; }
          .section-title { font-size: 1.8rem; }
          .cta-title { font-size: 2.2rem; }
          .cta-subtitle { font-size: 1.25rem; }
        }
      `}</style>
    </>
  );
};

export async function getStaticProps() {
  let pageData = null;
  try {
    const { getStrapiApiUrl } = await import('@/utils/strapi');
    // NOTE: the Strapi content type is still `adaptive-beats-page`. The page was
    // renamed to "Adaptive Playlist" (URL + nav) but the CMS UID is deliberately
    // unchanged — renaming it would create a new table and orphan the published entry.
    const url = `${getStrapiApiUrl()}/api/adaptive-beats-page?populate=*`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      pageData = json.data || null;
    }
  } catch (error) {
    console.error('Error fetching Adaptive Playlist page data:', error.message);
  }
  return { props: { pageData }, revalidate: 60 };
}

export default AdaptivePlaylistPage;
