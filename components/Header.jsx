"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header(){
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dynamicMenus, setDynamicMenus] = useState([]);

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdownId(null);
  };

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    fetch("/api/website/navigation")
      .then(res => res.json())
      .then(data => {
        if (data.isSuccess && Array.isArray(data.data) && data.data.length > 0) {
          setDynamicMenus(data.data);
        }
      })
      .catch(() => {});
  }, []);

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

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const resolveMenuHref = (menu) => {
    if (menu.url) return menu.url;
    if (menu.type === "page") {
      // Map standard root pages to their clean static routes or /p/:slug
      if (["about-us", "contact-us", "careers", "sustainability", "infrastructure", "management", "circular-knitting", "warp-knitting"].includes(menu.slug)) {
        return `/${menu.slug}`;
      }
      if (menu.slug === "home") return "/";
      return `/p/${menu.slug}`;
    }
    return `/p/${menu.slug}`;
  };

  return (<>
    <header>
      <div className="container nav">
        <Link className="brand" href="/" onClick={closeMenu}>
          <img src="/assets/images/krishna-fashion-logo.png" alt="Krishna Fashion" />
        </Link>

        <nav className={`menu${menuOpen ? " open" : ""}`} id="menu">
          {dynamicMenus.length > 0 ? (
            dynamicMenus.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isDropdownOpen = openDropdownId === item._id;

              if (hasChildren) {
                return (
                  <div key={item._id} className={`nav-dropdown${isDropdownOpen ? " open" : ""}`}>
                    <button
                      className="nav-dropdown-toggle"
                      type="button"
                      aria-expanded={isDropdownOpen}
                      onClick={() => setOpenDropdownId(isDropdownOpen ? null : item._id)}
                    >
                      {item.name} <span><i className="fa-solid fa-angle-down"></i></span>
                    </button>
                    <div className="nav-dropdown-menu">
                      {item.children.map((sub) => (
                        <Link key={sub._id} href={resolveMenuHref(sub)} onClick={closeMenu}>
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link key={item._id} href={resolveMenuHref(item)} onClick={closeMenu}>
                  {item.name}
                </Link>
              );
            })
          ) : (
            // Fallback default navigation
            <>
              <Link href="/about-us" onClick={closeMenu}>About Us</Link>
              <div className={`nav-dropdown${openDropdownId === "prod" ? " open" : ""}`}>
                <button
                  className="nav-dropdown-toggle"
                  type="button"
                  aria-expanded={openDropdownId === "prod"}
                  onClick={() => setOpenDropdownId(openDropdownId === "prod" ? null : "prod")}
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
            </>
          )}
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
            if (menuOpen) setOpenDropdownId(null);
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
