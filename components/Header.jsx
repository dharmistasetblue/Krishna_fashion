"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header(){
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
    setProductsOpen(false);
  };

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    const onResize = () => {
      if (window.innerWidth > 900) closeMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  return (<>
    <header>
      <div className="container nav">
        <Link className="brand" href="/" onClick={closeMenu}>
          <img src="/assets/images/krishna-fashion-logo.png" alt="Krishna Fashion" />
        </Link>

        <nav className={`menu${menuOpen ? " open" : ""}`} id="menu">
          <Link href="/about-us" onClick={closeMenu}>About Us</Link>
          <div className={`nav-dropdown${productsOpen ? " open" : ""}`}>
            <button
              className="nav-dropdown-toggle"
              type="button"
              aria-expanded={productsOpen}
              onClick={() => setProductsOpen(v => !v)}
            >
              Products <span><i className="fa-solid fa-angle-down"></i></span>
            </button>
            <div className="nav-dropdown-menu">
              <Link href="/circular-knitting" onClick={closeMenu}>Circular Knitting</Link>
              <Link href="/warp-knitting" onClick={closeMenu}>Warp Knitting</Link>
            </div>
          </div>
          <Link href="/management" onClick={closeMenu}>Management</Link>
          <Link href="/infrastructure" onClick={closeMenu}>Infrastructure</Link>
          <Link href="/sustainability" onClick={closeMenu}>Sustainability</Link>
          <Link href="/careers" onClick={closeMenu}>Careers</Link>
          <Link className="nav-cta" href="/contact-us" onClick={closeMenu}>Contact Us ↗</Link>
        </nav>

        <button
          className={`menu-toggle${menuOpen ? " active" : ""}`}
          id="menuToggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={() => {
            setMenuOpen(v => !v);
            if (menuOpen) setProductsOpen(false);
          }}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>
    </header>

    <div
      className={`mobile-menu-backdrop${menuOpen ? " show" : ""}`}
      aria-hidden="true"
      onClick={closeMenu}
    />
  </>);
}
