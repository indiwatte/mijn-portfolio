import { gsap } from "./gsap";

// The footer ideas playground (src/pages/footer-ideas.astro). Every idea is one timeline,
// scrubbed over its tall section while the stage stays sticky: scrolling back plays it
// back. Each timeline runs from 0 to 1, so the positions below read as "% of the scroll".
// With reduced motion every idea just shows its end state.

type Find = <T extends Element = HTMLElement>(selector: string) => T;
type Build = (tl: gsap.core.Timeline, find: Find, size: { w: number; h: number }) => void;

const media = gsap.matchMedia();

function idea(id: string, build: Build) {
    const root = document.querySelector<HTMLElement>(`[data-idea="${id}"]`);
    const scene = root?.querySelector<HTMLElement>(".scene");
    if (!root || !scene) return;
    const find: Find = (selector) => root.querySelector(selector)!;

    media.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
        const reduce = Boolean(context.conditions?.reduce);
        const tl = gsap.timeline({
            defaults: { ease: "none" },
            paused: reduce,
            scrollTrigger: reduce
                ? undefined
                : { trigger: root, start: "top top", end: "bottom bottom", scrub: 1 },
        });
        build(tl, find, { w: scene.clientWidth, h: scene.clientHeight });
        if (reduce) tl.progress(1);
    });
}

// 1. The bee loops in and lands on a flower that grows up; then a heart opens behind it.
idea("bee", (tl, find, { w, h }) => {
    tl.from(find("[data-bee-stem]"), { scaleY: 0, duration: 0.3 }, 0)
        .from(find("[data-bee-flower]"), { scale: 0, y: 80, duration: 0.3, ease: "back.out(1.6)" }, 0.15)
        .fromTo(
            find("[data-bee]"),
            { x: -w * 0.6, y: -h * 0.45 },
            {
                motionPath: {
                    path: [
                        { x: -w * 0.2, y: -h * 0.05 },
                        { x: w * 0.2, y: -h * 0.35 },
                        { x: w * 0.05, y: -h * 0.12 },
                        { x: 0, y: 0 },
                    ],
                    curviness: 1.4,
                },
                duration: 0.65,
                ease: "sine.inOut",
            },
            0.05,
        )
        .from(find("[data-bee-heart]"), { scale: 0, opacity: 0, transformOrigin: "50% 90%", duration: 0.2, ease: "back.out(1.8)" }, 0.72)
        .from(find("[data-bee-line]"), { opacity: 0, y: 24, duration: 0.15 }, 0.85);
});

