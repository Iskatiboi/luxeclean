import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Scroll-entry reveals for the sections below the pinned hero. Three distinct
// behaviours rather than one entrance repeated down the page: headings unblur
// upward, supporting content rises, and framed media opens from its top edge.
//
// Initial states are set here rather than as classes in markup, so a visitor
// without JS gets fully visible content and there is no flash before hydration.
export function initReveals() {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const start = "top 85%";

    const headings = gsap.utils.toArray<HTMLElement>('[data-reveal="heading"]');
    const rising = gsap.utils.toArray<HTMLElement>('[data-reveal="rise"]');
    const frames = gsap.utils.toArray<HTMLElement>('[data-reveal="frame"]');
    const groups = gsap.utils.toArray<HTMLElement>("[data-reveal-group]");

    if (headings.length) {
      gsap.set(headings, { autoAlpha: 0, y: 28, filter: "blur(8px)" });
      ScrollTrigger.batch(headings, {
        start,
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09,
            onComplete: () => gsap.set(batch, { clearProps: "filter" }),
          }),
      });
    }

    if (rising.length) {
      gsap.set(rising, { autoAlpha: 0, y: 20 });
      ScrollTrigger.batch(rising, {
        start,
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.07,
          }),
      });
    }

    if (frames.length) {
      gsap.set(frames, { clipPath: "inset(0% 0% 100% 0%)", scale: 1.05 });
      ScrollTrigger.batch(frames, {
        start,
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.3,
            ease: "expo.out",
            onComplete: () => gsap.set(batch, { clearProps: "clipPath" }),
          }),
      });
    }

    // Groups stagger their own children, so a row of chips or cards arrives in
    // sequence instead of every item in every section sharing one global stagger.
    groups.forEach((group) => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal-item]", group);
      if (!items.length) return;

      gsap.set(items, { autoAlpha: 0, y: 16 });
      ScrollTrigger.create({
        trigger: group,
        start,
        once: true,
        onEnter: () =>
          gsap.to(items, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.045,
          }),
      });
    });
  });
}
