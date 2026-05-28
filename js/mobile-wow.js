// mobile-wow.js — mobile-only scroll entrance animations and idle motion
// Activates at viewport widths <= 1000px. Disables itself on resize past breakpoint.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  let triggers = [];
  let idleTweens = [];
  let active = false;

  const cleanup = () => {
    triggers.forEach((t) => t && t.kill());
    triggers = [];
    idleTweens.forEach((tw) => tw && tw.kill());
    idleTweens = [];
  };

  const isMobile = () => window.innerWidth <= 1000;

  const init = () => {
    if (!isMobile()) {
      if (active) {
        cleanup();
        // Reset any inline transforms we set
        gsap.set(
          ".featured-title-wrapper, .service-card, .contact-button, .about-hero-portrait, footer .footer-symbols img",
          { clearProps: "all" }
        );
        active = false;
      }
      return;
    }

    if (active) return;
    active = true;

    // 1. Featured work — each project card slides in from alternating sides + scales
    const featuredItems = gsap.utils.toArray(
      ".featured-work .featured-title-wrapper"
    );
    featuredItems.forEach((item, i) => {
      const fromX = i % 2 === 0 ? -40 : 40;
      gsap.set(item, { opacity: 0, x: fromX, y: 30, scale: 0.95 });
      const tw = gsap.to(item, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
      if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);

      // Image inside each card — clip-reveal feel via scale + slight rotation
      const img = item.querySelector(".featured-title-img");
      if (img) {
        gsap.set(img, { scale: 0.85, rotation: -3, opacity: 0 });
        const imgTw = gsap.to(img, {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
        if (imgTw.scrollTrigger) triggers.push(imgTw.scrollTrigger);
      }
    });

    // 2. Service cards — fade up + tilt-in
    const serviceCards = gsap.utils.toArray(".services .service-card");
    serviceCards.forEach((card, i) => {
      const tiltFrom = i % 2 === 0 ? -2 : 2;
      gsap.set(card, { opacity: 0, y: 60, rotation: tiltFrom, scale: 0.96 });
      const tw = gsap.to(card, {
        opacity: 1,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
      if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
    });

    // 3. Contact CTA — scale-pop on entry
    const contactButton = document.querySelector(".contact-cta .contact-button");
    if (contactButton) {
      gsap.set(contactButton, { opacity: 0, scale: 0.85, y: 40 });
      const tw = gsap.to(contactButton, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.9,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: contactButton,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
      if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
    }

    // 4. About-hero portrait — gentle continuous bob
    const portrait = document.querySelector(".about-hero .about-hero-portrait");
    if (portrait) {
      const bob = gsap.to(portrait, {
        y: -6,
        rotation: "-=1.5",
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      idleTweens.push(bob);
    }

    // 5. Footer symbols — soft sway
    const symbols = gsap.utils.toArray("footer .footer-symbols img");
    symbols.forEach((sym, i) => {
      const sway = gsap.to(sym, {
        y: i % 2 === 0 ? -4 : 4,
        rotation: i % 2 === 0 ? -8 : 8,
        duration: 2 + i * 0.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      idleTweens.push(sway);
    });
  };

  init();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!isMobile() && active) {
        cleanup();
        gsap.set(
          ".featured-title-wrapper, .service-card, .contact-button, .about-hero-portrait, footer .footer-symbols img",
          { clearProps: "all" }
        );
        active = false;
      } else if (isMobile() && !active) {
        init();
      }
    }, 150);
  });
});
