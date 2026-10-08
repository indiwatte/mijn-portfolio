import { gsap } from "../gsap";

// gsap.matchMedia sets animations up per condition and reverts them (tweens,
// ScrollTriggers, inline styles) automatically when the condition stops matching.
export function initProjectsGallery() {
    const mm = gsap.matchMedia();

    // Case studies: they start as one stacked deck in the middle of the grid (slightly
    // turned, like cards on a table) and fan out to their own spots as you scroll down,
    // like zainabkabira.com. Scrubbed, so scrolling back up stacks them again.
    // Only with two columns; on phones they simply sit under each other.
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const grid = document.querySelector<HTMLElement>(".cases");
        const cards = gsap.utils.toArray<HTMLElement>(".case", grid ?? undefined);
        if (!grid || cards.length < 2) return;

        const TILT = [-7, 5, -3, 8];
        // Offset from each card's own spot to the middle of the grid
        const toCentre = (card: HTMLElement, axis: "x" | "y") => {
            const g = grid.getBoundingClientRect();
            const c = card.getBoundingClientRect();
            return axis === "x"
                ? g.left + g.width / 2 - (c.left + c.width / 2)
                : g.top + g.height / 2 - (c.top + c.height / 2);
        };

        // The first card ends up on top of the deck
        cards.forEach((card, i) => gsap.set(card, { position: "relative", zIndex: cards.length - i }));

        const spread = gsap.timeline({
            scrollTrigger: {
                trigger: grid,
                start: "top 75%",
                end: "center 45%",
                scrub: 1,
                invalidateOnRefresh: true,
            },
        });
        cards.forEach((card, i) => {
            spread.from(
                card,
                {
                    x: () => toCentre(card, "x") + i * 10,
                    y: () => toCentre(card, "y") + i * 8,
                    rotation: TILT[i % TILT.length],
                    scale: 0.82,
                    ease: "power2.inOut",
                    duration: 1,
                },
                i * 0.08, // the top card lifts off first
            );
        });
    });

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
