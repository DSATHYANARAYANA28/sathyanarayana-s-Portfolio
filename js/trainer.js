// trainer.js
// Controls the Trainer / Work profile toggle and its entrance animations.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".profile-section");
  if (!section) return;

  gsap.registerPlugin(ScrollTrigger);

  const switchEl = section.querySelector(".profile-switch");
  const buttons = section.querySelectorAll(".switch-btn");
  const panels = section.querySelectorAll(".profile-panel");

  // collect the major animatable blocks inside a panel, in document order
  const blocksOf = (panel) =>
    gsap.utils.toArray(
      panel.querySelectorAll(
        ".profile-header, .profile-summary, .meta-grid, .entry-heading, .entry-item"
      )
    );

  // play a staggered fade-up entrance on a panel's blocks
  const animatePanel = (panel) => {
    const blocks = blocksOf(panel);
    if (!blocks.length) return;
    gsap.killTweensOf(blocks);
    gsap.fromTo(
      blocks,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        overwrite: true,
        clearProps: "transform",
      }
    );
    // pills pop within the panel
    const pills = gsap.utils.toArray(panel.querySelectorAll(".pill"));
    if (pills.length) {
      gsap.fromTo(
        pills,
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: "back.out(1.7)",
          stagger: 0.04,
          delay: 0.15,
          overwrite: true,
        }
      );
    }
  };

  let hasRevealed = false;

  // reveal the default (active) panel once it scrolls into view
  const activePanel = section.querySelector(".profile-panel.active");
  if (activePanel) {
    const blocks = blocksOf(activePanel);
    gsap.set(blocks, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      once: true,
      onEnter: () => {
        hasRevealed = true;
        animatePanel(activePanel);
      },
    });
  }

  // toggle handler
  const switchTo = (target) => {
    buttons.forEach((b) =>
      b.classList.toggle("active", b.dataset.target === target)
    );
    panels.forEach((p) =>
      p.classList.toggle("active", p.dataset.panel === target)
    );
    if (switchEl) switchEl.dataset.active = target;

    const panel = section.querySelector(`.profile-panel[data-panel="${target}"]`);
    if (panel) {
      hasRevealed = true;
      animatePanel(panel);
    }
    ScrollTrigger.refresh();
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      if (btn.classList.contains("active")) return;
      switchTo(target);
    });
  });
});
