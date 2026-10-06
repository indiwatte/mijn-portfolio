import { ScrollTrigger } from "./gsap";

let trigger: ScrollTrigger | undefined;

// The element marked [data-footer-overlap] stays pinned once its bottom reaches the
// bottom of the viewport, so the footer slides up over it (like zainabkabira.com).
function initFooterReveal() {
    trigger?.kill();
    trigger = undefined;

    const footer = document.getElementById("site-footer");
    const target = document.querySelector<HTMLElement>("[data-footer-overlap]");
    if (!footer || !target) return;

    trigger = ScrollTrigger.create({
        trigger: target,
        start: "bottom bottom",
        end: () => `+=${footer.offsetHeight}`,
        pin: true,
        pinSpacing: false,
        // Refresh after the other pins (e.g. the homepage hero) so its start is measured correctly.
        refreshPriority: -1,
        invalidateOnRefresh: true,
    });
}

initFooterReveal();
// Project pages use Astro's client router: re-run after every client-side navigation.
document.addEventListener("astro:page-load", initFooterReveal);
