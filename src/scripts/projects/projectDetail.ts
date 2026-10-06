import { gsap, ScrollTrigger } from "../gsap";

let controller: AbortController | undefined;
let media: gsap.MatchMedia | undefined;

// Project detail page (ProjectLayout): keeps the sticky text column fully reachable,
// opens the chapters as you scroll and lets the photos ease in as they scroll into view.
function initProjectDetail() {
    controller?.abort();
    controller = undefined;
    media?.revert();
    media = undefined;

    const info = document.querySelector<HTMLElement>("[data-project-info]");
    const gallery = document.querySelector<HTMLElement>("[data-project-gallery]");
    if (!info || !gallery) return;

    controller = new AbortController();
    const { signal } = controller;

    // Sticky offset: below the header when the column fits on screen. When it is taller
    // than the screen it scrolls along first and sticks once its last line is visible.
    const updateStickyTop = () => {
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const top = Math.min(6 * rem, window.innerHeight - info.offsetHeight - 1.5 * rem);
        info.style.setProperty("--sticky-top", `${top}px`);
    };

    // A chapter opening or closing, or a video loading, can change the page height.
    let lastPageHeight = document.documentElement.scrollHeight;
    const resizeObserver = new ResizeObserver(() => {
        updateStickyTop();
        const pageHeight = document.documentElement.scrollHeight;
        if (pageHeight === lastPageHeight) return;
        lastPageHeight = pageHeight;
        ScrollTrigger.refresh(); // the footer pin (footerReveal.ts) depends on the page height
    });
    resizeObserver.observe(info);
    resizeObserver.observe(gallery); // videos only get their height once loaded
    window.addEventListener("resize", updateStickyTop, { signal });
    updateStickyTop();

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
    gallery.dataset.reveal = "";
    gallery.querySelectorAll(".project-photo").forEach((photo) => revealObserver.observe(photo));

    signal.addEventListener("abort", () => {
        resizeObserver.disconnect();
        revealObserver.disconnect();
    });

    const split = info.closest<HTMLElement>(".project-split");
    const chapters = [...info.querySelectorAll<HTMLDetailsElement>(".project-description details")];
    if (split && chapters.length) initChapters(split, chapters, signal);
}

// Chapters follow the scroll instead of being clicked open. On desktop the split section's
// scroll range is divided into one stretch per chapter: only that chapter is open, and a
// line along its top edge fills up as you read on. Stacked (phones, tablets) all stay open.
function initChapters(split: HTMLElement, chapters: HTMLDetailsElement[], signal: AbortSignal) {
    // The script decides what is open, so drop the one-at-a-time grouping from the Markdown.
    chapters.forEach((chapter) => chapter.removeAttribute("name"));
    // Gives every chapter enough scroll distance, even next to a short photo column (project.css).
    split.style.setProperty("--chapter-count", String(chapters.length));

    // A title never toggles its chapter; on desktop it scrolls to that chapter instead.
    let jumpTo: ((index: number) => void) | undefined;
    chapters.forEach((chapter, i) => {
        chapter.querySelector("summary")?.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                jumpTo?.(i);
            },
            { signal },
        );
    });

    media = gsap.matchMedia();

    media.add("(min-width: 1024px)", () => {
        let active = -1;

        const sync = (progress: number) => {
            const position = progress * chapters.length;
            const index = Math.min(chapters.length - 1, Math.floor(position));
            if (index !== active) {
                active = index;
                chapters.forEach((chapter, i) => {
                    chapter.open = i === index;
                    if (i !== index) chapter.style.removeProperty("--chapter-progress");
                });
            }
            chapters[index].style.setProperty("--chapter-progress", String(position - index));
        };

        const trigger = ScrollTrigger.create({
            trigger: split,
            start: "top 15%",
            end: "bottom bottom",
            invalidateOnRefresh: true,
            onUpdate: (self) => sync(self.progress),
            onRefresh: (self) => sync(self.progress),
        });
        sync(trigger.progress);

        jumpTo = (index) => {
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const top = trigger.start + ((trigger.end - trigger.start) * (index + 0.05)) / chapters.length;
            window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
        };

        return () => {
            jumpTo = undefined;
            chapters.forEach((chapter) => chapter.style.removeProperty("--chapter-progress"));
        };
    });

    media.add("(max-width: 1023px)", () => {
        chapters.forEach((chapter) => (chapter.open = true));
    });

    // The split section just got its minimum height: re-measure every trigger on the page.
    ScrollTrigger.refresh();
}

initProjectDetail();
// Project pages use Astro's client router: re-run after every client-side navigation.
document.addEventListener("astro:page-load", initProjectDetail);
