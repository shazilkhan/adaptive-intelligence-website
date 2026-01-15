import React from "react";
import Header from "@/components/header/Header";
import FooterContent from "@/components/footer/FooterContent";
import Subscribe from "@/components/footer/Subscribe";
import CopyrightFooter from "@/components/footer/CopyrightFooter";
import Link from "next/link";
import Image from "next/image";
import FooterWithSettings from "@/components/footer/FooterWithSettings";

import SEO from '@/components/SEO';

const TermsOfUsePage = () => {
  return (
    <>
      <SEO pageTitle="Terms of Use" />
      <Header menuTextColor="white" />

      {/* Page Header */}
      <div className="content-page-header" style={{ background: '#000000', paddingTop: '180px', paddingBottom: '120px' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h1 className="page-title" style={{ color: 'white', fontSize: '3rem', fontFamily: 'Recoleta, serif', marginBottom: '20px' }}>
                  Terms of Use
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
                  Terms of Use of adaptiveintelligence.online
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
                <h2 style={{ color: '#FF1292', fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Read Carefully
                </h2>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '30px', color: '#666', fontWeight: '600' }}>
                  PLEASE READ THE FOLLOWING TERMS AND CONDITIONS OF USE CAREFULLY BEFORE USING THIS WEBSITE
                </p>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '50px', color: '#666' }}>
                  All users of this site agree that access to and use of this site is subject to the following terms and conditions and other applicable law. If you do not agree to these terms and conditions, please do not use this site.
                </p>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Disclaimer
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    You understand that it is your responsibility to ensure that the privacy policy you create is complete, accurate, and meets your companies specific privacy needs. https://adaptiveintelligence.online/ is not liable or responsible for any privacy policies created using our services, and we give no representations or warranties, express or implied, that the privacy policies created using our service are complete, accurate or free from errors or omissions.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    https://adaptiveintelligence.online/ is a family friendly site and we DO NOT intentionally accept or allow the following types of sites into our program: Gambling, Adult content (porn, soft porn, sites with adult ad's), Pharmacy (Cheap drugs, Viagra, male/female enhancement, etc.), Hate, Link Farms or Spam Sites. If you sell any of these products and we find out, we will cancel your membership without hesitation. We do not need to explain our decision or reasons if we reject or cancel any membership.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Refunds & Guarantees
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    https://adaptiveintelligence.online/ offers the following guarantee. If you purchase a https://adaptiveintelligence.online/ product or service, and for some qualifying reason you decide that you would like a refund, you have 7 days to request a refund. If you request a refund within 7 days from the date of purchase, https://adaptiveintelligence.online/ will give you a full refund of your purchase price for the product or service.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    If you do not request a refund within the 7 day refund period, you forfeit this option and will not be eligible for a refund. We do not offer refunds on any additional services that you may purchase in the members area once you are a member.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Email Opt-in Policy
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    When using our https://adaptiveintelligence.online/ Generator service you will be opted-in to receive weekly email updates, tips and suggestions we believe will help build, grow and enhance your site. You may unsubscribe at any time by clicking on the "Unsubscribe or Modify my subscription" link at the bottom of any email sent.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Copyright
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    The entire content included in this site, including but not limited to text, graphics or code is copyrighted as a collective work under the United States and other international copyright laws, and is the property of https://adaptiveintelligence.online/. The collective work includes works that are licensed to https://adaptiveintelligence.online/.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    Copyright 2026, https://adaptiveintelligence.online/ ALL RIGHTS RESERVED. Permission is granted to electronically copy and print hard copy portions of this site for the sole purpose of placing an order with https://adaptiveintelligence.online/ or purchasing our products.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    Any other use, including but not limited to the reproduction, distribution, display or transmission of the content of this site is strictly prohibited, unless authorized by https://adaptiveintelligence.online/. You further agree not to change or delete any proprietary notices from materials downloaded from the site.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Trademarks
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    All trademarks, service marks and trade names of https://adaptiveintelligence.online/ used in the site are trademarks or registered trademarks of https://adaptiveintelligence.online/.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Warranty Disclaimer
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    This site and the materials and products on this site are provided "as is" and without warranties of any kind, whether express or implied. To the fullest extent permissible pursuant to applicable law, https://adaptiveintelligence.online/ disclaims all warranties, express or implied, including, but not limited to, implied warranties of merchantability and fitness for a particular purpose and non-infringement.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    https://adaptiveintelligence.online/ does not represent or warrant that the functions contained in the site will be uninterrupted or error-free, that the defects will be corrected, or that this site or the server that makes the site available are free of viruses or other harmful components. https://adaptiveintelligence.online/ does not make any warranties or representations regarding the use of the materials in this site in terms of their correctness, accuracy, adequacy, usefulness, timeliness, reliability or otherwise. Some states do not permit limitations or exclusions on warranties, so the above limitations may not apply to you.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Limitation of Liability
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    https://adaptiveintelligence.online/ shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the services and products offered on this site, or the performance of the services and products.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Typographical Errors
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    In the event that a https://adaptiveintelligence.online/ product is mistakenly listed at an incorrect price, https://adaptiveintelligence.online/ reserves the right to refuse or cancel any orders placed for product listed at the incorrect price. https://adaptiveintelligence.online/ reserves the right to refuse or cancel any such orders whether or not the order has been confirmed and your credit card charged.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    If your credit card has already been charged for the purchase and your order is cancelled, we will issue a credit to your credit card account in the amount of the incorrect price.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Term; Termination
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    These terms and conditions are applicable to you upon your accessing the site and/or completing the registration or shopping process. These terms and conditions, or any part of them, may be terminated by https://adaptiveintelligence.online/ without notice at any time, for any reason.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    The provisions relating to Copyrights, Trademark, Disclaimer, Limitation of Liability, Indemnification and Miscellaneous, shall survive any termination.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Use of Site
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    Harassment in any manner or form on the site, including via e-mail, chat, or by use of obscene or abusive language, is strictly forbidden. Impersonation of others, including a https://adaptiveintelligence.online/ or other licensed employee, host, or representative, as well as other members or visitors on the site is prohibited.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    You may not upload to, distribute, or otherwise publish through the site any content which is libelous, defamatory, obscene, threatening, invasive of privacy or publicity rights, abusive, illegal, or otherwise objectionable which may constitute or encourage a criminal offense, violate the rights of any party or which may otherwise give rise to liability or violate any law. You may not upload commercial content on the site or use the site to solicit others to join or become members of any other commercial online service or other organization.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Participation Disclaimer
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    https://adaptiveintelligence.online/ does not and cannot review all communications and materials posted to or created by users accessing the site, and are not in any manner responsible for the content of these communications and materials. You acknowledge that by providing you with the ability to view and distribute user-generated content on the site, https://adaptiveintelligence.online/ is merely acting as a passive conduit for such distribution and is not undertaking any obligation or liability relating to any contents or activities on the site.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    However, https://adaptiveintelligence.online/ reserves the right to block or remove communications or materials that it determines to be (a) abusive, defamatory, or obscene, (b) fraudulent, deceptive, or misleading, (c) in violation of a copyright, trademark or other intellectual property right of another or (d) offensive or otherwise unacceptable to https://adaptiveintelligence.online/ in its sole discretion.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Indemnification
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    You agree to indemnify, defend, and hold harmless https://adaptiveintelligence.online/, its officers, directors, employees, agents, licensors and suppliers (collectively the "Service Providers") from and against all losses, expenses, damages and costs, including reasonable attorneys' fees, resulting from any violation of these terms and conditions or any activity related to your account (including negligent or wrongful conduct) by you or any other person accessing the site using your Internet account.
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Third-Party Links
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '20px', color: '#666' }}>
                    In an attempt to provide increased value to our visitors, https://adaptiveintelligence.online/ may link to sites operated by third parties. However, even if the third party is affiliated with https://adaptiveintelligence.online/, https://adaptiveintelligence.online/ has no control over these linked sites, all of which have separate privacy and data collection practices, independent of https://adaptiveintelligence.online/.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    These linked sites are only for your convenience and therefore you access them at your own risk. Nonetheless, https://adaptiveintelligence.online/ seeks to protect the integrity of its website and the links placed upon it and therefore requests any feedback on not only its own site, but for sites it links to as well (including if a specific link does not work).
                  </p>
                </div>

                <div className="content-section">
                  <h2 style={{ color: '#151937', fontSize: '2rem', fontFamily: 'Recoleta, serif', marginBottom: '25px', marginTop: '50px' }}>
                    Contacting Us
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px', color: '#666' }}>
                    If there are any questions regarding this privacy policy you may contact us.
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

export default TermsOfUsePage;