import { gsap, ScrollTrigger } from "./gsap";

// The moments in the footer (Footer.astro), in the order you meet them:
// 1. The title assembles: the letters of "So, let's work" fly in while the footer slides
//    in, and the flower after it grows up from the bottom (both scrubbed, so scrolling
//    back scatters the letters and lets the flower sink again).
// 2. When the bee lands on the flower (scrollPath.ts sends "bee:landed") they clash: the
//    flower squashes, springs back and bursts out pollen, and a warm sunset colour grows over
//    the footer in a circle from its heart, while "together?" pops in. Pages without the bee
//    get the same once you reach the bottom.
// With reduced motion everything is simply in its end state.

let media: gsap.MatchMedia | undefined;
let revealGlow: ((on: boolean) => void) | undefined;

function initFooterMoments() {
    media?.revert();
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const title = footer.querySelector<HTMLElement>("[data-footer-title]");
    const together = footer.querySelector<HTMLElement>("[data-footer-together]");
    const glow = footer.querySelector<HTMLElement>("[data-footer-glow]");
    const flower = footer.querySelector<HTMLElement>("[data-footer-flower]");

    media = gsap.matchMedia();
    media.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (context) => {
            const reduce = Boolean(context.conditions?.reduce);
            if (!reduce && title && together) assembleTitle(title, together);
            // laid out again whenever the page is measured (resize, fonts, pins)
            const layout = () => flower && layoutFlower(flower as unknown as SVGSVGElement, footer);
            layout();
            ScrollTrigger.addEventListener("refreshInit", layout);
            if (!reduce && flower && title) growFlower(flower, title);
            if (glow && flower && together) revealGlow = glowFrom(footer, glow, flower, together, reduce);
            return () => {
                revealGlow = undefined;
                ScrollTrigger.removeEventListener("refreshInit", layout);
            };
        },
    );
}

// 1. The letters of "So, let's work" come from the left ("together?" waits for the bee).
function assembleTitle(title: HTMLElement, together: HTMLElement) {
    const letters = gsap.utils.toArray<HTMLElement>("[data-letter]", title).filter((el) => !together.contains(el));

    gsap.from(letters, {
        x: () => -gsap.utils.random(window.innerWidth * 0.25, window.innerWidth * 0.5),
        y: () => gsap.utils.random(-120, 120),
        rotation: () => gsap.utils.random(-70, 70),
        opacity: 0,
        stagger: { each: 0.015, from: "end" },
        ease: "power2.out",
        scrollTrigger: { trigger: title, start: "top 95%", end: "top 40%", scrub: 1, invalidateOnRefresh: true },
    });
}

// 1b. Lay the flower out for this footer: the svg starts at the bloom (next to the title)
//     and is stretched down to the bottom of the footer; the main stem curves down to there,
//     and the leaves and the side stem with its bud sit at their spot along it.
function layoutFlower(flower: SVGSVGElement, footer: HTMLElement) {
    const box = flower.getBoundingClientRect();
    // a few px short of the bottom, so the stem's round tip never makes the page taller
    const bottom = footer.getBoundingClientRect().bottom - 4;
    if (!box.width || bottom <= box.top) return;
    const unit = box.width / 120;
    const height = (bottom - box.top) / unit; // in viewBox units
    flower.setAttribute("viewBox", `0 0 120 ${height}`);
    flower.style.height = `${bottom - box.top}px`;

    const main = flower.querySelector<SVGPathElement>("[data-main]")!;
    const span = height - 66;
    main.setAttribute("d", `M60 ${height}C48 ${66 + span * 0.7} 72 ${66 + span * 0.35} 60 66`);
    const length = main.getTotalLength();
    // t: 0 = at the bloom, 1 = at the ground
    const along = (t: number) => main.getPointAtLength(length * (1 - t));

    flower.querySelectorAll<SVGGElement>("[data-flower-at]").forEach((leaf) => {
        const t = 1 - Number(leaf.dataset.flowerAt);
        // the higher up, the smaller
        const scale = 1.05 + 0.45 * t;
        const p = along(t);
        leaf.setAttribute("transform", `translate(${p.x} ${p.y}) scale(${scale.toFixed(2)})`);
    });

    const side = flower.querySelector<SVGPathElement>("[data-side]")!;
    const start = along(0.28);
    const end = { x: start.x + 34, y: start.y - 44 };
    side.setAttribute("d", `M${start.x} ${start.y}C${start.x + 14} ${start.y - 10} ${end.x - 4} ${end.y + 18} ${end.x} ${end.y}`);
    flower.querySelector("[data-flower-bud-at]")!.setAttribute("transform", `translate(${end.x} ${end.y}) scale(1.3)`);
}

