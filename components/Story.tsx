"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { wedding } from "@/data/wedding";
export default function Story() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (
          !window.matchMedia(
            "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          ).matches
        )
          return;
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            const ctx = gsap.context(() => {
              gsap.fromTo(
                ".story-line",
                { scaleY: 0 },
                {
                  scaleY: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: root.current,
                    start: "top 40%",
                    end: "bottom 70%",
                    scrub: 0.5,
                  },
                },
              );
              ScrollTrigger.create({
                trigger: ".story-visual",
                start: "top 120px",
                endTrigger: root.current,
                end: "bottom bottom",
                pin: true,
                pinSpacing: false,
              });
            }, root);
            return () => ctx.revert();
          },
        );
        cleanup = () => media.revert();
      },
      { rootMargin: "300px" },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      cancelled = true;
      observer.disconnect();
      cleanup?.();
    };
  }, []);
  return (
    <section ref={root} id="cau-chuyen" className="section story">
      <div className="story-visual">
        <p className="section-label">Chuyện của chúng mình</p>
        <h2>
          Từ một lần gặp,
          <br />
          đến một đời thương.
        </h2>
        <div className="story-image">
          <Image
            src="/images/gallery-1.webp"
            alt="Không gian lễ cưới trang trí hoa trong khu vườn"
            fill
            sizes="(max-width: 767px) 90vw, 40vw"
          />
        </div>
        <p className="photo-caption">
          Có những điều tình cờ, hóa ra là định mệnh.
        </p>
      </div>
      <div className="timeline">
        <div className="story-line" />
        {wedding.story.map((item) => (
          <article key={item.year}>
            <span className="timeline-dot" />
            <p className="story-year">{item.year}</p>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

