import { gsap } from "../gsap";

// gsap.matchMedia sets animations up per condition and reverts them (tweens,
// ScrollTriggers, inline styles) automatically when the condition stops matching.
export function initProjectsGallery() {
    const mm = gsap.matchMedia();

    // Parallax only when the three columns sit side by side (on phones they stack,
    // and shifting them would only cost work and let cards overlap).
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const cols = gsap.utils.toArray<HTMLElement>(".parallax-col");
        if (!cols.length) return;

        // One timeline with one ScrollTrigger drives all columns.
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#parallax-grid",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            },
        });

        cols.forEach((col) => {
            const direction = col.dataset.direction === "down" ? 1 : -1;
            tl.to(col, { y: direction * 90, ease: "none", force3D: true }, 0);
        });
    });

    // Hover reveal only for devices with a real mouse.
    mm.add("(hover: hover) and (pointer: fine)", () => {
        const cleanups: (() => void)[] = [];

        gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
            const overlay = card.querySelector<HTMLElement>(".project-overlay");
            const content = card.querySelector<HTMLElement>(".project-overlay-content");
            if (!overlay || !content) return;

            // autoAlpha keeps the overlay visibility:hidden at rest, so the browser
            // skips its backdrop blur entirely until the card is hovered.
            gsap.set(overlay, { scale: 0, autoAlpha: 0 });

            const tl = gsap
                .timeline({ paused: true })
                .to(overlay, { scale: 2.4, autoAlpha: 1, duration: 0.5, ease: "power3.out" })
                .to(content, { opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.2");

            const enter = () => tl.play();
            const leave = () => tl.reverse();
            card.addEventListener("mouseenter", enter);
            card.addEventListener("mouseleave", leave);
            cleanups.push(() => {
                card.removeEventListener("mouseenter", enter);
                card.removeEventListener("mouseleave", leave);
            });
        });

        return () => cleanups.forEach((cleanup) => cleanup());
    });
}
