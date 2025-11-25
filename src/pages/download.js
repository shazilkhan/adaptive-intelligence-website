import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header/Header';
import LetsTalkButton from '@/components/LetsTalkButton';
import CopyrightFooter from '@/components/footer/CopyrightFooter';
import FooterContent from '@/components/footer/FooterContent';
import Subscribe from '@/components/footer/Subscribe';
import { resourceDatabase } from '@/data/resources'; // UPDATED: Import from central file
import FooterWithSettings from "@/components/footer/FooterWithSettings";

const DownloadPage = () => {
  const router = useRouter();
  const [resourceData, setResourceData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);

const handleDownload = async (resource) => {
  setIsDownloading(true);

  try {
    // Wait 3 seconds for good UX
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get the download URL
    const downloadUrl = resource.downloadUrl || `/downloads/${resource.fileName}`;
    
    // Create a temporary link that forces download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank'; // Open in new tab
    link.rel = 'noopener noreferrer';
    link.download = resource.downloadName || resource.fileName; // Force download
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('Download error:', error);
    // Fallback
    const fallbackUrl = resource.downloadUrl || `/downloads/${resource.fileName}`;
    const link = document.createElement('a');
    link.href = fallbackUrl;
    link.target = '_blank';
    link.download = resource.downloadName || resource.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    setIsDownloading(false);
    setDownloadComplete(true);
  }
};

 // Add this function after the handleDownload function
const fetchCaseStudyFile = async (slug) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/case-studies?filters[slug][$eq]=${slug}&populate=downloadFile`);
    const json = await res.json();
    const caseStudy = json.data?.[0];
    
    if (caseStudy && caseStudy.downloadFile?.url) {
      // Case study found with downloadable file from Strapi
      const resource = {
        ...resourceDatabase[slug], // Keep metadata from local database
        title: caseStudy.title || resourceDatabase[slug]?.title,
        description: caseStudy.description || resourceDatabase[slug]?.description,
        downloadUrl: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${caseStudy.downloadFile.url}`,
        fileName: caseStudy.downloadFile.name
      };
      setResourceData(resource);
      handleDownload(resource);
    } else if (resourceDatabase[slug]) {
      // Fallback to local file if no Strapi file found
      const resource = resourceDatabase[slug];
      setResourceData(resource);
      handleDownload(resource);
    } else {
      // No resource found at all, redirect
      console.error('Resource not found:', slug);
      router.push('/case-studies');
    }
  } catch (error) {
    console.error('Error fetching case study file:', error);
    // Fallback to local database on error
    if (resourceDatabase[slug]) {
      const resource = resourceDatabase[slug];
      setResourceData(resource);
      handleDownload(resource);
    } else {
      router.push('/case-studies');
    }
  }
};

