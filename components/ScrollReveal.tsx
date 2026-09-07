"use client";
import { useEffect } from "react";
export default function ScrollReveal() {
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches)
      return;
    document.documentElement.classList.add("js-reveal");
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}
