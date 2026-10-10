import { gsap, ScrollTrigger } from "../gsap";
import { createRopeGallery } from "./ropeGallery";

type Point = [number, number];
type Variant = "wander" | "landing";

// Tiny seeded random generator: the "hand-drawn" wobble looks the same on every visit.
function seeded(seed: number) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// "wander": swings between the left and right side roughly every 450px, ending in
// the bottom centre, or at `end` (arriving horizontally, so the bird faces right).
// "landing": a short curve from the top centre that swoops in from the right to
// `end` (or to a spot on the right), where the bird comes to rest.
// Extra jittered points make both look hand-drawn.
function points(variant: Variant, width: number, height: number, end?: Point): Point[] {
    const random = seeded(variant === "wander" ? 7 : 11);
    const jitter = (amount: number) => (random() - 0.5) * 2 * amount;

    if (variant === "landing") {
        const wobble = Math.min(width * 0.03, 24);
        const [endX, endY] = end ?? [width * 0.82, height * 0.32];
        const swoopX = Math.min(endX + 120, width - 20); // come in from the right…
        return [
            [width * 0.5, 30],
            [(width * 0.5 + swoopX) / 2 + jitter(wobble), endY * 0.45 + jitter(wobble)],
            [swoopX + jitter(wobble / 2), endY - 14],
            [endX, endY], // …and settle right after the word
        ];
    }

    const top = 40;
    const bottom = end ? end[1] : height - 20;
    const turns = Math.max(2, Math.round((bottom - top) / 450));
    const swing = [0.14, 0.84, 0.22, 0.9, 0.1, 0.78];
    const wobble = Math.min(width * 0.05, 45);

    const result: Point[] = [[width / 2, top]];
    for (let i = 1; i <= turns; i++) {
        const [px, py] = result[result.length - 1];
        const last = i === turns;
        const x = last ? (end ? end[0] : width / 2) : width * swing[(i - 1) % swing.length];
        const y = top + ((bottom - top) * i) / turns;

        // Two in-between points along each swing, pushed off course a little.
        for (const t of [0.35, 0.68]) {
            const ease = t * t * (3 - 2 * t); // stay near the sides, cross quickly
            result.push([
                px + (x - px) * ease + jitter(wobble),
                py + (y - py) * t + jitter(wobble / 2),
            ]);
        }
        // Glide in level from the left for the last stretch before a custom end point.
        if (last && end) result.push([x - 70, y]);
        result.push([x, y]);
    }
    return result;
}

// Catmull-Rom spline through all points, written as cubic Béziers: one smooth line.
function smoothPath(pts: Point[]) {
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i - 1] ?? pts[i];
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[i + 1];
        const [x3, y3] = pts[i + 2] ?? pts[i + 1];
        d +=
            ` C ${x1 + (x2 - x0) / 6} ${y1 + (y2 - y0) / 6},` +
            ` ${x2 - (x3 - x1) / 6} ${y2 - (y3 - y1) / 6}, ${x2} ${y2}`;
    }
    return d;
}

// One piece of the line: builds its curve in the wrapper's pixel size.
function createPiece(root: HTMLElement) {
    const variant = (root.dataset.variant ?? "wander") as Variant;
    const endTarget = root.dataset.endAt ? document.querySelector(root.dataset.endAt) : null;
    const svg = root.querySelector("svg")!;
    const line = root.querySelector<SVGPathElement>("[data-line]")!;
    const cover = root.querySelector<SVGPathElement>("[data-cover]")!;

    const piece = {
        root,
        endTarget,
        line,
        cover,
        length: 0,
        progress: 0, // 0..1, driven by this piece's ScrollTrigger
        build() {
            const width = root.offsetWidth;
            const height = root.offsetHeight;
            svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

            // End point just right of the target element, in this piece's coordinates.
            let end: Point | undefined;
            if (endTarget) {
                const box = root.getBoundingClientRect();
                // Last line box: if the word wraps, stop after where it really ends.
                const rects = endTarget.getClientRects();
                const target = rects[rects.length - 1] ?? endTarget.getBoundingClientRect();
                end = [
                    // Half the bird's width: its tail just touches the end of the word.
                    Math.min(target.right - box.left + 40, width - 40),
                    target.top - box.top + target.height / 2,
                ];
            }

            const d = smoothPath(points(variant, width, height, end));
            line.setAttribute("d", d);
            cover.setAttribute("d", d);
            piece.length = line.getTotalLength();
            // One dash as long as the path: offset 0 covers everything, -length nothing.
            cover.style.strokeDasharray = `${piece.length} ${piece.length}`;
        },
    };
    return piece;
}

