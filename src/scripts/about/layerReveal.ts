import { ScrollTrigger } from "../gsap";

let trigger: ScrollTrigger | undefined;

// About page: the intro ([data-layer-under]) stays put once its bottom reaches the bottom
// of the screen, and the peach experience layer ([data-layer-over]) slides up over it,
// the same way the footer slides over the page at the end (footerReveal.ts).
function initLayerReveal() {
    trigger?.kill();
    trigger = undefined;

    const under = document.querySelector<HTMLElement>("[data-layer-under]");
    const over = document.querySelector<HTMLElement>("[data-layer-over]");
    if (!under || !over) return;

    trigger = ScrollTrigger.create({
        trigger: under,
        start: "bottom bottom",
        endTrigger: over,
        end: "top top", // fully covered
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
    });
}

initLayerReveal();
