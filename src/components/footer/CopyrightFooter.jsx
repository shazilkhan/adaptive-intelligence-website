"use client";

import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";

const CopyrightFooter = () => {
  const { settings, loading } = useSettings();

  // Debug log
  console.log("Settings in CopyrightFooter:", settings);
  console.log("Loading:", loading);

  if (loading) {
    // Keep a minimal structure while loading to avoid layout shifts
    return (
      <div className="bottom-footer" style={{ minHeight: '50px' }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center"><p>Loading...</p></div>
          </div>
        </div>
      </div>
    );
  }

  // Default social links as fallback
  const defaultIcons = [
    {
      icon: "fab fa-linkedin-in",
      href: "https://www.linkedin.com/company/adaptiveintelligenceinternational",
    },
    {
      icon: "fab fa-google",
      href: "https://share.google/wqS5CzKTOC81TZj03",
    },
    {
      icon: "fab fa-instagram",
      href: "https://www.instagram.com/adaptiveintelligence.online/",
    },
    {
      icon: "fab fa-spotify",
      href: "https://open.spotify.com/playlist/37i9dQZF1EpoYM2VvfSDDr?si=c035b4827ce043b9&nd=1&dlsi=227d0bfc319349d4",
    },
  ];

  // Use settings if available, otherwise use defaults
  const icons = settings ? [
    {
      icon: "fab fa-linkedin-in",
      href: settings.linkedinUrl || "https://www.linkedin.com/company/adaptiveintelligenceinternational",
    },
    {
      icon: "fab fa-google",
      href: settings.googleUrl || "https://share.google/wqS5CzKTOC81TZj03",
    },
    {
      icon: "fab fa-instagram",
      href: settings.instagramUrl || "https://www.instagram.com/adaptiveintelligence.online/",
    },
    {
      icon: "fab fa-spotify",
      href: settings.spotifyUrl || "#",
    },
  ] : defaultIcons;

  const IconItem = ({ icon, href }) => {
    // Handles custom image icons (like Upwork)
    if (icon.startsWith("/images/icon/")) {
      return (
        <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Link href={href || '#'} target="_blank" rel="noopener noreferrer" className="social-icon-link">
            <Image
              src={icon}
              alt="social icon"
              width={24}
              height={24}
              style={{ filter: 'brightness(0) invert(1)', transition: 'all 0.3s ease' }}
            />
          </Link>
        </li>
      );
    }
    // Handles Font Awesome icons
    return (
      <li>
        <Link href={href || '#'} target="_blank" rel="noopener noreferrer">
          <i className={icon} />
        </Link>
      </li>
    );
  };

  return (
    <div className="bottom-footer">
      <div className="container">
        <div className="row align-items-center"> {/* Added align-items-center */}
          <div className="col-lg-4 order-lg-0 mt-15">
            <ul className="d-flex justify-content-center justify-content-lg-start footer-nav style-none">
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
              {/* Add other links like Privacy Policy if needed */}
            </ul>
          </div>
          <div className="col-lg-4 order-lg-2 mt-15">
            <ul className="d-flex justify-content-center justify-content-lg-end social-icon style-none">
              {icons.map((icon, index) => (
                <IconItem key={index} icon={icon.icon} href={icon.href} />
              ))}
            </ul>
          </div>
          <div className="col-lg-4 order-lg-1 mt-15">
            <p className="copyright text-center m0">
              {settings?.copyrightText || `Copyright © ${new Date().getFullYear()} Adaptive Intelligence International LLC. All Rights Reserved.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyrightFooter;