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
