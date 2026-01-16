import React from "react";
import Header from "@/components/header/Header";
import FooterContent from "@/components/footer/FooterContent";
import Subscribe from "@/components/footer/Subscribe";
import CopyrightFooter from "@/components/footer/CopyrightFooter";
import Link from "next/link";
import Image from "next/image";
import FooterWithSettings from "@/components/footer/FooterWithSettings";

import SEO from '@/components/SEO';

const PrivacyPolicyPage = () => {
  return (
    <>
      <SEO pageTitle="Privacy Policy" />
      <Header menuTextColor="white" />

      {/* Page Header */}
      <div className="content-page-header" style={{ background: '#000000', paddingTop: '180px', paddingBottom: '120px' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h1 className="page-title" style={{ color: 'white', fontSize: '3rem', fontFamily: 'Recoleta, serif', marginBottom: '20px' }}>
                  Privacy Policy
                </h1>
                <p style={{ color: 'white', marginTop: '10px' }}>Last Updated: 2026</p>

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
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '30px', color: '#666' }}>
                  Adaptive Intelligence International ("us", "we", or "our") operates the Adaptive Intelligence International website (the "Service").
                </p>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '30px', color: '#666' }}>
                  This page informs you of our policies regarding the collection, use and disclosure of Personal Information when you use our Service.
                </p>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                  We will not use or share your information with anyone except as described in this Privacy Policy.
                </p>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '50px', color: '#666' }}>
                  We use your Personal Information for providing and improving the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible at https://adaptiveintelligence.online/
                </p>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Information Collection And Use
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information ("Personal Information") may include, but is not limited to:
                  </p>
                  <ul style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666', paddingLeft: '30px' }}>
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Telephone number</li>
                    <li>Address</li>
                  </ul>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Log Data
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    We collect information that your browser sends whenever you visit our Service ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages and other statistics.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Google AdSense & Double Click Cookie
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    Google, as a third party vendor, uses cookies to serve ads on our Service.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Cookies
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    We use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Service Providers
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Security
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Links To Other Sites
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over, and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Children's Privacy
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Information, please contact us. If we discover that a child under 18 has provided us with Personal Information, we will delete such information from our servers immediately.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Compliance With Laws
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    We will disclose your Personal Information where required to do so by law or subpoena.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Changes To This Privacy Policy
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Contact Us
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    If you have any questions about this Privacy Policy, please contact us.
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

export default PrivacyPolicyPage;