// 2. Pencil half (left) and vector half (right) draw up from the bottom tip and meet.
idea("sketch", (tl, find) => {
    const halves = [find<SVGPathElement>("[data-sketch-left]"), find<SVGPathElement>("[data-sketch-right]")];
    halves.forEach((half) => {
        const length = half.getTotalLength();
        tl.fromTo(half, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut" }, 0);
    });
    tl.from(find("[data-sketch-fill]"), { opacity: 0, scale: 0.92, transformOrigin: "50% 50%", duration: 0.2 }, 0.62)
        .to(find("[data-sketch-handles]"), { opacity: 0, duration: 0.15 }, 0.7)
        .to(halves, { opacity: 0, duration: 0.15 }, 0.78);
});

// 3. The two puzzle pieces slide in, click together, and the mail button appears.
idea("puzzle", (tl, find) => {
    const left = find("[data-puzzle-left]");
    const right = find("[data-puzzle-right]");
    tl.from(left, { x: -460, y: 40, rotation: -18, transformOrigin: "50% 50%", duration: 0.65, ease: "power2.out" }, 0)
        .from(right, { x: 460, y: -40, rotation: 14, transformOrigin: "50% 50%", duration: 0.65, ease: "power2.out" }, 0)
        // the click: a tiny squeeze when they lock
        .to([left, right], { scale: 1.04, transformOrigin: "200px 100px", duration: 0.04 }, 0.66)
        .to([left, right], { scale: 1, duration: 0.08, ease: "back.out(3)" }, 0.7)
        .from(find("[data-puzzle-button]"), { opacity: 0, y: 30, duration: 0.15 }, 0.8);
});

// 4. Two creatures waddle in, bump, and a heart pops up between them.
idea("creatures", (tl, find, { w }) => {
    const left = find("[data-pair-left]");
    const right = find("[data-pair-right]");
    tl.from(left, { x: -w * 0.45, duration: 0.6, ease: "power1.out" }, 0)
        .from(right, { x: w * 0.45, duration: 0.6, ease: "power1.out" }, 0)
        // waddle on the way
        .fromTo(left, { rotation: -8 }, { rotation: 8, duration: 0.1, repeat: 5, yoyo: true, ease: "sine.inOut" }, 0)
        .fromTo(right, { rotation: 8 }, { rotation: -8, duration: 0.1, repeat: 5, yoyo: true, ease: "sine.inOut" }, 0)
        .to([left, right], { rotation: 0, duration: 0.04 }, 0.6)
        // the bump
        .to(left, { x: -16, duration: 0.05, ease: "power2.out" }, 0.64)
        .to(right, { x: 16, duration: 0.05, ease: "power2.out" }, 0.64)
        .to([left, right], { x: 0, duration: 0.06, ease: "back.out(2)" }, 0.69)
        .from(find("[data-pair-heart]"), { scale: 0, y: 40, transformOrigin: "50% 100%", duration: 0.15, ease: "back.out(2.5)" }, 0.7)
        .from(find("[data-pair-sparks]").children, { scale: 0, opacity: 0, duration: 0.08 }, 0.74)
        .to(find("[data-pair-sparks]").children, { opacity: 0, duration: 0.1 }, 0.86);
});

// 5. The ridges slide apart like curtains and the sun rises between them.
idea("sun", (tl, find) => {
    tl.from(find("[data-sun-left]"), { xPercent: 42, duration: 0.6, ease: "power1.inOut" }, 0)
        .from(find("[data-sun-right]"), { xPercent: -42, duration: 0.6, ease: "power1.inOut" }, 0)
        .from(find("[data-sun-disc]"), { yPercent: 95, scale: 0.85, duration: 0.65, ease: "sine.out" }, 0.15)
        .from(find("[data-sun-line]"), { opacity: 0, y: 30, duration: 0.2 }, 0.72);
});

// 6. Two drops fall, melt together (gooey filter) and spread into the mail button.
idea("paint", (tl, find) => {
    const blue = find("[data-paint-blue]");
    const orange = find("[data-paint-orange]");
    tl.from(blue, { x: -170, y: -200, scale: 0.6, transformOrigin: "50% 50%", duration: 0.5, ease: "power2.in" }, 0)
        .from(orange, { x: 170, y: -200, scale: 0.6, transformOrigin: "50% 50%", duration: 0.5, ease: "power2.in" }, 0.04)
        .from(find("[data-paint-pill]"), { scaleX: 0.15, scaleY: 0.6, transformOrigin: "50% 50%", duration: 0.25, ease: "back.out(1.4)" }, 0.55)
        .to([blue, orange], { scale: 0.5, opacity: 0, duration: 0.2 }, 0.6)
        .from(find("[data-paint-text]"), { opacity: 0, y: 10, duration: 0.12 }, 0.8);
});

// 7. Letters fly in from both sides, lock into place, then the marker swipes over "together?".
idea("letters", (tl, find, { w, h }) => {
    const letters = gsap.utils.toArray<HTMLElement>(find("[data-letters-mark]").parentElement!.querySelectorAll("[data-letter]"));
    const half = 10; // "Let's work" comes from the left, "together?" from the right
    tl.from(letters, {
        x: (i) => (i < half ? -1 : 1) * gsap.utils.random(w * 0.3, w * 0.6),
        y: () => gsap.utils.random(-h * 0.4, h * 0.4),
        rotation: () => gsap.utils.random(-90, 90),
        opacity: 0,
        duration: 0.5,
        stagger: { each: 0.012, from: "edges" },
        ease: "power2.out",
    }, 0).fromTo(find("[data-letters-mark]"), { backgroundSize: "0% 78%" }, { backgroundSize: "100% 78%", duration: 0.2, ease: "power1.inOut" }, 0.78);
});

// 8. A paper plane loops across, lands and becomes an envelope that opens.
idea("plane", (tl, find, { w, h }) => {
    const plane = find("[data-plane]");
    tl.fromTo(
        plane,
        { x: -w * 0.6, y: h * 0.25 },
        {
            motionPath: {
                path: [
                    { x: -w * 0.25, y: -h * 0.25 },
                    { x: w * 0.12, y: -h * 0.08 },
                    { x: -w * 0.05, y: h * 0.18 },
                    { x: -w * 0.18, y: -h * 0.02 },
                    { x: 0, y: 0 },
                ],
                curviness: 1.5,
                autoRotate: true,
            },
            duration: 0.55,
            ease: "sine.inOut",
        },
        0,
    )
        .to(plane, { scale: 0.3, opacity: 0, duration: 0.08 }, 0.56)
        .from(find("[data-envelope]"), { scale: 0.3, opacity: 0, duration: 0.12, ease: "back.out(1.8)" }, 0.58)
        .to(find("[data-envelope-flap]"), { rotationX: 180, duration: 0.12, ease: "power1.inOut" }, 0.72)
        .set(find("[data-envelope-flap]"), { zIndex: 0 }, 0.78)
        .to(find("[data-envelope-letter]"), { yPercent: -48, duration: 0.15, ease: "power2.out" }, 0.82);
});
