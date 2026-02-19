import Head from 'next/head';
import { useSettings } from '@/context/SettingsContext';
import { getStrapiMediaUrl } from '@/utils/strapi';

const SEO = ({ pageTitle, metaDescription, ogImage, canonicalUrl }) => {
    const { settings } = useSettings();

    // 1. Resolve Title
    const siteName = settings?.siteTitle || 'Adaptive Intelligence';
    const fullTitle = pageTitle ? `${pageTitle} | ${siteName}` : (settings?.siteTagline ? `${siteName} | ${settings.siteTagline}` : siteName);

    // 2. Resolve Description
    const defaultDesc = settings?.siteDescription || 'Fueling Creative Innovation and Digital Growth.';
    const description = metaDescription || defaultDesc;

    // 3. Resolve Media URL (Strapi v5 structure; works with local or AWS/S3)
    const getImageUrl = (imageObj) => {
        const url = imageObj?.url || imageObj?.attributes?.url;
        return getStrapiMediaUrl(url || null);
    };

    const previewImage = getImageUrl(ogImage) || getImageUrl(settings?.sitePreviewImage);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteName,
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://adaptiveintelligence.online",
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${process.env.NEXT_PUBLIC_SITE_URL || "https://adaptiveintelligence.online"}/?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {previewImage && <meta property="og:image" content={previewImage} />}
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {previewImage && <meta name="twitter:image" content={previewImage} />}

            {/* Schema.org Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </Head>
    );
};

export default SEO;
