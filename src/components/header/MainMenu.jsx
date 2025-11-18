"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const MainMenu = () => {
  const pathname = usePathname();

  const isActive = (link) => {
    if (link === "/") {
      return pathname === "/";
    }
    // Helper to check if any item in a dropdown array is active
    if (Array.isArray(link)) {
        return link.some(item => pathname === item.link || pathname.startsWith(item.link));
    }
    return pathname.startsWith(link);
  };

  const clientsItems = [
    { name: "Services", link: "/services" },
    { name: "Case Studies", link: "/case-studies" }
  ];

  // --- NEW: Define items for the About dropdown ---
  const aboutItems = [
    { name: "About Us", link: "/about" },
    { name: "Team", link: "/team" }
  ];

  const renderSingleNavItem = (label, link) => {
    return (
      <li className="nav-item">
        <Link
          href={link}
          className={`nav-link ${isActive(link) ? "active-menu" : ""}`}
          style={{ userSelect: "none" }}
        >
          {label}
        </Link>
      </li>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg order-lg-2">
      <button
        className="navbar-toggler d-block d-lg-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span />
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="d-block d-lg-none">
            <div className="logo mobile-logo">
              <Link href="/" className="d-block">
                <Image
                  src="/images/logo/logo_06.svg"
                  alt="logo"
                  width={115}
                  height={80}
                  style={{ userSelect: "none" }}
                />
              </Link>
            </div>
          </li>

          {/* 1. Home */}
          {renderSingleNavItem("Home", "/")}

          {/* 2. Creatives */}
          {renderSingleNavItem("Creatives", "/creatives")}

          {/* 3. Clients Dropdown */}
          <li className="nav-item dropdown">
            <a
              className={`nav-link dropdown-toggle ${isActive(clientsItems) ? "active-menu" : ""}`}
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              aria-expanded="false"
              style={{ userSelect: "none" }}
            >
              Clients
            </a>
            <ul className="dropdown-menu">
              {clientsItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.link} className={`dropdown-item ${pathname.startsWith(item.link) ? "active" : ""}`}>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* 4. Eco */}
          {renderSingleNavItem("Eco", "/eco")}

          {/* 5. About Dropdown (Updated) */}
          <li className="nav-item dropdown">
            <a
              className={`nav-link dropdown-toggle ${isActive(aboutItems) ? "active-menu" : ""}`}
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              aria-expanded="false"
              style={{ userSelect: "none" }}
            >
              About
            </a>
            <ul className="dropdown-menu">
              {aboutItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.link} className={`dropdown-item ${pathname === item.link ? "active" : ""}`}>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default MainMenu;