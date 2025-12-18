import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Header from '@/components/header/Header';
import LetsTalkButton from '@/components/LetsTalkButton';
import { resourceDatabase } from '@/data/resources';
import FooterWithSettings from "@/components/footer/FooterWithSettings";

const DownloadPage = () => {
  const router = useRouter();
  const [resourceData, setResourceData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Use a ref to prevent double tracking in React Strict Mode
  const hasTrackedRef = useRef(false);

  // --- 1. TRACKING FUNCTION ---
  const trackDownload = async (email, slug, title) => {
    if (!email || hasTrackedRef.current) return;

    try {
      hasTrackedRef.current = true; // Mark as tracked
      console.log(`Tracking download for ${email}...`);

      await fetch('/api/track-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, slug, title })
      });

    } catch (error) {
      console.error("Tracking failed", error);
    }
  };

  // --- 2. DOWNLOAD HANDLER ---
  const handleDownload = async (resource) => {
    setIsDownloading(true);

    try {
      // UX Delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const downloadUrl = resource.downloadUrl;

      if (!downloadUrl) throw new Error("No download URL found");

      // Trigger Download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = resource.fileName || 'download';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
      setDownloadComplete(true);
    }
  };

  // --- 3. DATA FETCHING ---
  const fetchCaseStudyFile = async (slug, email) => {
    try {
      // Fetch file data from Strapi
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/case-studies?filters[slug][$eq]=${slug}&populate=downloadFile`);
      const json = await res.json();
      const caseStudy = json.data?.[0];

      if (caseStudy && caseStudy.downloadFile?.url) {
        // Prepare Resource Object
        const localData = resourceDatabase[slug] || {};
        const resource = {
          ...localData,
          title: caseStudy.title || localData.title || "Case Study",
          description: caseStudy.description || localData.description,
          downloadUrl: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${caseStudy.downloadFile.url}`,
          fileName: caseStudy.downloadFile.name || `${slug}.pdf`,
          client: caseStudy.client || localData.client,
          industry: caseStudy.industry || localData.industry,
        };

        setResourceData(resource);

        // --- FIRE TRACKING HERE ---
        if (email) {
          trackDownload(email, slug, resource.title);
        }

        // Start Download Process
        handleDownload(resource);

      } else {
        // Fallback or Redirect
        console.error('Resource not found in Strapi:', slug);
        router.push('/case-studies');
      }
    } catch (error) {
      console.error('Error fetching case study file:', error);
      router.push('/case-studies');
    }
  };

  // --- 4. INIT ---
  useEffect(() => {
    if (!router.isReady) return;

    const { email, slug } = router.query;

    if (slug) {
      fetchCaseStudyFile(slug, email);
      setIsReady(true);
    } else {
      router.push('/case-studies');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query]);


  if (!isReady || !resourceData) {
    return (
      <>
        <Header />
        <div className="download-page pt-200 pb-150 lg-pt-150 lg-pb-120">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <div className="download-processing">
                  <div className="download-spinner"></div>
                  <h2>Loading...</h2>
                  <p>Preparing your download page...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .download-page { min-height: 70vh; background: #f8f9fa; display: flex; align-items: center; }
          .download-processing { background: white; padding: 60px 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); width: 100%; }
          .download-spinner { width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #FF1292; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 30px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          h2 { color: #151937; font-family: 'Recoleta', serif; font-size: 2.5rem; margin-bottom: 20px; }
        `}</style>
      </>
    );
  }

  return (
    <>
      <SEO
        pageTitle={resourceData?.title ? `Download ${resourceData.title}` : "Download Resource"}
        metaDescription="Access exclusive marketing resources and tools from Adaptive Intelligence."
      />
      <Header />

      <div className="download-page pt-200 pb-150 lg-pt-150 lg-pb-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">

              {isDownloading ? (
                <div className="download-processing">
                  <div className="download-spinner"></div>
                  <h2>Preparing Your Download...</h2>
                  <p>Your <strong>{resourceData.title}</strong> will begin downloading shortly.</p>

                  <div className="download-benefits">
                    {resourceData.benefits && resourceData.benefits.length > 0 && (
                      <>
                        <h4>What's included:</h4>
                        <ul>
                          {resourceData.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              ) : downloadComplete ? (
                <div className="download-success">
                  <div className="success-icon">✓</div>
                  <h2>Download Complete!</h2>
                  <p>Check your downloads folder for the file.</p>

                  <div className="resource-summary">
                    <h3>{resourceData.title}</h3>
                    <p className="resource-description">{resourceData.description}</p>
                  </div>

                  <div className="download-confirmation">
                    <p className="confirmation-text">
                      If the download didn't start automatically,{' '}
                      <a
                        href={resourceData.downloadUrl || '#'}
                        download={resourceData.fileName}
                        target="_blank"
                        rel="noreferrer"
                        className="download-link"
                      >
                        click here to download manually
                      </a>.
                    </p>
                  </div>

                  <div className="next-steps">
                    <h4>Ready to get started?</h4>
                    <p>Let's discuss how to apply these strategies to your specific business.</p>
                    <div className="d-flex justify-content-center">
                      <LetsTalkButton
                        buttonText="Schedule a Strategy Call"
                        href="/contact"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="download-processing">
                  <div className="download-spinner"></div>
                  <h2>Initializing...</h2>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <FooterWithSettings />

      <style jsx>{`
        .download-page { min-height: 80vh; background: #f8f9fa; }
        .download-processing, .download-success { background: white; padding: 60px 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .download-spinner { width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #FF1292; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 30px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        h2 { color: #151937; font-family: 'Recoleta', serif; font-size: 2.5rem; margin-bottom: 20px; }
        
        .download-benefits { margin-top: 40px; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto; }
        .download-benefits h4 { color: #151937; margin-bottom: 20px; text-align: center; font-size: 1.2rem; }
        .download-benefits ul { list-style: none; padding: 0; margin-bottom: 30px; }
        .download-benefits li { padding: 8px 0; padding-left: 30px; position: relative; color: #555; }
        .download-benefits li:before { content: '✓'; position: absolute; left: 0; color: #FF1292; font-weight: bold; }
        
        .download-metrics { margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; }
        .download-metrics h5 { color: #151937; margin-bottom: 15px; text-align: center; font-size: 1.1rem; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; justify-content: center; }
        .metric-item { text-align: center; background: #f8f9fa; padding: 15px 10px; border-radius: 8px; }
        .metric-value { display: block; color: #FF1292; font-size: 1.5rem; font-weight: 600; line-height: 1; }
        .metric-label { display: block; color: #666; font-size: 0.8rem; margin-top: 5px; text-transform: capitalize; }
        
        .resource-summary { background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 30px 0; text-align: left; border: 1px solid #eee; }
        .resource-summary h3 { color: #151937; font-family: 'Recoleta', serif; font-size: 1.4rem; margin-bottom: 15px; font-weight: 600; }
        .resource-description { color: #666; line-height: 1.6; margin-bottom: 20px; }
        
        .client-info { border-top: 1px solid #e9ecef; padding-top: 15px; font-size: 0.95rem; }
        .client-label { color: #666; margin-right: 8px; }
        .client-name { color: #FF1292; font-weight: 600; margin-right: 8px; }
        .industry { color: #888; font-style: italic; }
        
        .download-confirmation { background: #fff3f8; border: 1px solid #ffeef5; border-radius: 8px; padding: 20px; margin: 30px 0; }
        .success-icon { width: 60px; height: 60px; background: #28a745; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; margin: 0 auto 20px; box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3); }
        .confirmation-text { color: #666; line-height: 1.6; margin: 0; text-align: center; font-size: 0.95rem; }
        .download-link { color: #FF1292; text-decoration: underline; font-weight: 600; cursor: pointer; }
        .download-link:hover { color: #d60073; }
        
        .next-steps { margin-top: 40px; padding-top: 30px; border-top: 1px solid #f0f0f0; }
        .next-steps h4 { color: #151937; margin-bottom: 10px; }
        .next-steps p { margin-bottom: 30px; color: #666; }

        @media (max-width: 768px) {
            .download-processing, .download-success { padding: 40px 20px; }
            h2 { font-size: 2rem; }
            .metrics-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </>
  );
};

export default DownloadPage;