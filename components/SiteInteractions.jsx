"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SiteInteractions(){
  const pathname = usePathname();

  useEffect(() => {
    // Every Next.js route should open from the top, like a normal HTML page load.
    // Temporarily disable smooth scrolling so route navigation never lands part-way down.
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      root.style.scrollBehavior = previousScrollBehavior;
    });

    // Match original HTML body class on inner pages.
    document.body.classList.toggle("inner-page", pathname !== "/");

    // Remove UI left by the previous route before initializing current page.
    document.body.classList.remove("menu-open", "lightbox-open");
    document.querySelectorAll(".kf-lightbox").forEach(el => el.remove());

    // management.css/style.css keep .reveal hidden until .show is added.
    // Re-create the original reveal behavior after every client-side route change.
    const revealEls = Array.from(document.querySelectorAll(".reveal"));
    let revealObserver = null;

    if ("IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            revealObserver?.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });

      revealEls.forEach(el => revealObserver.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add("show"));
    }

    // Load the original site interactions after the new route DOM exists.
    const script = document.createElement("script");
    script.src = "/js/main.js?v=20260929-6";
    script.async = false;
    script.dataset.kfRuntime = "true";
    document.body.appendChild(script);

    return () => {
      revealObserver?.disconnect();
      script.remove();
      document.body.classList.remove("menu-open", "lightbox-open");
      document.querySelectorAll(".kf-lightbox").forEach(el => el.remove());
    };
  }, [pathname]);

  return null;
}
