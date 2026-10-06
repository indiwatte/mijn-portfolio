import { gsap } from "./gsap";

// Rose-star cursor that trails the pointer; only shown on devices with a real mouse.
// The spin is a CSS animation (see Cursor.astro) so it runs on the compositor, not the main thread.
export function initCursor() {
    const cursor = document.getElementById("custom-cursor");
    if (!cursor) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const setX = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3.out" });
    const setY = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3.out" });

    window.addEventListener(
        "pointermove",
        (event) => {
            setX(event.clientX);
            setY(event.clientY);
        },
        { passive: true },
    );
}
