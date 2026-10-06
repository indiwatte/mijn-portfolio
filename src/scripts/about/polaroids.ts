import { gsap } from "../gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

// About page: polaroids you can pick up and toss around the board. Picking one up
// brings it to the front, lifts it and straightens it a little; letting go drops it
// back to its own tilt, and a throw glides on (inertia) until it hits the board's edge.
function initPolaroids() {
    const board = document.querySelector<HTMLElement>("[data-polaroid-board]");
    if (!board || board.dataset.ready) return;
    board.dataset.ready = "true";

    const polaroids = gsap.utils.toArray<HTMLElement>("[data-polaroid]", board);
    let topLayer = polaroids.length;

    polaroids.forEach((polaroid, i) => {
        const tilt = Number(polaroid.dataset.rotate ?? 0);
        gsap.set(polaroid, { rotation: tilt, zIndex: i + 1 });

        Draggable.create(polaroid, {
            bounds: board,
            inertia: true,
            edgeResistance: 0.8,
            zIndexBoost: false, // own counter, kept inside the board (see isolation in about.astro)
            onPress() {
                polaroid.style.zIndex = String(++topLayer);
                polaroid.classList.add("is-lifted");
                gsap.to(polaroid, { scale: 1.06, rotation: tilt / 3, duration: 0.25, ease: "power2.out" });
            },
            onRelease() {
                polaroid.classList.remove("is-lifted");
                gsap.to(polaroid, { scale: 1, rotation: tilt, duration: 0.6, ease: "back.out(2)" });
            },
        });
    });

    // They drop onto the board one by one the first time it comes into view.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.from(polaroids, {
            y: -60,
            autoAlpha: 0,
            duration: 0.8,
            ease: "back.out(1.6)",
            stagger: 0.12,
            scrollTrigger: { trigger: board, start: "top 80%", once: true },
        });
    }
}

initPolaroids();
