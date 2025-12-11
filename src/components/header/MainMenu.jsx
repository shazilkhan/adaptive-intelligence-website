"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const MainMenu = () => {
  const pathname = usePathname();

  // Helper to check active state
  const isActive = (link) => {
    if (link === "/") {
      return pathname === "/";
    }
    if (Array.isArray(link)) {
        return link.some(item => pathname === item.link || pathname.startsWith(item.link));
    }
    return pathname.startsWith(link);
  };

  // --- Dropdown Data ---
  const clientsItems = [
    { name: "Services", link: "/services" },
    { name: "Case Studies", link: "/case-studies" }
  ];

  const aboutItems = [
    { name: "About Us", link: "/about" },
    { name: "Team", link: "/team" }
  ];

  // Helper to render simple links
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

          {/* 2. About (Dropdown) */}
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

          {/* 3. Eco */}
          {renderSingleNavItem("Eco", "/eco")}

          {/* 4. Clients (Dropdown) */}
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

          {/* 5. Creatives */}
          {renderSingleNavItem("Creatives", "/creatives")}

          {/* 6. Contact */}
          {renderSingleNavItem("Contact", "/contact")}

        </ul>
      </div>
    </nav>
  );
};

export default MainMenu;