type Piece = ReturnType<typeof createPiece>;
// Anything the bird can fly along: the line pieces here and the paintings' washing line.
type Track = Pick<Piece, "root" | "line" | "cover" | "length" | "progress">;

// The line is drawn by pulling back a cover stroke (stroke-dashoffset). The bird (a bee)
// starts in the hero, right after the intro line ([data-bee-start]), and flies down to
// the start of the About line while the story section slides over the hero. After that
// it is placed from the pieces' progress: on the footer piece once that has started,
// else on the paintings' washing line once that has started, otherwise on the About
// piece. So it flies on from About, past the case studies and along the washing line,
// waits at its end, and flies again when the footer slides in.
export function initScrollPath() {
    const aboutRoot = document.querySelector<HTMLElement>('[data-scroll-path="about"]');
    const footerRoot = document.querySelector<HTMLElement>('[data-scroll-path="footer"]');
    const bird = document.querySelector<HTMLElement>("[data-scroll-bird]");
    if (!aboutRoot || !footerRoot || !bird) return;

    const about = createPiece(aboutRoot);
    const footer = createPiece(footerRoot);
    const pieces = [about, footer];
    // Between them: the washing line through "Drawings & paintings" (ropeGallery.ts),
    // starting where the About line ends.
    const rope = createRopeGallery();
    const flip = bird.querySelector<HTMLElement>("[data-bird-flip]")!;
    const start = document.querySelector<HTMLElement>("[data-bee-start]");
    const intro = { progress: 0 }; // 0..1: from the hero to the start of the About line

    // The end of a piece, in page coordinates.
    const endOf = (piece: Piece) => {
        const point = piece.line.getPointAtLength(piece.length);
        const box = piece.root.getBoundingClientRect();
        return { x: box.left + window.scrollX + point.x, y: box.top + window.scrollY + point.y };
    };
    const buildAll = () => {
        pieces.forEach((piece) => piece.build());
        rope?.build(endOf(about));
    };
    buildAll();
    // Rebuild the curves for the new size before ScrollTrigger re-measures.
    ScrollTrigger.addEventListener("refreshInit", buildAll);

    const mm = gsap.matchMedia();

    // Reduced motion: just show the finished lines (the bird is hidden in CSS).
    mm.add("(prefers-reduced-motion: reduce)", () => {
        pieces.forEach((piece) => gsap.set(piece.cover, { strokeDashoffset: -piece.length }));
        if (rope) {
            gsap.set(rope.cover, { strokeDashoffset: () => -rope.length });
            rope.progress = 1;
            rope.update(false);
        }
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(bird, { xPercent: -50, yPercent: -50 });
        const setX = gsap.quickSetter(bird, "x", "px");
        const setY = gsap.quickSetter(bird, "y", "px");
        const setRotation = gsap.quickSetter(bird, "rotation", "deg");

        // Rotation alone would fly the bird belly-up whenever the path heads left, so it
        // rolls over (scaleY) when the heading passes vertical. The 10° dead zone around
        // vertical (where the curve turns) keeps it from fluttering.
        let upsideDown = false;
        const keepBackUp = (heading: number) => {
            const tilt = Math.abs(heading);
            const shouldFlip = upsideDown ? tilt > 80 : tilt > 100;
            if (shouldFlip === upsideDown) return;
            upsideDown = shouldFlip;
            gsap.to(flip, { scaleY: upsideDown ? -1 : 1, duration: 0.35, ease: "power2.out" });
        };

        // In the hero: right of the intro line, facing right. While flying down, an arc
        // that swings out a little, turning towards where it is heading.
        const toPage = (piece: Track, at: number) => {
            const point = piece.line.getPointAtLength(at);
            const box = piece.root.getBoundingClientRect();
            return [box.left + window.scrollX + point.x, box.top + window.scrollY + point.y];
        };
        const heroSpot = () => {
            const box = start!.getBoundingClientRect();
            const gap = window.innerWidth < 768 ? 60 : 90;
            return [box.right + window.scrollX + gap, box.top + window.scrollY + box.height / 2];
        };
        const introAt = (t: number) => {
            const [x0, y0] = heroSpot();
            const [x1, y1] = toPage(about, 0);
            const ease = t * t * (3 - 2 * t);
            return [x0 + (x1 - x0) * ease + Math.sin(t * Math.PI) * 120, y0 + (y1 - y0) * ease];
        };

        const placeBird = () => {
            if (start && about.progress === 0 && footer.progress === 0 && intro.progress < 1) {
                const t = intro.progress;
                const [x, y] = introAt(t);
                const [nx, ny] = introAt(Math.min(1, t + 0.02));
                setX(x);
                setY(y);
                const heading = t === 0 ? 0 : (Math.atan2(ny - y, nx - x) * 180) / Math.PI;
                const blended = heading * Math.min(1, t * 5); // still facing right in the hero
                setRotation(blended);
                keepBackUp(blended);
                return;
            }
            const piece: Track = footer.progress > 0 ? footer : rope && rope.progress > 0 ? rope : about;
            const at = piece.progress * piece.length;
            const point = piece.line.getPointAtLength(at);
            const before = piece.line.getPointAtLength(Math.max(0, at - 2));
            const after = piece.line.getPointAtLength(Math.min(piece.length, at + 2));

            // Path coordinates are relative to the piece; the bird lives in page coordinates.
            const box = piece.root.getBoundingClientRect();
            setX(box.left + window.scrollX + point.x);
            setY(box.top + window.scrollY + point.y);

            // Body midline along the curve, head first.
            const heading = (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI;
            setRotation(heading);
            keepBackUp(heading);
        };

        const drawPiece = (piece: Track, scrollTrigger: ScrollTrigger.Vars, onUpdate?: () => void) =>
            gsap
                .timeline({
                    defaults: { ease: "none" },
                    scrollTrigger: { scrub: 0.6, invalidateOnRefresh: true, ...scrollTrigger },
                })
                .fromTo(piece.cover, { strokeDashoffset: 0 }, { strokeDashoffset: () => -piece.length }, 0)
                .fromTo(
                    piece,
                    { progress: 0 },
                    {
                        progress: 1,
                        onUpdate: () => {
                            onUpdate?.();
                            placeBird();
                        },
                    },
                    0,
                );

        // Intro: from the top of the page until the About line starts drawing.
        gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
                start: 0,
                endTrigger: about.root,
                end: "top 60%",
                scrub: 0.6,
                invalidateOnRefresh: true,
            },
        }).fromTo(intro, { progress: 0 }, { progress: 1, onUpdate: placeBird });

        // About: drawn while the section passes, the tip staying around 60% down the
        // screen, until the bird reaches the "Featured work" heading.
        drawPiece(about, {
            trigger: about.root,
            start: "top 60%",
            endTrigger: about.endTarget ?? about.root,
            end: about.endTarget ? "center 60%" : "bottom 60%",
        });

        // Paintings: picks up where About stopped, down past the case studies and through
        // the paintings, hanging each one as the line reaches its peg.
        const unhang = rope?.startHidden();
        if (rope) {
            drawPiece(
                rope,
                {
                    trigger: about.endTarget ?? about.root,
                    start: about.endTarget ? "center 60%" : "bottom 60%",
                    endTrigger: rope.root,
                    end: "bottom 75%",
                },
                () => rope.update(),
            );
        }

        // Footer: drawn while the footer slides up over Featured work, until the page ends.
        drawPiece(footer, {
            trigger: footer.root,
            start: "top bottom",
            end: "bottom bottom",
            refreshPriority: -2, // after the Featured work pin (footerReveal.ts)
        });

        placeBird();
        // Pins add/remove space on refresh: put the bird back on its line afterwards.
        ScrollTrigger.addEventListener("refresh", placeBird);
        return () => {
            ScrollTrigger.removeEventListener("refresh", placeBird);
            unhang?.();
        };
    });
}
