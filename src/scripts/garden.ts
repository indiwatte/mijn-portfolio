import { gsap } from "./gsap";

// The footer garden (FooterGarden.astro): "Let's grow wonderful things".
// While the pointer moves over the footer, a watering can follows it and sprinkles drops.
// The drops fall to the bottom of the footer; every spot (a column of the footer) that gets
// enough water grows a flower there, up from the bottom edge, in one of three kinds.
// Mouse: just move. Touch: tap (each tap pours a short shower). Reduced motion: no garden.

const SPOT = 80; // width of one patch of soil, in px
const DROPS_PER_FLOWER = 6;
const MAX_DROPS = 40; // drops in the air at once

const NS = "http://www.w3.org/2000/svg";
const random = gsap.utils.random;

// Flower heads, drawn around their base at 0 0 (where the stem ends), in the same palette
// and with the same gradients as the big footer flower (FooterFlower.astro defines them).
const HEADS = {
    cup: `
        <path d="M-18 -10C-20 -28 -8 -36 0 -32C8 -36 20 -28 18 -10C12 -6 -12 -6 -18 -10Z" fill="url(#fl-back)" />
        <ellipse cx="0" cy="-17" rx="9" ry="7" fill="#f4f1ea" />
        <path d="M-20 -13C-17 4 17 4 20 -13C13 -8 7 -16 0 -9C-7 -16 -13 -8 -20 -13Z" fill="url(#fl-petal)" />
        <path d="M0 0L-10 -9M0 0L-4 -11M0 0L4 -11M0 0L10 -9" fill="none" stroke="#ffe1c9" stroke-width="0.6" opacity="0.8" />`,
    bud: `
        <path d="M-10 0C-14 -16 -6 -26 0 -22C6 -26 14 -16 10 0C5 4 -5 4 -10 0Z" fill="url(#fl-petal)" />
        <path d="M-4 -18C-1 -21 3 -21 5 -18" fill="none" stroke="#f4f1ea" stroke-width="2.5" stroke-linecap="round" />
        <path d="M0 1L-3 -12M3 1L4 -13" fill="none" stroke="#ffe1c9" stroke-width="0.6" opacity="0.8" />`,
    daisy: `
        ${Array.from({ length: 8 }, (_, i) => `<ellipse cx="0" cy="-22" rx="5" ry="10" fill="${i % 2 ? "#ffb8a0" : "#ff9fc4"}" transform="rotate(${i * 45} 0 -12)" />`).join("")}
        <circle cx="0" cy="-12" r="6" fill="#ffc93c" />
        <circle cx="-1.5" cy="-13.5" r="2" fill="#fff3c4" />`,
};
type Kind = keyof typeof HEADS;

const LEAF = `<path d="M0 0C-12 -2 -30 -12 -38 -32C-22 -29 -6 -19 0 0Z" fill="url(#fl-leaf)" />
    <path d="M-2 -2C-14 -10 -26 -20 -34 -29" fill="none" stroke="#efe3c2" stroke-width="0.7" stroke-linecap="round" />`;

// One flower: a gently curved stem of `height` px, a leaf halfway, a head on top.
function makeSprout(kind: Kind, height: number) {
    const sway = random(-14, 14);
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "sprout");
    svg.setAttribute("width", "90");
    svg.setAttribute("height", String(height + 50));
    svg.setAttribute("viewBox", `-45 ${-(height + 44)} 90 ${height + 50}`);
    const leafAt = height * random(0.35, 0.55);
    const flip = Math.random() < 0.5 ? -1 : 1;
    svg.innerHTML = `
        <g filter="url(#fl-grain)">
            <path d="M0 6Q${sway * 2} ${-height / 2} ${sway} ${-height}" fill="none" stroke="#56642f" stroke-width="3" stroke-linecap="round" data-stem />
            <g transform="translate(${sway * 0.55} ${-leafAt}) scale(${flip * random(0.5, 0.7)} ${random(0.5, 0.7)})"><g data-leaf>${LEAF}</g></g>
            <g transform="translate(${sway} ${-height}) scale(${random(0.85, 1.15)})"><g data-head>${HEADS[kind]}</g></g>
        </g>`;
    return svg;
}

function grow(garden: HTMLElement, x: number) {
    const kinds = Object.keys(HEADS) as Kind[];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const height = random(70, Math.min(230, garden.offsetHeight * 0.35));
    const sprout = makeSprout(kind, height);
    sprout.style.left = `${x - 45}px`;
    garden.prepend(sprout); // behind the drops and the can

    const stem = sprout.querySelector<SVGPathElement>("[data-stem]")!;
    const length = stem.getTotalLength();
    gsap.timeline({ defaults: { ease: "power2.out" } })
        .fromTo(stem, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.1 })
        .from(sprout.querySelector("[data-leaf]"), { scale: 0, transformOrigin: "100% 100%", duration: 0.6, ease: "back.out(1.8)" }, 0.5)
        .from(sprout.querySelector("[data-head]"), { scale: 0, rotation: random(-30, 30), transformOrigin: "50% 100%", duration: 0.7, ease: "back.out(2)" }, 0.9)
        // then it sways gently in the breeze, each at its own pace
        .add(() => {
            gsap.fromTo(sprout, { rotation: -2 }, { rotation: 2, transformOrigin: "50% 100%", duration: random(2.5, 4), repeat: -1, yoyo: true, ease: "sine.inOut" });
        });
}

let teardown: (() => void) | undefined;

function initGarden() {
    teardown?.();
    teardown = undefined;
    const footer = document.getElementById("site-footer");
    const garden = footer?.querySelector<HTMLElement>("[data-garden]");
    const can = garden?.querySelector<SVGSVGElement>("[data-garden-can]");
    if (!footer || !garden || !can) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const water = new Map<number, number>(); // spot -> drops it got
    const grown = new Set<number>();
    let inAir = 0;
    let lastDrop = 0;
    let lastX = 0;
    const hint = footer.querySelector<HTMLElement>("[data-grow-how]");
    const cursor = document.getElementById("custom-cursor");

    const setX = gsap.quickTo(can, "x", { duration: 0.25, ease: "power3.out" });
    const setY = gsap.quickTo(can, "y", { duration: 0.25, ease: "power3.out" });
    const setTilt = gsap.quickTo(can, "rotation", { duration: 0.4, ease: "power2.out" });

    const sprinkle = (x: number, y: number) => {
        if (inAir >= MAX_DROPS) return;
        inAir++;
        const drop = document.createElement("span");
        drop.className = "drop";
        garden.append(drop);
        const ground = garden.offsetHeight - 6;
        const startX = x + random(-6, 6);
        const landX = startX + random(-14, 14);
        gsap.fromTo(
            drop,
            { x: startX, y: y, scale: random(0.7, 1.2) },
            {
                x: landX,
                y: ground,
                duration: Math.sqrt(Math.max(ground - y, 20)) / 26,
                ease: "power2.in",
                onComplete: () => {
                    // a tiny splash, then the soil drinks it
                    gsap.to(drop, { scaleX: 2.2, scaleY: 0.3, opacity: 0, duration: 0.25, onComplete: () => drop.remove() });
                    inAir--;
                    const spot = Math.floor(landX / SPOT);
                    const amount = (water.get(spot) ?? 0) + 1;
                    water.set(spot, amount);
                    if (amount >= DROPS_PER_FLOWER && !grown.has(spot)) {
                        grown.add(spot);
                        grow(garden, spot * SPOT + SPOT / 2 + random(-18, 18));
                        if (hint) gsap.to(hint, { autoAlpha: 0, duration: 0.6 });
                    }
                },
            },
        );
    };

    const onMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const box = garden.getBoundingClientRect();
        const x = event.clientX - box.left;
        const y = event.clientY - box.top;
        if (x < 0 || y < 0 || x > box.width || y > box.height) return;
        setX(x);
        setY(y);
        // tips forward while you move, like pouring
        setTilt(gsap.utils.clamp(-25, 25, (x - lastX) * 1.5) - 18);
        lastX = x;
        const now = performance.now();
        if (now - lastDrop > 45) {
            lastDrop = now;
            sprinkle(x, y);
        }
    };

    const show = (on: boolean) => {
        gsap.to(can, { opacity: on ? 1 : 0, scale: on ? 1 : 0.6, duration: 0.25 });
        if (cursor) gsap.to(cursor, { autoAlpha: on ? 0 : 1, duration: 0.2 });
    };
    const onEnter = (event: PointerEvent) => event.pointerType === "mouse" && show(true);
    const onLeave = (event: PointerEvent) => event.pointerType === "mouse" && show(false);
    // Touch: the can appears where you tap, pours a short shower and goes again
    // (dragging stays scrolling the page).
    const onDown = (event: PointerEvent) => {
        if (event.pointerType === "mouse") return;
        if (event.target instanceof Element && event.target.closest("a, button")) return;
        const box = garden.getBoundingClientRect();
        const x = event.clientX - box.left;
        const y = event.clientY - box.top;
        gsap.set(can, { x, y, rotation: -18 });
        show(true);
        for (let i = 0; i < 10; i++) gsap.delayedCall(i * 0.05, () => sprinkle(x + random(-4, 4), y));
        gsap.delayedCall(0.9, () => show(false));
    };

    footer.addEventListener("pointermove", onMove, { passive: true });
    footer.addEventListener("pointerenter", onEnter);
    footer.addEventListener("pointerleave", onLeave);
    footer.addEventListener("pointerdown", onDown);

    teardown = () => {
        footer.removeEventListener("pointermove", onMove);
        footer.removeEventListener("pointerenter", onEnter);
        footer.removeEventListener("pointerleave", onLeave);
        footer.removeEventListener("pointerdown", onDown);
    };
}

initGarden();
// Project pages use Astro's client router: re-run after every client-side navigation.
document.addEventListener("astro:page-load", initGarden);
