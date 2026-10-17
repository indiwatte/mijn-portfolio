import { gsap } from "./gsap";

// Highlighted words (<mark class="marker" data-marker>): the rough marker stroke is drawn from
// left to right as you scroll, tied to the scroll (scrolling back up erases it again).
// With reduced motion the stroke is just there.
export function initMarkers() {
    const marks = gsap.utils.toArray<HTMLElement>("[data-marker]");
    if (!marks.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        marks.forEach((mark) => mark.classList.add("is-marked"));
        return;
    }

    // hides the strokes until they are drawn (the CSS keeps them visible without JS)
    document.documentElement.classList.add("js-markers");

    marks.forEach((mark) => {
        gsap.fromTo(
            mark,
            { backgroundSize: "0% 78%" },
            {
                backgroundSize: "100% 78%",
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: mark,
                    start: "top 85%",
                    end: "top 55%",
                    scrub: 0.6,
                    // ink on the yellow once the stroke covers most of the word
                    onUpdate: (self) => mark.classList.toggle("is-marked", self.progress > 0.4),
                },
            },
        );
    });
}
