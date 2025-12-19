import Head from 'next/head';
import { useSettings } from '@/context/SettingsContext';

const SEO = ({ pageTitle, metaDescription, ogImage, canonicalUrl }) => {
    const { settings } = useSettings();

    // 1. Resolve Title
    const siteName = settings?.siteTitle || 'Adaptive Intelligence';
    const fullTitle = pageTitle ? `${pageTitle} | ${siteName}` : (settings?.siteTagline ? `${siteName} | ${settings.siteTagline}` : siteName);

    // 2. Resolve Description
    const defaultDesc = settings?.siteDescription || 'Fueling Creative Innovation and Digital Growth.';
    const description = metaDescription || defaultDesc;

    // 3. Resolve Media URL (Stapi v5 structure)
    const getImageUrl = (imageObj) => {
        const url = imageObj?.url || imageObj?.attributes?.url;
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;
    };

    const previewImage = getImageUrl(ogImage) || getImageUrl(settings?.sitePreviewImage);

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {previewImage && <meta property="og:image" content={previewImage} />}
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {previewImage && <meta name="twitter:image" content={previewImage} />}
        </Head>
    );
};

export default SEO;
