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
}
