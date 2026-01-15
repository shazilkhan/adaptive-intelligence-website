import React from "react";
import Header from "@/components/header/Header";
import FooterContent from "@/components/footer/FooterContent";
import Subscribe from "@/components/footer/Subscribe";
import CopyrightFooter from "@/components/footer/CopyrightFooter";
import Link from "next/link";
import Image from "next/image";
import FooterWithSettings from "@/components/footer/FooterWithSettings";

import SEO from '@/components/SEO';

const CookiePolicyPage = () => {
  return (
    <>
      <SEO pageTitle="Cookie Policy" />
      <Header menuTextColor="white" />

      {/* Page Header */}
      <div className="content-page-header" style={{ background: '#000000', paddingTop: '180px', paddingBottom: '120px' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h1 className="page-title" style={{ color: 'white', fontSize: '3rem', fontFamily: 'Recoleta, serif', marginBottom: '20px' }}>
                  Cookie Policy
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
                  Last Updated: 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-page-section" style={{ background: 'white', paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="content-wrapper">
                <h2 style={{ color: '#FF1292', fontSize: '1.5rem', fontWeight: '600', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  ADAPTIVE INTELLIGENCE INTERNATIONAL
                </h2>

                <h3 style={{ color: '#151937', fontSize: '1.3rem', fontWeight: '600', marginBottom: '30px' }}>
                  OUR USE OF COOKIES, WEB BEACONS AND SIMILAR TECHNOLOGIES
                </h3>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '30px', color: '#666' }}>
                  When you visit or interact with our sites, services, applications, tools or messaging, we or our authorized service providers may use cookies, web beacons, and other similar technologies to make your experience better, faster and safer, for advertising purposes and to allow us to continuously improve our sites, services, applications and tools.
                </p>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '50px', color: '#666' }}>
                  We hope the information below provides you with clear and comprehensive information about the technologies we use and the purposes for which we use them, but if you have any additional questions, or require any additional information, please review our Privacy Policy, Privacy Center, or contact us.
                </p>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Your Consent
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    By continuing to use and navigate our sites, services, applications, tools or messaging, you are agreeing to our use of cookies, web beacons and similar technologies as described herein and in our Privacy Policy. If you do not wish to accept these technologies in connection with your visit to or use of our sites, services, applications, tools or messaging, you may visit our Manage Settings page and see additional options below available to you to manage, control or delete our, or our service provider's, use of these technologies.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    What are cookies, web beacons and similar technologies
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    These technologies are essentially small data files placed on your computer, tablet, mobile phone or other device ("collectively, a "device") that allows us to record information when you visit or interact with our websites, service, applications, messaging, and other tools. Though often these technologies are generically referred to as "Cookies," each functions slightly differently, and is better explained below:
                  </p>

                  <h3 style={{ color: '#151937', fontSize: '1.4rem', fontWeight: '600', marginTop: '30px', marginBottom: '15px' }}>
                    Cookies:
                  </h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    These are small text files (typically made up of letters and numbers) placed in the memory of your browser or device when you visit a website or view a message. Cookies allow a website to recognize a particular device or browser.
                  </p>

                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '15px', color: '#666' }}>
                    There are several types of cookies:
                  </p>

                  <ul style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666', paddingLeft: '30px' }}>
                    <li><strong>Session cookies</strong> expire at the end of your browser session and allow us to link your actions during that particular browser session.</li>
                    <li><strong>Persistent cookies</strong> are stored on your device in between browser sessions, allowing us to remember your preferences or actions across multiple sites.</li>
                    <li><strong>First-party cookies</strong> are those set by a website that is being visited by the user at the time in order to preserve your settings (e.g., while on our site).</li>
                    <li><strong>Third-party cookies</strong> are placed in your browser by a website, or domain, that is not the website or domain that you are currently visiting.</li>
                  </ul>

                  <h3 style={{ color: '#151937', fontSize: '1.4rem', fontWeight: '600', marginTop: '30px', marginBottom: '15px' }}>
                    Web beacons:
                  </h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    Small files (also called "pixels", "image tags", or "script tags") that may be loaded on our sites, applications, and tools, that may work in concert with cookies to identify our users and provide anonymized data on their behavior.
                  </p>

                  <h3 style={{ color: '#151937', fontSize: '1.4rem', fontWeight: '600', marginTop: '30px', marginBottom: '15px' }}>
                    Similar technologies:
                  </h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    Technologies that store information in your browser or device utilizing local shared objects or local storage, such as flash cookies, HTML 5 cookies, and other web application software methods. These technologies can operate across all of your browsers, and in some instances may not be fully managed by your browser and may require management directly through your installed applications or device. We do not use these technologies for storing information to target advertising to you on or off our sites.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    What types of cookies do we use and why
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    Our cookies, web beacons and similar technologies serve various purposes, but are generally either necessary or essential to the functioning of our sites, services, applications, tools or messaging, help us improve the performance of or provide you extra functionality of the same, or help us to serve relevant and targeted advertisements.
                  </p>

                  <h3 style={{ color: '#151937', fontSize: '1.4rem', fontWeight: '600', marginTop: '30px', marginBottom: '15px' }}>
                    Strictly Necessary or Essential:
                  </h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    'Strictly necessary' or "essential" cookies, web beacons and similar technologies let you move around the website and use essential features like secure areas and shopping baskets. Without these technologies, services you have asked for cannot be provided.
                  </p>

                  <h3 style={{ color: '#151937', fontSize: '1.4rem', fontWeight: '600', marginTop: '30px', marginBottom: '15px' }}>
                    Performance:
                  </h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    'Performance' cookies, web beacons and similar technologies collect information about how you use our website e.g. which pages you visit, and if you experience any errors. These cookies do not collect any information that could identify you and is only used to help us improve how our website works.
                  </p>

                  <h3 style={{ color: '#151937', fontSize: '1.4rem', fontWeight: '600', marginTop: '30px', marginBottom: '15px' }}>
                    Functionality:
                  </h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    These cookies, web beacons or similar technologies are used to provide services or to remember settings to improve your visit.
                  </p>

                  <h3 style={{ color: '#151937', fontSize: '1.4rem', fontWeight: '600', marginTop: '30px', marginBottom: '15px' }}>
                    Advertising:
                  </h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    First or third-party cookies and web beacons may be placed by our sites, applications, or tools, in order to deliver content, including product related advertisements, relevant to your specific interests on our sites or third-party sites.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    How to manage, control and delete cookies
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    You may manage certain cookies, web beacons and similar technologies we place by visiting our Manage Settings control panel. You may also visit our "Advertising Preferences" link exists in the footer of our webpages.
                  </p>

                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    You may block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies. However, if you use your browser settings to block all cookies (including essential cookies) it may limit your use of certain features or functions on our website or service.
                  </p>

                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    Internet browsers allow you to change your cookie settings. These settings are usually found in the 'options' or 'preferences' menu of your internet browser. In order to understand these settings, the following links may be helpful:
                  </p>

                  <ul style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666', paddingLeft: '30px' }}>
                    <li>Cookie settings in Internet Explorer</li>
                    <li>Cookie settings in Firefox</li>
                    <li>Cookie settings in Chrome</li>
                    <li>Cookie settings in Safari</li>
                  </ul>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    More information about cookies
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    Useful information about cookies, including information about deleting or blocking cookies, can be found at: <a href="http://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" style={{ color: '#FF1292' }}>http://www.allaboutcookies.org</a>
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    A guide to behavioral advertising and online privacy has been produced by the internet advertising industry which can be found at: <a href="http://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer" style={{ color: '#FF1292' }}>http://www.youronlinechoices.eu</a>
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    Information on the ICC (UK) UK cookie guide can be found on the ICC website section: <a href="http://www.international-chamber.co.uk/our-expertise/digitaleconomy" target="_blank" rel="noopener noreferrer" style={{ color: '#FF1292' }}>http://www.international-chamber.co.uk/our-expertise/digitaleconomy</a>
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Contacting Us
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    If you require further information or have any comments or questions about this website or any aspect of our services please contact our Marketing Communications Team.
                  </p>
                </div>

                <div className="copyright-notice" style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '60px', textAlign: 'center' }}>
                  <p style={{ color: '#666', margin: '0', fontSize: '0.9rem' }}>
                    © 2026 Adaptive Intelligence International. All Rights Reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterWithSettings />

      <style jsx>{`
        /* White Header Menu Fix */
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-link) {
          color: white !important;
        }
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item:hover .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.active .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.current-menu-item .nav-link) {
          color: #FF1292 !important;
        }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn) {
          color: white !important;
          border-color: white !important;
          background: transparent !important;
        }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn:hover) {
          color: black !important;
          background: white !important;
        }
      `}</style>
    </>
  );
};

export default CookiePolicyPage;