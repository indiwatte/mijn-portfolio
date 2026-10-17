import { ScrollTrigger } from "../gsap";

let controller: AbortController | undefined;
let triggers: ScrollTrigger[] = [];

// Project detail page (ProjectLayout). Every chapter is a row: its text on the left stays
// in view while that chapter's own photos scroll by, then moves on with them. Nothing opens
// or closes, so the text never jumps. This script only adds the details: the chapter you're
// reading lights up (with a line that fills as you go), group titles fill with colour once
// you reach them, and photos ease in as they come into view.
function initProjectDetail() {
    controller?.abort();
    triggers.forEach((trigger) => trigger.kill());
    triggers = [];

    const chapters = document.querySelector<HTMLElement>("[data-project-chapters]");
    if (!chapters) return;

    controller = new AbortController();
    const { signal } = controller;
    const rows = [...chapters.querySelectorAll<HTMLElement>("[data-chapter-row]")];

    // A text taller than the screen scrolls along first and sticks once its last line is
    // visible, so you can always read all of it. (Heights only change on resize or when
    // fonts load: nothing on the page opens or closes any more.)
    const updateStickyTops = () => {
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
        rows.forEach((row) => {
            const text = row.querySelector<HTMLElement>("[data-chapter-text]");
            if (!text) return;
            const top = Math.min(6 * rem, window.innerHeight - text.offsetHeight - 1.5 * rem);
            text.style.setProperty("--sticky-top", `${top}px`);
        });
    };
    updateStickyTops();
    window.addEventListener("resize", updateStickyTops, { signal });

    // Videos only get their height once loaded: re-measure the footer pin (footerReveal.ts).
    let lastPageHeight = document.documentElement.scrollHeight;
    const resizeObserver = new ResizeObserver(() => {
        updateStickyTops();
        const pageHeight = document.documentElement.scrollHeight;
        if (pageHeight === lastPageHeight) return;
        lastPageHeight = pageHeight;
        ScrollTrigger.refresh();
    });
    resizeObserver.observe(chapters);

    // Photos fade up once as they enter the screen (styles in project.css).
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            });
        },
        { rootMargin: "0px 0px -8% 0px" },
    );
    chapters.querySelectorAll<HTMLElement>("[data-project-gallery]").forEach((gallery) => {
        gallery.dataset.reveal = "";
        gallery.querySelectorAll(".project-photo").forEach((photo) => revealObserver.observe(photo));
    });

    // The chapter you're reading: the one whose row crosses the middle of the screen.
    rows.forEach((row) => {
        const chapter = row.querySelector<HTMLElement>(".chapter");
        triggers.push(
            ScrollTrigger.create({
                trigger: row,
                start: "top 55%",
                end: "bottom 55%",
                toggleClass: { targets: row, className: "is-active" },
                onUpdate: (self) => chapter?.style.setProperty("--chapter-progress", self.progress.toFixed(3)),
                onLeave: () => chapter?.style.setProperty("--chapter-progress", "1"),
                onLeaveBack: () => chapter?.style.setProperty("--chapter-progress", "0"),
            }),
        );
    });

    // Group titles (<h3 class="chapter-group">) fill with colour once they pass the middle
    // of the screen, and empty again when you scroll back up above them.
    chapters.querySelectorAll<HTMLElement>(".chapter-group").forEach((group) => {
        triggers.push(
            ScrollTrigger.create({
                trigger: group,
                start: "top 55%",
                onEnter: () => group.classList.add("is-reached"),
                onLeaveBack: () => group.classList.remove("is-reached"),
            }),
        );
    });

    signal.addEventListener("abort", () => {
        resizeObserver.disconnect();
        revealObserver.disconnect();
    });
}

initProjectDetail();
// Project pages use Astro's client router: re-run after every client-side navigation.
document.addEventListener("astro:page-load", initProjectDetail);
