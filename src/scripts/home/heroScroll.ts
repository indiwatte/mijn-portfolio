import { gsap, ScrollTrigger } from "../gsap";

// Pin the hero for one viewport of extra scroll. The #story section is pulled up
// with a negative margin (see its CSS) so it rides along with native scroll and
// naturally covers the hero once the pin releases — no separate scrub tween needed.
export function initHeroScroll() {
    ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "+=100%",
        pin: true,
    });

    // The sun sets under the white layer as you scroll down (and rises again scrolling
    // up): it sinks a little faster than the layer rises, while its glow on the white
    // layer grows, so the light still shines through once the sun itself is hidden.
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const sun = document.querySelector("[data-hero-sun]");
        const glow = document.querySelector("[data-sun-glow]");
        if (!sun || !glow) return;
        gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: "#hero", start: "top top", end: "+=70%", scrub: 0.8 },
        })
            .to(sun, { yPercent: 60, scale: 0.92 }, 0)
            .to(glow, { opacity: 1, scaleX: 1.15 }, 0);
    });

    // The manifesto headline slowly reveals as it scrolls into view (transform +
    // opacity only). With reduced motion it simply stays visible.
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
            "#manifesto-heading",
            { y: 80, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: "#manifesto-heading",
                    start: "top 90%",
                    end: "top 35%",
                    scrub: 1,
                },
            },
        );
    });
}
