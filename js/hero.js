// hero.js

// Import GSAP and ScrollTrigger plugin
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Wait for DOM to fully load before executing
document.addEventListener("DOMContentLoaded", () => {
  // Check if current page is the homepage; exit if not
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  // Register ScrollTrigger plugin with GSAP
  gsap.registerPlugin(ScrollTrigger);

  // Split hero headings into per-letter spans and stagger-reveal them
  const heroHeadings = document.querySelectorAll(".hero .hero-header h1");
  heroHeadings.forEach((h) => {
    const text = h.textContent;
    h.textContent = "";
    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = ch === " " ? " " : ch;
      h.appendChild(span);
    });
  });
  const letters = document.querySelectorAll(".hero .hero-header h1 .letter");
  gsap.set(letters, { yPercent: 110, opacity: 0 });
  gsap.to(letters, {
    yPercent: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    stagger: 0.05,
    delay: 0.4,
  });

  // Select hero image element
  const heroImg = document.querySelector(".hero-img img");
  let currentImageIndex = 1; // Tracks current image in sequence
  const totalImages = 10; // Total number of images for cycling
  let scrollTriggerInstance = null; // Stores ScrollTrigger instance for cleanup

  // Cycle through images every 250ms
  setInterval(() => {
    // Increment image index, reset to 1 if it exceeds totalImages
    currentImageIndex =
      currentImageIndex >= totalImages ? 1 : currentImageIndex + 1;
    // Update hero image source
    heroImg.src = `/images/work-items/work-item-${currentImageIndex}.jpg`;
  }, 250);

  // Initialize animations with ScrollTrigger
  const initAnimations = () => {
    // Kill existing ScrollTrigger instance to prevent duplicates
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    // Create new ScrollTrigger instance
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: ".hero-img-holder", // Element that triggers animation
      start: "top bottom", // Animation starts when top of trigger hits bottom of viewport
      end: "top top", // Animation ends when top of trigger hits top of viewport
      onUpdate: (self) => {
        const progress = self.progress; // Scroll progress (0 to 1)
        // Animate hero image properties based on scroll progress
        gsap.set(".hero-img", {
          y: `${-110 + 110 * progress}%`, // Move up from -110% to 0%
          scale: 0.25 + 0.75 * progress, // Scale from 0.25 to 1
          rotation: -15 + 15 * progress, // Rotate from -15deg to 0deg
        });
      },
    });
  };

  // Run animations on page load
  initAnimations();

  // Re-run animations on window resize to recalculate trigger points
  window.addEventListener("resize", () => {
    initAnimations();
  });
});