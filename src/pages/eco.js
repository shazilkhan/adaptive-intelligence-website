import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header/Header';
import FooterWithSettings from "@/components/footer/FooterWithSettings";
import SEO from '@/components/SEO';
import { getStrapiApiUrl, getStrapiMediaUrl } from '@/utils/strapi';

// The three hub topics each map to a section further down the page. A card's
// `buttonUrl` from Strapi wins; otherwise we derive the target from its
// iconType, then its title, then its position (the CMS entry for "Practical
// Tools" has no iconType set).
const HUB_KINDS = ['tools', 'research', 'community'];
const resolveHubKind = (card, index) => {
  if (HUB_KINDS.includes(card.iconType)) return card.iconType;
  const t = (card.title || '').toLowerCase();
  if (/tool|framework/.test(t)) return 'tools';
  if (/research|report|noaa/.test(t)) return 'research';
  if (/communit/.test(t)) return 'community';
  return HUB_KINDS[index] || 'tools';
};

// Shown in the "Practical Tools and Frameworks" section until the team adds
// their own `toolResources` in Strapi. All are free, public frameworks.
const FALLBACK_TOOL_RESOURCES = [
  {
    title: 'B Impact Assessment',
    sourceLabel: 'B Lab',
    description: "A free assessment that measures a company's impact on its workers, community, customers and the environment — the same framework used for B Corp certification.",
    url: 'https://www.bcorporation.net/en-us/programs-and-tools/b-impact-assessment/',
  },
  {
    title: 'GHG Protocol Corporate Standard',
    sourceLabel: 'Greenhouse Gas Protocol',
    description: 'The most widely used standard for measuring and reporting Scope 1, 2 and 3 greenhouse gas emissions — the starting point for any credible climate plan.',
    url: 'https://ghgprotocol.org/corporate-standard',
  },
  {
    title: 'Science Based Targets',
    sourceLabel: 'SBTi',
    description: 'Guidance and validation for setting emissions-reduction targets that are in line with climate science and the goals of the Paris Agreement.',
    url: 'https://sciencebasedtargets.org/',
  },
  {
    title: 'Sustainable Development Goals',
    sourceLabel: 'United Nations',
    description: 'Seventeen global goals that give businesses a shared language for setting sustainability priorities and reporting progress.',
    url: 'https://sdgs.un.org/goals',
  },
  {
    title: 'ISSB / SASB Standards',
    sourceLabel: 'IFRS Foundation',
    description: 'Industry-specific disclosure standards for the sustainability information investors and partners ask for most.',
    url: 'https://sasb.ifrs.org/standards/',
  },
  {
    title: 'Circular Economy Introduction',
    sourceLabel: 'Ellen MacArthur Foundation',
    description: 'Practical guides, case studies and design tools for moving from a take-make-waste model to a circular one.',
    url: 'https://www.ellenmacarthurfoundation.org/topics/circular-economy-introduction/overview',
  },
];

const ExternalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const formatFileSize = (sizeKb) => {
  const kb = Number(sizeKb);
  if (!kb || Number.isNaN(kb)) return null;
  if (kb >= 1024) return `${(kb / 1024).toFixed(kb >= 10240 ? 0 : 1)} MB`;
  return `${Math.round(kb)} KB`;
};

// Turn a Strapi upload filename like "noaa_61592_DS_1_f88bd27c31.pdf" into
// something readable when no caption was provided.
const prettifyFileName = (name = '') =>
  name
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/_[a-f0-9]{10}$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim();