// 1c. The flower grows: the stems draw up from the bottom of the footer, the leaves and the
//     bud unfold, then the bloom opens. Every part grows from where it meets the stem.
function growFlower(flower: HTMLElement, title: HTMLElement) {
    const part = (selector: string) => gsap.utils.toArray<SVGGElement>(selector, flower);
    const from = (el: SVGGElement) => el.dataset.origin!;
    const length = (el: Element) => (el as SVGPathElement).getTotalLength();
    const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: title, start: "top 95%", end: "top 30%", scrub: 1, invalidateOnRefresh: true },
    });
    const [main, side] = part("[data-flower-stem]");
    tl.fromTo(main, { strokeDasharray: () => length(main), strokeDashoffset: () => length(main) }, { strokeDashoffset: 0, duration: 0.6 }, 0);
    if (side) tl.fromTo(side, { strokeDasharray: () => length(side), strokeDashoffset: () => length(side) }, { strokeDashoffset: 0, duration: 0.2 }, 0.45);
    // leaves from the bottom up, as the stem passes them
    part("[data-flower-leaf]").forEach((leaf, i) => {
        tl.from(leaf, { scale: 0, rotation: leaf.dataset.growFrom?.startsWith("100") ? 30 : -30, transformOrigin: leaf.dataset.growFrom, duration: 0.25, ease: "back.out(1.6)" }, 0.12 + i * 0.15);
    });
    part("[data-flower-bud]").forEach((bud) => {
        tl.from(bud, { scale: 0, transformOrigin: bud.dataset.growFrom, duration: 0.2, ease: "back.out(2)" }, 0.62);
    });
    part("[data-flower-bloom]").forEach((bloom) => {
        tl.from(bloom, { scale: 0, rotation: -25, svgOrigin: from(bloom), duration: 0.3, ease: "back.out(1.4)" }, 0.6)
            // the front petals open last, like the cup unfolding
            .from(bloom.querySelector("[data-flower-front]"), { scaleY: 0.3, svgOrigin: "60 68", duration: 0.2, ease: "back.out(2)" }, 0.8);
    });
}

// The clash when the bee touches down: the bloom squashes and springs back, the plant
// sways and the pollen bursts out.
function clash(flower: HTMLElement) {
    const bloom = flower.querySelector("[data-flower-bloom]");
    const pollen = gsap.utils.toArray<SVGCircleElement>("[data-flower-pollen] circle", flower);
    gsap.timeline()
        .to(bloom, { scaleX: 1.18, scaleY: 0.78, svgOrigin: "60 66", duration: 0.1, ease: "power2.out" }, 0)
        .to(bloom, { scaleX: 1, scaleY: 1, duration: 0.9, ease: "elastic.out(1, 0.35)" }, 0.1)
        .fromTo(flower, { rotation: 0 }, { keyframes: { rotation: [7, -4, 2, 0] }, transformOrigin: "50% 100%", duration: 0.9, ease: "sine.out" }, 0)
        .fromTo(
            pollen,
            { x: 0, y: 0, opacity: 1, scale: 1 },
            {
                x: (i, el) => Number(el.dataset.to!.split(" ")[0]),
                y: (i, el) => Number(el.dataset.to!.split(" ")[1]),
                opacity: 0,
                scale: 0.4,
                duration: 0.7,
                ease: "power2.out",
            },
            0.05,
        );
}

