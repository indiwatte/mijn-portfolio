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
    if (split && chapters.length) initChapters(split, gallery, chapters, signal);
}

// Chapters follow the scroll instead of being clicked open. On desktop only one chapter is
// open, and a line along its top edge fills up as you read on. When the photos are marked
// with a chapter (frontmatter `chapter:`), a chapter is open while its photos pass the
// middle of the screen; otherwise the split section's scroll range is divided evenly.
// Stacked (phones, tablets) all stay open.
function initChapters(
    split: HTMLElement,
    gallery: HTMLElement,
    chapters: HTMLDetailsElement[],
    signal: AbortSignal,
) {
    // The script decides what is open, so drop the one-at-a-time grouping from the Markdown.
    chapters.forEach((chapter) => chapter.removeAttribute("name"));
    // Gives every chapter enough scroll distance, even next to a short photo column (project.css).
    split.style.setProperty("--chapter-count", String(chapters.length));

    // Group titles above chapters (<h3 class="chapter-group">) fill with colour once you
    // reach their part: each remembers the first chapter that follows it.
    const groups = [...(chapters[0]?.parentElement?.querySelectorAll<HTMLElement>(".chapter-group") ?? [])].map(
        (el) => {
            let next = el.nextElementSibling;
            while (next && !(next instanceof HTMLDetailsElement)) next = next.nextElementSibling;
            return { el, first: next ? chapters.indexOf(next as HTMLDetailsElement) : chapters.length };
        },
    );

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

        // Page position where each chapter's photos start (null: no photos are marked).
        let starts: number[] | null = null;
        // Position on the page without transforms (photos slide up 2.5rem as they appear).
        const pageTop = (el: HTMLElement) => {
            let top = 0;
            for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
                top += node.offsetTop;
            }
            return top;
        };
        const measure = () => {
            const marked = [...gallery.querySelectorAll<HTMLElement>("[data-chapter]")];
            if (!marked.length) return (starts = null);
            const top = pageTop(gallery);
            const bottom = top + gallery.offsetHeight;
            starts = chapters.map(() => Infinity);
            marked.forEach((photo) => {
                const i = Number(photo.dataset.chapter) - 1;
                if (!starts || !(i >= 0 && i < chapters.length)) return;
                starts[i] = Math.min(starts[i], pageTop(photo));
            });
            // Chapters without photos share the stretch of the chapter before them (its
            // photos first, then their turn), so every chapter still gets opened.
            const has = starts.map((start) => start !== Infinity);
            const first = has.indexOf(true);
            if (first === -1) return (starts = null); // no photo names an existing chapter
            for (let i = first; i < chapters.length; ) {
                let next = i + 1;
                while (next < chapters.length && !has[next]) next++;
                const end = next < chapters.length ? starts[next] : bottom;
                const parts = next - i;
                for (let k = 1; k < parts; k++) starts[i + k] = starts[i] + ((end - starts[i]) * k) / parts;
                i = next;
            }
            // Chapters before the first photo share that photo's chapter's stretch too, in
            // front of it.
            if (first > 0) {
                const start = starts[first];
                const end = starts[first + 1] ?? bottom;
                for (let k = 0; k <= first; k++) starts[k] = start + ((end - start) * k) / (first + 1);
            }
            starts.push(bottom); // where the last chapter ends
        };
        // The reading line, near the top of the screen: a chapter stays open until the
        // next chapter's photos have scrolled almost all the way up, so you can look at
        // all of its own photos first.
        const line = () => window.innerHeight * 0.1;
        // Switching is calm on purpose: you have to scroll this far past a boundary, the
        // new chapter has to stay the right one for a moment, and a chapter that just
        // opened stays open a minimum time. So the text never flips while you look around.
        const MARGIN = 150; // px
        const SETTLE = 350; // ms
        const MIN_OPEN = 1500; // ms

        // The chapter at page position y (0..chapters.length - 1).
        const indexAt = (y: number) => {
            let index = 0;
            for (let i = 0; i < chapters.length; i++) if (starts![i] <= y) index = i;
            return index;
        };

        // Where we are, as "chapter index + how far into it" (0..chapters.length).
        const positionFor = (progress: number) => {
            if (!starts) return progress * chapters.length;
            if (progress >= 1) return chapters.length - 0.001; // the last one always gets its turn
            const y = window.scrollY + line();
            let index = indexAt(y);
            // Only leave the open chapter once you're well past its edge.
            if (active >= 0 && index > active) index = Math.max(active, indexAt(y - MARGIN));
            if (active >= 0 && index < active) index = Math.min(active, indexAt(y + MARGIN));
            const length = starts[index + 1] - starts[index];
            return index + (length > 0 ? gsap.utils.clamp(0, 0.999, (y - starts[index]) / length) : 0);
        };

        let openedAt = 0;
        let pending: ReturnType<typeof setTimeout> | undefined;
        const open = (index: number) => {
            active = index;
            openedAt = performance.now();
            chapters.forEach((chapter, i) => {
                chapter.open = i === index;
                if (i !== index) chapter.style.removeProperty("--chapter-progress");
            });
            groups.forEach(({ el, first }) => el.classList.toggle("is-reached", index >= first));
        };

        const sync = (progress: number) => {
            const position = positionFor(progress);
            const index = Math.min(chapters.length - 1, Math.floor(position));
            if (active === -1) open(index);
            else if (index !== active) {
                // Switch later, if this is still where we are by then.
                if (!pending) {
                    const wait = Math.max(SETTLE, MIN_OPEN - (performance.now() - openedAt));
                    pending = setTimeout(() => {
                        pending = undefined;
                        const now = Math.min(chapters.length - 1, Math.floor(positionFor(trigger.progress)));
                        if (now !== active) open(now);
                        sync(trigger.progress);
                    }, wait);
                }
            } else if (pending) {
                clearTimeout(pending);
                pending = undefined;
            }
            // The line on top of the open chapter fills as you read on.
            const fill = index === active ? position - index : index > active ? 1 : 0;
            chapters[active].style.setProperty("--chapter-progress", String(fill));
        };

        const trigger = ScrollTrigger.create({
            trigger: split,
            start: "top 15%",
            end: "bottom bottom",
            invalidateOnRefresh: true,
            onUpdate: (self) => sync(self.progress),
            onRefresh: (self) => {
                measure();
                sync(self.progress);
            },
        });
        measure();
        sync(trigger.progress);

        // Following the photos, a chapter can start before the trigger does (whose progress
        // stays 0 up there), so also follow every scroll, once per frame.
        let queued = false;
        const onScroll = () => {
            if (!starts || queued) return;
            queued = true;
            requestAnimationFrame(() => {
                queued = false;
                sync(trigger.progress);
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });

        jumpTo = (index) => {
            measure(); // photos may have loaded or moved since the last measurement
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const top = starts
                ? starts[index] - line() + 20
                : trigger.start + ((trigger.end - trigger.start) * (index + 0.05)) / chapters.length;
            // Open it straight away; passing the chapters in between won't flip it back.
            if (starts) open(index);
            window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
        };

        return () => {
            clearTimeout(pending);
            window.removeEventListener("scroll", onScroll);
            jumpTo = undefined;
            chapters.forEach((chapter) => chapter.style.removeProperty("--chapter-progress"));
            groups.forEach(({ el }) => el.classList.remove("is-reached"));
        };
    });

    media.add("(max-width: 1023px)", () => {
        chapters.forEach((chapter) => (chapter.open = true));
        // Stacked, a group title fills once it scrolls up past the middle of the screen
        // (checked on scroll, so a fast flick past it still counts).
        if (!groups.length) return;
        let queued = false;
        const update = () => {
            queued = false;
            groups.forEach(({ el }) =>
                el.classList.toggle("is-reached", el.getBoundingClientRect().top < window.innerHeight / 2),
            );
        };
        const queue = () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(update);
        };
        window.addEventListener("scroll", queue, { passive: true });
        update();
        return () => {
            window.removeEventListener("scroll", queue);
            groups.forEach(({ el }) => el.classList.remove("is-reached"));
        };
    });

    // The split section just got its minimum height: re-measure every trigger on the page.
    ScrollTrigger.refresh();
}

initProjectDetail();
// Project pages use Astro's client router: re-run after every client-side navigation.
document.addEventListener("astro:page-load", initProjectDetail);