// Normalise Strapi media entries (or the legacy single download URL) into
// { title, url, size, isPdf } for the embed.
const buildNoaaPapers = (pageData) => {
  const media = Array.isArray(pageData.noaaPapers) ? pageData.noaaPapers : [];
  const papers = media
    .map((file) => {
      const url = getStrapiMediaUrl(file?.url);
      if (!url) return null;
      return {
        title: file.caption || file.alternativeText || prettifyFileName(file.name) || 'NOAA paper',
        url,
        size: file.size,
        isPdf: (file.mime || '').includes('pdf') || /\.pdf($|\?)/i.test(url),
      };
    })
    .filter(Boolean);

  if (papers.length === 0 && pageData.noaaDownloadUrl) {
    papers.push({
      title: pageData.noaaDownloadButtonText || 'NOAA Papers',
      url: pageData.noaaDownloadUrl,
      size: null,
      isPdf: /\.pdf($|\?)/i.test(pageData.noaaDownloadUrl),
    });
  }
  return papers;
};

// Only auto-open a paper in the inline viewer when it's small enough that the
// browser won't be forced to fetch a huge file on page load (the current NOAA
// bundle is ~210 MB — that one stays click-to-load).
const AUTO_EMBED_MAX_KB = 20 * 1024;

const NoaaPapersEmbed = ({ papers }) => {
  const [activeIndex, setActiveIndex] = useState(() => {
    const first = papers[0];
    return first && first.isPdf && first.size && Number(first.size) <= AUTO_EMBED_MAX_KB ? 0 : -1;
  });
  // Mobile browsers (iOS Safari especially) render only the first page of a
  // PDF inside an iframe, so on small screens we skip the inline viewer.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!papers || papers.length === 0) return null;

  const active = activeIndex >= 0 ? papers[activeIndex] : null;

  return (
    <div className="noaa-papers">
      <ul className="noaa-paper-list">
        {papers.map((paper, index) => {
          const size = formatFileSize(paper.size);
          const isActive = index === activeIndex;
          return (
            <li key={paper.url} className={`noaa-paper${isActive ? ' is-active' : ''}`}>
              <div className="noaa-paper-meta">
                <span className="noaa-paper-title">{paper.title}</span>
                <span className="noaa-paper-size">PDF{size ? ` · ${size}` : ''}</span>
              </div>
              <div className="noaa-paper-actions">
                {paper.isPdf && !isMobile && (
                  <button
                    type="button"
                    className={`noaa-paper-btn${isActive ? ' is-active' : ''}`}
                    onClick={() => setActiveIndex(isActive ? -1 : index)}
                    aria-pressed={isActive}
                  >
                    {isActive ? 'Close preview' : 'Read online'}
                  </button>
                )}
                <a
                  className="noaa-paper-btn noaa-paper-btn-secondary"
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open / Download
                  <ExternalIcon />
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      {active && !isMobile && (
        <div className="noaa-viewer">
          <iframe
            key={active.url}
            src={`${active.url}#view=FitH`}
            title={active.title}
            loading="lazy"
          />
          <p className="noaa-viewer-note">
            Viewing <strong>{active.title}</strong>. If the document doesn&apos;t appear, use &ldquo;Open / Download&rdquo; above.
          </p>
        </div>
      )}
    </div>
  );
};

// Icon mapping function for hub cards
const getHubIconByType = (iconType) => {
  const icons = {
    tools: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
    ),
    research: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    ),
    community: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    )
  };

  return icons[iconType] || icons.tools;
};

const EcoPage = ({ treeCardStats, pageData }) => {
  if (!pageData) {
    return (
      <>
        <SEO pageTitle="Sustainability" />
        <Header />
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  // --- Hero Background Logic ---
  const heroType = pageData.heroBackgroundType || 'Image';

  const heroVideoUrl = getStrapiMediaUrl(pageData.heroBackgroundVideo?.url);

  const heroImageUrl = getStrapiMediaUrl(pageData.heroBackgroundImage?.url) || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80';

  const impactImageUrl = getStrapiMediaUrl(pageData.impactBackgroundImage?.url) || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2342&q=80';

  const noaaImageUrl = getStrapiMediaUrl(pageData.noaaImage?.url) || '/images/assets/environmental-impact.jpeg';

  const toolResources = (Array.isArray(pageData.toolResources) && pageData.toolResources.length > 0)
    ? pageData.toolResources
    : FALLBACK_TOOL_RESOURCES;

  const noaaPapers = buildNoaaPapers(pageData);
  // When individual papers are uploaded, the legacy single URL becomes a
  // "download everything" bundle link rather than the only way to read them.
  const showNoaaBundleButton = Array.isArray(pageData.noaaPapers) && pageData.noaaPapers.length > 0 && !!pageData.noaaDownloadUrl;

  return (
    <>
      <SEO
        pageTitle={pageData?.pageTitle || "Sustainability"}
        metaDescription={pageData?.metaDescription || "Our commitment to sustainability and environmental impact."}
        ogImage={pageData?.pagePreviewImage}
      />
      <Header />

      {/* Section 1: Hero */}
      <section className="eco-hero">
        <div className="hero-background">
          {/* Conditional Render: Video or Image */}
          {heroType === 'Video' && heroVideoUrl ? (
            <video autoPlay loop muted playsInline className="hero-bg-media">
              <source src={heroVideoUrl} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={heroImageUrl}
              alt="Lush green landscape"
              layout="fill"
              objectFit="cover"
              quality={80}
              priority
            />
          )}
          <div className="hero-overlay" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-9 mx-auto text-center">
              <h1 className="main-title">
                {pageData.heroTitle || 'Sustainability at Adaptive Intelligence'}
                <span className="position-relative d-inline-block">
                  <Image
                    src="/images/shape/shape_122.svg"
                    alt="underline"
                    width={400}
                    height={8}
                    style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)' }}
                  />
                </span>
              </h1>
              <p className="hero-subtitle">
                {pageData.heroDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Living Resource Hub */}
      <section className="resource-hub-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <div className="sc-title">{pageData.commitmentTagline || 'Our Commitment'}</div>
              <h2 className="section-title">{pageData.commitmentTitle}</h2>
              <p className="section-description">
                {pageData.commitmentDescription}
              </p>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            {pageData.hubCards?.map((card, index) => {
              const kind = resolveHubKind(card, index);
              const href = card.buttonUrl || `#${kind}`;
              const isExternal = /^https?:\/\//i.test(href);
              return (
                <div key={card.id || index} className="col-md-6 col-lg-4">
                  <div className="hub-card">
                    <div className="card-icon">
                      {getHubIconByType(kind)}
                    </div>
                    <h3 className="card-title">{card.title}</h3>
                    <p className="card-text">{card.description}</p>
                    <a
                      href={href}
                      className="hub-card-button"
                      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      aria-label={`${card.buttonText || 'Learn More'}: ${card.title}`}
                    >
                      <span>{card.buttonText || 'Learn More'}</span>
                      <ExternalIcon />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2b: Practical Tools and Frameworks */}
      <section id="tools" className="tools-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <div className="sc-title">{pageData.toolsTagline || 'Practical Tools and Frameworks'}</div>
              <h2 className="section-title">{pageData.toolsTitle || 'Embed Sustainability Into How You Operate'}</h2>
              <p className="section-description">
                {pageData.toolsDescription || 'Free, widely adopted frameworks you can use today to measure your footprint, set credible targets, and report progress — no consultants required to get started.'}
              </p>
            </div>
          </div>
          <div className="row g-4">
            {toolResources.map((resource, index) => {
              const fileUrl = getStrapiMediaUrl(resource.file?.url);
              const href = fileUrl || resource.url;
              if (!href) return null;
              const label = fileUrl ? 'Download' : 'Visit resource';
              return (
                <div key={resource.id || `${resource.title}-${index}`} className="col-md-6 col-lg-4">
                  <a
                    href={href}
                    className="tool-card"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resource.sourceLabel && <div className="tool-source">{resource.sourceLabel}</div>}
                    <h3 className="tool-title">{resource.title}</h3>
                    {resource.description && <p className="tool-text">{resource.description}</p>}
                    <span className="tool-link">
                      {label}
                      <ExternalIcon />
                    </span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Impact By The Numbers (TreeCard) */}
      <section className="impact-section">
        <div className="impact-background">
          <Image
            src={impactImageUrl}
            alt="Forest canopy"
            layout="fill"
            objectFit="cover"
            quality={75}
          />
          <div className="impact-overlay" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="section-title text-white">{pageData.impactTitle}</h2>
              <p className="section-description text-white-70">
                {pageData.impactDescription}
              </p>
            </div>
          </div>
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="stat-number">{(treeCardStats.trees || 0).toLocaleString()}</div>
                <div className="stat-label">Trees Planted</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="stat-number">{(treeCardStats.acres || 0).toFixed(1)}</div>
                <div className="stat-label">Acres of Tree Coverage</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="stat-number">{(treeCardStats.carbon || 0).toLocaleString()}</div>
                <div className="stat-label">Tons of Carbon Absorbed</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="stat-number">{(treeCardStats.bottles || 0).toLocaleString()}</div>
                <div className="stat-label">Plastic Bottles Removed</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center cta-container">
              <a
                href={pageData.treeCardButtonUrl || 'https://www.treecard.org/#getcard'}
                target="_blank"
                rel="noopener noreferrer"
                className="eco-button"
              >
                <span>{pageData.treeCardButtonText || 'Join TreeCard'}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: NOAA Papers (Research and Reports) */}
      <section id="research" className="noaa-section pt-150 pb-150 lg-pt-120 lg-pb-120 md-pt-80 md-pb-80">
        <div className="container">
          <div className="row align-items-center">

            {/* Image Column: Added mb-50 for mobile separation */}
            <div className="col-lg-6 mb-50 lg-mb-0">
              <Image
                src={noaaImageUrl}
                alt="Environmental research documents"
                width={600}
                height={500}
                className="noaa-image"
                // FIX: width 100% + height auto prevents stretching
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
                }}
              />
            </div>

            {/* Text Column: Added ps-lg-5 for desktop spacing */}
            <div className="col-lg-6">
              <div className="ps-lg-5">
                <div className="sc-title">Research and Reports</div>
                <h2 className="section-title">{pageData.noaaTitle || "Why We're Hosting the NOAA Papers"}</h2>
                <p className="mb-30">{pageData.noaaParagraph1}</p>
                <p className="mb-40">{pageData.noaaParagraph2}</p>
                {showNoaaBundleButton && (
                  <a
                    href={pageData.noaaDownloadUrl}
                    className="download-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pageData.noaaDownloadButtonText || 'Download the full NOAA bundle'}
                    <ExternalIcon />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Embedded papers: pick one to read inline, or open/download it */}
          {noaaPapers.length > 0 && (
            <div className="row">
              <div className="col-12">
                <div className="noaa-papers-heading">
                  <h3 className="noaa-papers-title">Read the papers</h3>
                  <p className="noaa-papers-intro">
                    Select a document to read it here, or open it in a new tab to download.
                  </p>
                </div>
                <NoaaPapersEmbed papers={noaaPapers} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 5: Community Connection (A Community Hub) */}
      <section id="community" className="community-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="section-title">{pageData.communityTitle}</h2>
              <p className="section-description">
                {pageData.communityDescription}
              </p>
              <p className="community-cta">
                {pageData.communityCtaText}
                <a href={`mailto:${pageData.communityEmail || 'eco@aii.agency'}`} className="email-link">
                  {pageData.communityEmail || 'eco@aii.agency'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterWithSettings />

      <style jsx>{`
        /* White Header Fix for This Page */
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-link) { color: white !important; }
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item:hover .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.active .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.current-menu-item .nav-link) { color: #FF1292 !important; }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn) { color: white !important; border-color: white !important; background: transparent !important; }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn:hover) { color: black !important; background: white !important; }

        /* Common Section Styles */
        .sc-title { color: #FF1292; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; font-weight: 600; margin-bottom: 20px; }
        .section-title { font-family: 'Recoleta', serif; font-weight: 400; color: #151937; margin-bottom: 20px; }
        .section-description { font-size: 1.1rem; color: #666; line-height: 1.7; max-width: 700px; margin-left: auto; margin-right: auto; }

        /* Section 1: Hero */
        .eco-hero { position: relative; height: 80vh; min-height: 600px; display: flex; align-items: center; color: white; text-align: center; }
        .hero-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); }
        
        /* Video Background Style */
        .hero-bg-media { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }

        .main-title { font-family: 'Recoleta', serif; font-size: 4rem; font-weight: 400; color: white; line-height: 1.2; }
        .hero-subtitle { font-size: 1.25rem; color: rgba(255, 255, 255, 0.85); max-width: 800px; margin: 30px auto 0; line-height: 1.6; }
        
        /* In-page anchors from the hub cards: smooth scroll, clear the fixed header */
        :global(html) { scroll-behavior: smooth; }
        #tools, #research, #community { scroll-margin-top: 90px; }

        /* Section 2: Resource Hub */
        .resource-hub-section { padding: 120px 0; background: #f8f9fa; }
        .hub-card { background: white; padding: 40px; border-radius: 12px; height: 100%; text-align: center; transition: all 0.3s ease; display: flex; flex-direction: column; }
        .hub-card:hover { transform: translateY(-8px); box-shadow: 0 15px 40px rgba(0,0,0,0.08); }
        .card-icon { color: #FF1292; margin-bottom: 20px; }
        .card-title { font-family: 'Recoleta', serif; font-size: 1.5rem; color: #151937; margin-bottom: 15px; }
        .card-text { color: #666; line-height: 1.6; flex-grow: 1; }
        .hub-card-button {
          align-self: center; margin-top: 24px; display: inline-flex; align-items: center; gap: 8px;
          background: white; color: #151937; border: 1px solid #ff1292; padding: 12px 26px;
          text-decoration: none; font-weight: 500; font-size: 0.95rem; transition: all 0.3s ease;
        }
        .hub-card-button:hover { background: #ff1292; color: white; }

        /* Section 2b: Practical Tools and Frameworks */
        .tools-section { padding: 120px 0; background: white; }
        .tools-section .section-description { margin-bottom: 50px; }
        .tool-card {
          display: flex; flex-direction: column; height: 100%; padding: 34px 32px; border-radius: 12px;
          background: #f8f9fa; border: 1px solid #eef0f3; color: inherit; text-decoration: none; transition: all 0.3s ease;
        }
        .tool-card:hover { transform: translateY(-6px); box-shadow: 0 15px 40px rgba(0,0,0,0.08); border-color: #ff1292; }
        .tool-source { color: #FF1292; text-transform: uppercase; letter-spacing: 1.5px; font-size: 12px; font-weight: 600; margin-bottom: 12px; }
        .tool-title { font-family: 'Recoleta', serif; font-size: 1.3rem; color: #151937; margin-bottom: 12px; }
        .tool-text { color: #666; line-height: 1.6; font-size: 0.95rem; flex-grow: 1; margin-bottom: 20px; }
        .tool-link { display: inline-flex; align-items: center; gap: 6px; color: #151937; font-weight: 600; font-size: 0.9rem; }
        .tool-card:hover .tool-link { color: #ff1292; }

        /* Section 3: Impact Numbers */
        .impact-section { padding: 120px 0; position: relative; color: white; }
        .impact-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; }
        .impact-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(21, 25, 55, 0.85) 0%, rgba(255, 18, 146, 0.6) 100%); }
        .impact-section .section-title { color: white; }
        .text-white-70 { color: rgba(255,255,255,0.7); }
        .stat-card { background: rgba(255, 255, 255, 0.1); padding: 30px 20px; border-radius: 12px; backdrop-filter: blur(10px); height: 100%; }
        .stat-number { font-size: 3rem; font-weight: 600; line-height: 1; color: white; }
        .stat-label { font-size: 1rem; color: rgba(255, 255, 255, 0.8); margin-top: 10px; }
        .cta-container { margin-top: 60px; }
        
        .eco-button {
          background: white; color: black; border: 1px solid #ff1292; border-radius: 0; padding: 15px 30px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s ease; font-weight: 500; cursor: pointer;
        }
        .eco-button:hover {
          background: #ff1292; border-color: #ff1292; color: white;
        }

        /* Section 4: NOAA Papers */
        .noaa-section { padding: 120px 0; background: white; }
        .noaa-image { border-radius: 12px; }
        .noaa-section p { font-size: 1rem; color: #666; line-height: 1.8; margin-bottom: 20px; }
        .download-button { display: inline-flex; align-items: center; gap: 10px; background: #151937; color: white; padding: 16px 32px; text-decoration: none; font-weight: 500; margin-top: 20px; transition: all 0.3s ease; }
        .download-button:hover { background: #FF1292; transform: translateY(-2px); }

        /* Embedded NOAA papers */
        .noaa-papers-heading { margin-top: 70px; padding-top: 50px; border-top: 1px solid #ececf1; }
        .noaa-papers-title { font-family: 'Recoleta', serif; font-weight: 400; color: #151937; font-size: 1.8rem; margin-bottom: 8px; }
        .noaa-papers-intro { margin-bottom: 24px !important; }
        :global(.noaa-paper-list) { list-style: none; padding: 0; margin: 0 0 24px; display: flex; flex-direction: column; gap: 12px; }
        :global(.noaa-paper) {
          display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
          padding: 18px 22px; border-radius: 12px; background: #f8f9fa; border: 1px solid #eef0f3; transition: border-color 0.2s ease;
        }
        :global(.noaa-paper.is-active) { border-color: #ff1292; }
        :global(.noaa-paper-meta) { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        :global(.noaa-paper-title) { color: #151937; font-weight: 600; overflow-wrap: anywhere; }
        :global(.noaa-paper-size) { color: #888; font-size: 0.85rem; }
        :global(.noaa-paper-actions) { display: flex; gap: 10px; flex-wrap: wrap; }
        :global(.noaa-paper-btn) {
          display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; border: 1px solid #151937;
          background: #151937; color: white; font-size: 0.9rem; font-weight: 500; text-decoration: none; cursor: pointer; transition: all 0.25s ease;
        }
        :global(.noaa-paper-btn:hover), :global(.noaa-paper-btn.is-active) { background: #ff1292; border-color: #ff1292; color: white; }
        :global(.noaa-paper-btn-secondary) { background: white; color: #151937; }
        :global(.noaa-viewer iframe) { width: 100%; height: 75vh; min-height: 520px; border: 1px solid #e3e5ea; border-radius: 12px; background: #f1f2f5; }
        :global(.noaa-viewer-note) { font-size: 0.9rem !important; color: #888 !important; margin: 12px 0 0 !important; }

        /* Section 5: Community Connection */
        .community-section { padding: 120px 0; background: #f8f9fa; }
        .community-cta { font-size: 1.2rem; color: #151937; margin-top: 30px; }
        .email-link { color: #FF1292; text-decoration: none; font-weight: 600; margin-left: 8px; border-bottom: 2px solid transparent; transition: border-color 0.3s ease; }
        .email-link:hover { border-color: #FF1292; }

        /* Responsive Styles */
        @media (max-width: 991px) { .main-title { font-size: 3rem; } .noaa-image { margin-bottom: 40px; } }
        @media (max-width: 768px) { .eco-hero { height: 70vh; } .main-title { font-size: 2.2rem; } .hero-subtitle { font-size: 1.1rem; } .resource-hub-section, .tools-section, .impact-section, .noaa-section, .community-section { padding: 80px 0; } .section-title { font-size: 2rem; } .stat-card { margin-bottom: 20px; } .stat-number { font-size: 2.2rem; } .noaa-papers-heading { margin-top: 40px; padding-top: 36px; } :global(.noaa-paper) { flex-direction: column; align-items: flex-start; } }
      `}</style>
    </>
  );
};

export async function getStaticProps() {
  const fallbackData = { trees: 311, acres: 1.2, carbon: 328, bottles: 1674 };
  let finalStats = { ...fallbackData };

  console.log("--- Starting getStaticProps for EcoPage ---");

  // Fetch TreeCard stats from Google Sheets
  try {
    const sheetId = '1ICb8PWttvv0leKmfmJWXSGhXkZz5UAxChmFamV_bh1c';
    const sheetName = 'Total%20Footprint';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

    const response = await fetch(url);

    if (response.ok) {
      const csvText = await response.text();
      const rows = csvText.replace(/"/g, '').split('\n');

      if (rows.length >= 2) {
        let totalTrees = 0;
        let totalAcres = 0;
        let totalCarbon = 0;
        let totalBottles = 0;
        let processedRowCount = 0;

        // Updated Logic: Find the "TOTALS" row directly instead of summing manually.
        // The user confirmed the spreadsheet "TOTALS" row (yellow cells) has the correct data.
        let totalsFound = false;

        for (let i = 1; i < rows.length; i++) {
          const rowText = rows[i].trim();
          if (rowText === '') continue;

          const columns = rowText.split(',');
          // Remove quotes and whitespace for comparison
          const firstCol = columns[0]?.replace(/"/g, '').trim().toUpperCase();

          if (firstCol === 'TOTALS') {
            // Found the TOTALS row!
            // Columns: 0=Name, 1=Trees, 2=Acres, 3=Carbon, 4=Bottles
            const trees = parseFloat(columns[1]?.replace(/"/g, '').replace(/,/g, '').trim()) || 0;
            const acres = parseFloat(columns[2]?.replace(/"/g, '').replace(/,/g, '').trim()) || 0;
            const carbon = parseFloat(columns[3]?.replace(/"/g, '').replace(/,/g, '').trim()) || 0;
            const bottles = parseFloat(columns[4]?.replace(/"/g, '').replace(/,/g, '').trim()) || 0;

            finalStats = { trees, acres, carbon, bottles };
            totalsFound = true;
            break;
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error during Google Sheet fetch/parse:', error.message);
  }

  // --- Fetch Eco Page content from Strapi ---
  let strapiPageData = null;
  try {
    const { getStrapiApiUrl } = await import('@/utils/strapi');
    const base = `${getStrapiApiUrl()}/api/eco-page`;

    // `populate=*` only fills first-level media/components, so the `file`
    // inside each toolResources entry needs an explicit nested populate.
    // Strapi v5 rejects unknown populate keys with a 400, so if the backend
    // hasn't been deployed with the new fields yet we fall back to `populate=*`
    // rather than rendering an empty page.
    // (No heroBackgroundImage — that field doesn't exist on the eco-page schema.)
    const nestedPopulate = [
      'populate[heroBackgroundVideo]=true',
      'populate[impactBackgroundImage]=true',
      'populate[noaaImage]=true',
      'populate[noaaPapers]=true',
      'populate[pagePreviewImage]=true',
      'populate[hubCards]=true',
      'populate[toolResources][populate]=*',
    ].join('&');

    let pageRes = await fetch(`${base}?${nestedPopulate}`);
    if (!pageRes.ok) {
      console.warn(`Eco page nested populate returned ${pageRes.status}; falling back to populate=*`);
      pageRes = await fetch(`${base}?populate=*`);
    }

    if (pageRes.ok) {
      const pageJson = await pageRes.json();
      // Handle Strapi v5 flat structure
      strapiPageData = pageJson.data || null;
    }

  } catch (error) {
    console.error("❌ Error fetching/processing Strapi eco page data:", error.message);
  }

  return {
    props: {
      treeCardStats: finalStats,
      pageData: strapiPageData
    },
    revalidate: 60,
  };
}

export default EcoPage;