// 2. The sunset circle + "together?". Returns a switch: on = grow out of the flower and
//    show the word, off = shrink back and hide it.
function glowFrom(footer: HTMLElement, glow: HTMLElement, flower: HTMLElement, together: HTMLElement, reduce: boolean) {
    const word = gsap.utils.toArray<HTMLElement>("[data-letter]", together);
    let tweens: gsap.core.Animation[] = [];
    const heart = flower.querySelector("[data-flower-heart]") ?? flower;
    const centre = () => {
        const box = footer.getBoundingClientRect();
        const spot = heart.getBoundingClientRect();
        const x = spot.left + spot.width / 2 - box.left;
        const y = spot.top + spot.height / 2 - box.top;
        // far enough to cover the farthest corner of the footer
        const radius = Math.hypot(Math.max(x, box.width - x), Math.max(y, box.height - y));
        return { x, y, radius };
    };

    const set = (on: boolean) => {
        const { x, y, radius } = centre();
        glow.style.setProperty("--glow-x", `${x}px`);
        glow.style.setProperty("--glow-y", `${y}px`);
        tweens.forEach((tween) => tween.kill());
        const to = `circle(${on ? radius : 0}px at ${x}px ${y}px)`;
        if (reduce) {
            gsap.set(glow, { clipPath: to });
            gsap.set(word, { opacity: on ? 1 : 0, y: 0, scale: 1 });
            return;
        }
        if (on) clash(flower);
        tweens = on
            ? [
                  gsap.fromTo(glow, { clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: to, duration: 0.7, delay: 0.08, ease: "power2.out" }),
                  gsap.fromTo(
                      word,
                      { opacity: 0, y: 30, scale: 0.6 },
                      { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.03, ease: "back.out(2)" },
                  ),
              ]
            : [
                  gsap.to(glow, { clipPath: to, duration: 0.45, ease: "power2.in" }),
                  gsap.to(word, { opacity: 0, y: 20, scale: 0.8, duration: 0.25, stagger: 0.015, ease: "power1.in" }),
              ];
    };

    // hidden until the bee lands
    gsap.set(word, { opacity: 0 });

    let isOn = false;
    const toggle = (on: boolean) => {
        if (on === isOn) return;
        isOn = on;
        set(on);
    };

    // Without the bee (other pages, or reduced motion where it doesn't fly): at the bottom.
    const hasBee = !reduce && document.querySelector("[data-scroll-bird]");
    if (!hasBee) {
        ScrollTrigger.create({
            trigger: footer,
            start: "bottom bottom+=2",
            onEnter: () => toggle(true),
            onLeaveBack: () => toggle(false),
        });
    }
    return toggle;
}

// The bee dives head first into the flower: the flying bee disappears and its butt pops up
// out of the bloom's heart, legs kicking and wings buzzing. Taking off swaps them back.
let buttTweens: gsap.core.Animation[] = [];
function beeInFlower(on: boolean) {
    const bird = document.querySelector("[data-scroll-bird]");
    const butt = document.querySelector<SVGGElement>("[data-bee-butt]");
    if (!bird || !butt) return;
    buttTweens.forEach((tween) => tween.kill());
    if (!on) {
        gsap.set(butt, { opacity: 0, rotation: 0 });
        gsap.set(butt.querySelectorAll("[data-butt-leg], [data-butt-wing]"), { rotation: 0, scaleY: 1 });
        gsap.set(bird, { autoAlpha: 1 });
        buttTweens = [];
        return;
    }
    gsap.set(bird, { autoAlpha: 0 });
    const legs = butt.querySelectorAll("[data-butt-leg]");
    const wings = butt.querySelectorAll("[data-butt-wing]");
    buttTweens = [
        // pops up out of the heart, with a squash as it wedges in
        gsap.fromTo(butt, { opacity: 1, y: 10, scaleY: 0.4, svgOrigin: "60 46" }, { y: 0, scaleY: 1, duration: 0.5, ease: "back.out(2.5)" }),
        // then it rests, and every 3 seconds or so moves a bit, calmly: a little wiggle of the
        // butt, a slow kick of the legs one after the other, and a short flutter of the wings
        gsap.timeline({ repeat: -1, repeatDelay: 2.2, delay: 1.2, defaults: { ease: "sine.inOut" } })
            .to(butt, { rotation: 4, svgOrigin: "60 46", duration: 0.5 })
            .to(butt, { rotation: -3, duration: 0.6 })
            .to(butt, { rotation: 0, duration: 0.5 })
            .to(legs, { rotation: 10, svgOrigin: "60 28", duration: 0.35, stagger: 0.12, yoyo: true, repeat: 1 }, 0.2)
            .to(wings, { scaleY: 0.6, transformOrigin: "50% 50%", duration: 0.15, yoyo: true, repeat: 3 }, 0.9),
    ];
}

// The bee tells when it lands on the flower (and when it takes off again).
window.addEventListener("bee:landed", (event) => {
    const landed = (event as CustomEvent<boolean>).detail;
    revealGlow?.(landed);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) beeInFlower(landed);
});

initFooterMoments();
// Project pages use Astro's client router: re-run after every client-side navigation.
document.addEventListener("astro:page-load", initFooterMoments);
