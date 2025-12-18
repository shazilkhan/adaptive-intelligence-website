import React from "react";
import Header from "@/components/header/Header";
import FooterContent from "@/components/footer/FooterContent";
import Subscribe from "@/components/footer/Subscribe";
import CopyrightFooter from "@/components/footer/CopyrightFooter";
import Link from "next/link";
import Image from "next/image";
import FooterWithSettings from "@/components/footer/FooterWithSettings";

import SEO from '@/components/SEO';

const TermsConditionsPage = () => {
  return (
    <>
      <SEO pageTitle="Terms & Conditions" />
      <Header menuTextColor="white" />

      {/* Page Header */}
      <div className="content-page-header" style={{ background: '#000000', paddingTop: '180px', paddingBottom: '120px' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h1 className="page-title" style={{ color: 'white', fontSize: '3rem', fontFamily: 'Recoleta, serif', marginBottom: '20px' }}>
                  Terms & Conditions
                </h1>
                Last Updated: 2025

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
                  Please read these Terms of Use ("Terms", "Terms of Use") carefully before using the smithyhomecoutre.com website (the "Service") operated by Adaptive Intelligence International ("us", "we", or "our").
                </p>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '30px', color: '#666' }}>
                  Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
                </p>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '50px', color: '#666' }}>
                  By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                </p>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Accounts
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Intellectual Property
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    The Service and its original content, features and functionality are and will remain the exclusive property of Adaptive Intelligence International and its licensors.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Links To Other Web Sites
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    Our Service may contain links to third-party web sites or services that are not owned or controlled by Adaptive Intelligence International.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    Adaptive Intelligence International has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that Adaptive Intelligence International shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Termination
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Disclaimer
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Governing Law
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    These Terms shall be governed and construed in accordance with the laws of United States without regard to its conflict of law provisions.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Changes
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Contact Us
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    If you have any questions about these Terms, please contact us.
                  </p>
                </div>

                <div className="copyright-notice" style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '60px', textAlign: 'center' }}>
                  <p style={{ color: '#666', margin: '0', fontSize: '0.9rem' }}>
                    © 2025 Adaptive Intelligence International. All Rights Reserved.
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

export default TermsConditionsPage;