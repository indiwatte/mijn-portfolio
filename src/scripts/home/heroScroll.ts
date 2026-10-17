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

    // The sun stays in place while the white layer slides over it; its glow (fixed to the
    // bottom of the screen) fades in on the white layer, so the light keeps shining
    // through it down the whole page.
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const glow = document.querySelector("[data-sun-glow]");
        if (!glow) return;
        gsap.to(glow, {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: "#hero", start: "top top", end: "+=70%", scrub: 0.8 },
        });
    });

    // The title splits as you scroll: "Designer who" slides off to the left, the rotating
    // word to the right, fading as they go. Scrubbed, so scrolling back brings them together.
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        // the whole first line: the mockup pill goes along with "Designer who"
        const left = document.querySelector<HTMLElement>(".hero-line--static");
        // the whole second line: the photo and creature pills go along with the word
        const right = document.querySelector<HTMLElement>(".hero-line--word");
        if (!left || !right) return;
        gsap.timeline({
            defaults: { ease: "power2.in" },
            // From the very top of the page (a "#hero" trigger would only start after its pin).
            scrollTrigger: { start: 0, end: () => window.innerHeight * 0.6, scrub: 0.6, invalidateOnRefresh: true },
        })
            .to(left, { xPercent: -70, autoAlpha: 0 }, 0)
            .to(right, { xPercent: 70, autoAlpha: 0 }, 0);
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