// Replace your existing useEffect with this
useEffect(() => {
  if (!router.isReady) return;

  const emailParam = router.query.email;
  const slugParam = router.query.slug;
  
  if (emailParam && slugParam) {
    fetchCaseStudyFile(slugParam);
    setIsReady(true);
  } else {
    // No email or slug, redirect to case studies page
    router.push('/case-studies');
  }
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
          .download-page { min-height: 70vh; background: #f8f9fa; }
          .download-processing { background: white; padding: 60px 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
          .download-spinner { width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #FF1292; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 30px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          h2 { color: #151937; font-family: 'Recoleta', serif; font-size: 2.5rem; margin-bottom: 20px; }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="download-page pt-200 pb-150 lg-pt-150 lg-pb-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              {isDownloading ? (
                <div className="download-processing">
                  <div className="download-spinner"></div>
                  <h2>Preparing Your Download...</h2>
                  <p>Your {resourceData.title.toLowerCase()} will begin downloading shortly.</p>
                  <div className="download-benefits">
                    <h4>What's included in your download:</h4>
                    <ul>
                      {resourceData.benefits?.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                    {resourceData.metrics && (
                      <div className="download-metrics">
                        <h5>Key Highlights:</h5>
                        <div className="metrics-grid">
                          {Object.entries(resourceData.metrics).map(([key, value]) => (
                            <div key={key} className="metric-item">
                              <span className="metric-value">{value}</span>
                              <span className="metric-label">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : downloadComplete ? (
                <div className="download-success">
                  <h2>Download Complete!</h2>
                  <p>Check your downloads folder for the {resourceData.title}.</p>
                  
                  <div className="resource-summary">
                    <h3>{resourceData.title}</h3>
                    <p className="resource-description">{resourceData.description}</p>
                    
                    {resourceData.client && (
                      <div className="client-info">
                        <span className="client-label">Client:</span>
                        <span className="client-name">{resourceData.client}</span>
                        <span className="industry">({resourceData.industry})</span>
                      </div>
                    )}
                  </div>

                  <div className="download-confirmation">
                    <div className="success-icon">✓</div>
                    <p className="confirmation-text">
  Your file has been downloaded to your device.
  If the download didn't start automatically,
  {/* --- USE downloadUrl HERE --- */}
  <a href={resourceData.downloadUrl || '#'} // Use the correct URL
    download={resourceData.downloadName || resourceData.fileName} // Keep the suggested filename
    className="download-link"> click here to download</a>.
</p>
                  </div>

                  <div className="next-steps">
                    <h4>Ready to get started?</h4>
                    <p>Let's discuss how to apply these strategies to your specific business.</p>
                    <LetsTalkButton 
                      buttonText="Schedule a Strategy Call" 
                      href="https://app.apollo.io/#/meet/managed-meetings/adaptive-booknow/d5q-b45-5h2/30-min"
                    />
                  </div>
                </div>
              ) : (
                <div className="download-processing">
                  <div className="download-spinner"></div>
                  <h2>Initializing Download...</h2>
                  <p>Setting up your {resourceData.title.toLowerCase()}...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

     <FooterWithSettings />

      <style jsx>{`
        /* All your existing styles for this page */
        .download-page { min-height: 70vh; background: #f8f9fa; }
        .download-processing, .download-success { background: white; padding: 60px 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
        .download-spinner { width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #FF1292; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 30px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        h2 { color: #151937; font-family: 'Recoleta', serif; font-size: 2.5rem; margin-bottom: 20px; }
        .download-benefits { margin-top: 40px; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto; }
        .download-benefits h4 { color: #151937; margin-bottom: 20px; text-align: center; }
        .download-benefits ul { list-style: none; padding: 0; margin-bottom: 30px; }
        .download-benefits li { padding: 8px 0; padding-left: 30px; position: relative; }
        .download-benefits li:before { content: '✓'; position: absolute; left: 0; color: #FF1292; font-weight: bold; }
        .download-metrics { margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; }
        .download-metrics h5 { color: #151937; margin-bottom: 15px; text-align: center; font-size: 1.1rem; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; justify-content: center; }
        .metric-item { text-align: center; background: #f8f9fa; padding: 15px 10px; border-radius: 8px; }
        .metric-value { display: block; color: #FF1292; font-size: 1.5rem; font-weight: 600; line-height: 1; }
        .metric-label { display: block; color: #666; font-size: 0.8rem; margin-top: 5px; text-transform: capitalize; }
        .resource-summary { background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 30px 0; text-align: left; }
        .resource-summary h3 { color: #151937; font-family: 'Recoleta', serif; font-size: 1.4rem; margin-bottom: 15px; font-weight: 600; }
        .resource-description { color: #666; line-height: 1.6; margin-bottom: 20px; }
        .client-info { border-top: 1px solid #e9ecef; padding-top: 15px; font-size: 0.95rem; }
        .client-label { color: #666; margin-right: 8px; }
        .client-name { color: #FF1292; font-weight: 600; margin-right: 8px; }
        .industry { color: #888; font-style: italic; }
        .download-confirmation { background: #f8f9fa; border-radius: 8px; padding: 30px; margin: 30px 0; }
        .success-icon { width: 60px; height: 60px; background: #28a745; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; margin: 0 auto 20px; }
        .confirmation-text { color: #666; line-height: 1.6; margin: 0; text-align: center; }
        .download-link { color: #FF1292; text-decoration: none; font-weight: 500; }
        .download-link:hover { text-decoration: underline; }
        .next-steps { margin-top: 40px; padding-top: 30px; border-top: 1px solid #f0f0f0; }
        .next-steps h4 { color: #151937; margin-bottom: 15px; }
        .next-steps p { margin-bottom: 30px; color: #666; }
      `}</style>
    </>
  );
};

export default DownloadPage;