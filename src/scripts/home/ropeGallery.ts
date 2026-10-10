import { gsap } from "../gsap";

// Homepage "Drawings & paintings": the bee's scroll line carries on from the About line,
// down past the case studies, and then zigzags through this section in sagging rows like
// a washing line. Each painting hangs from it on a clothes peg and drops in, swinging,
// the moment the line reaches its peg. Scrolling back up takes them down again.
// This file lays the line out and hangs the paintings; scrollPath.ts draws it on scroll
// and flies the bee along it.

// Small fixed "random" numbers, so the line looks hand-hung but the same on every visit.
const wobble = (i: number) => {
    const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1; // -1..1
};

// How many paintings hang on each row, by available width (repeats until all are hung).
const rowPattern = (width: number) => (width < 640 ? [1] : width < 1024 ? [2] : [3, 2]);

type Hang = { el: HTMLElement; drop: HTMLElement; side: number; at: number; shown: boolean };

export function createRopeGallery() {
    const root = document.querySelector<HTMLElement>("[data-rope-gallery]");
    if (!root) return null;

    const line = root.querySelector<SVGPathElement>("[data-line]")!;
    const cover = root.querySelector<SVGPathElement>("[data-cover]")!;
    const hangs: Hang[] = gsap.utils.toArray<HTMLElement>("[data-hang]", root).map((el, i) => ({
        el,
        drop: el.querySelector<HTMLElement>("[data-hang-drop]")!,
        side: i % 2 ? 1 : -1, // which way it swings in
        at: 0, // where along the line its peg is (px)
        shown: false,
    }));

    root.classList.add("is-strung");

    const rope = {
        root,
        line,
        cover,
        length: 0,
        progress: 0, // 0..1, driven by scrollPath.ts

        // Lay out the rows and the line. `start` is where the line comes in from, in page
        // coordinates (the end of the About line); without it, it starts above the rows.
        build(start?: { x: number; y: number }) {
            const width = root.offsetWidth;
            const pattern = rowPattern(width);
            const perRow = pattern.length === 1 ? pattern[0] : 3;
            const cardWidth = Math.min(width * (perRow === 1 ? 0.64 : perRow === 2 ? 0.32 : 0.23), 290);
            const inset = Math.max(24, width * 0.05); // row ends; the loops swing out past them
            const left = inset;
            const right = width - inset;
            const sag = gsap.utils.clamp(26, 70, width * 0.065);
            const gap = width < 640 ? 56 : 84;
            // How far the loops between rows (and the lead-in) swing out past the row ends
            const swing = Math.max(40, inset * 1.8);
            // Steepness of a row where it starts and ends, so the loops can carry it on
            // smoothly (no corners where they meet).
            const edgeSlope = (rowSag: number) => (4 * rowSag) / (right - left);

            // Size the cards first, so each row can be as tall as its tallest painting.
            hangs.forEach((hang) => (hang.el.style.width = `${cardWidth}px`));

            const rows: Hang[][] = [];
            for (let i = 0, r = 0; i < hangs.length; r++) {
                const count = pattern[r % pattern.length];
                rows.push(hangs.slice(i, i + count));
                i += count;
            }

            // Lead-in: from the end of the About line, out to the right margin and down
            // it (behind the case studies) to where the first row starts, on the right.
            let y = 34;
            const box = root.getBoundingClientRect();
            const from = start
                ? { x: start.x - box.left - window.scrollX, y: start.y - box.top - window.scrollY }
                : { x: right, y: -120 };
            const margin = width + Math.min(28, (window.innerWidth - width) / 4); // in the page's side padding
            const firstSlope = edgeSlope(sag * (1 + wobble(0) * 0.2));
            let d =
                `M ${from.x} ${from.y}` +
                ` C ${margin} ${from.y}, ${margin} ${from.y + 80}, ${margin} ${Math.min(from.y + 160, y - 160)}` +
                ` L ${margin} ${y - 160}` +
                // …and curving in, already heading the way the first row starts.
                ` C ${margin} ${y - 40}, ${right + swing} ${y - swing * firstSlope}, ${right} ${y}`;

            rows.forEach((row, r) => {
                const leftward = r % 2 === 0; // the first row runs right to left
                const to = leftward ? left : right;
                const rowSag = sag * (1 + wobble(r) * 0.2);
                // A parabola (as a cubic): x moves evenly, so the height at any x is easy
                // to work out, and its end directions are easy to continue.
                const fromX = leftward ? right : left;
                const third = (to - fromX) / 3;
                const dip = y + (rowSag * 4) / 3;
                d += ` C ${fromX + third} ${dip}, ${to - third} ${dip}, ${to} ${y}`;

                let tallest = 0;
                row.forEach((hang, k) => {
                    const t = gsap.utils.clamp(0.08, 0.92, (k + 0.5) / row.length + wobble(r * 7 + k) * 0.05);
                    const x = left + (right - left) * t;
                    const ropeY = y + 4 * rowSag * t * (1 - t);
                    const slope = (4 * rowSag * (1 - 2 * t)) / (right - left);
                    const tilt = ((Math.atan(slope) * 180) / Math.PI) * 0.4 + wobble(r * 7 + k + 3) * 2.5;

                    hang.el.style.left = `${x - cardWidth / 2}px`;
                    hang.el.style.top = `${ropeY - 6}px`;
                    hang.el.style.setProperty("--tilt", `${tilt.toFixed(2)}deg`);
                    tallest = Math.max(tallest, hang.el.offsetHeight);
                });

                const nextY = y + rowSag + tallest + gap;
                if (r < rows.length - 1) {
                    // Loop down at the side to where the next row starts: leaves the way
                    // this row ends (out and up a little) and arrives the way the next
                    // one starts (in and down), so it's one smooth curve.
                    const out = leftward ? to - swing : to + swing;
                    const nextSlope = edgeSlope(sag * (1 + wobble(r + 1) * 0.2));
                    d +=
                        ` C ${out} ${y - swing * edgeSlope(rowSag)},` +
                        ` ${out} ${nextY - swing * nextSlope}, ${to} ${nextY}`;
                }
                y = nextY;
            });

            root.style.height = `${y - gap + 24}px`;
            line.setAttribute("d", d);
            cover.setAttribute("d", d);
            rope.length = line.getTotalLength();
            // One dash as long as the path: offset 0 covers everything, -length nothing.
            cover.style.strokeDasharray = `${rope.length} ${rope.length}`;

            // Where along the line each peg sits (closest sampled point).
            const samples: [number, number, number][] = [];
            for (let at = 0; at <= rope.length; at += 6) {
                const p = line.getPointAtLength(at);
                samples.push([at, p.x, p.y]);
            }
            hangs.forEach((hang) => {
                const px = hang.el.offsetLeft + cardWidth / 2;
                const py = hang.el.offsetTop + 6;
                let best = Infinity;
                for (const [at, x, sy] of samples) {
                    const dist = (x - px) ** 2 + (sy - py) ** 2;
                    if (dist < best) [best, hang.at] = [dist, at];
                }
            });
        },

        // Hang (or take down) the paintings the line has reached.
        update(animate = true) {
            const reach = rope.progress * rope.length;
            hangs.forEach((hang) => {
                const show = reach >= hang.at;
                if (show === hang.shown) return;
                hang.shown = show;
                if (!animate) {
                    gsap.set(hang.drop, { autoAlpha: show ? 1 : 0, y: 0, rotation: 0 });
                } else if (show) {
                    gsap.timeline()
                        .fromTo(hang.drop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0)
                        .fromTo(
                            hang.drop,
                            { y: -40, rotation: hang.side * 32 },
                            { y: 0, rotation: 0, duration: 1.9, ease: "elastic.out(1, 0.32)", overwrite: "auto" },
                            0,
                        );
                } else {
                    gsap.to(hang.drop, {
                        autoAlpha: 0,
                        y: -30,
                        rotation: hang.side * 12,
                        duration: 0.35,
                        ease: "power2.in",
                        overwrite: "auto",
                    });
                }
            });
        },

        // Hidden until the line reaches them; returns the clean-up.
        startHidden() {
            hangs.forEach((hang) => (hang.shown = false));
            gsap.set(hangs.map((hang) => hang.drop), { autoAlpha: 0 });

            // Give a painting a nudge on hover: it swings and settles again.
            const nudges = hangs.map((hang) => {
                const nudge = (event: PointerEvent) => {
                    if (!hang.shown || event.pointerType !== "mouse") return;
                    const box = hang.el.getBoundingClientRect();
                    const fromLeft = event.clientX < box.left + box.width / 2;
                    gsap.fromTo(
                        hang.drop,
                        { rotation: fromLeft ? -9 : 9 },
                        { rotation: 0, duration: 1.6, ease: "elastic.out(1, 0.28)", overwrite: "auto" },
                    );
                };
                hang.el.addEventListener("pointerenter", nudge);
                return () => hang.el.removeEventListener("pointerenter", nudge);
            });
            return () => nudges.forEach((off) => off());
        },
    };
    return rope;
}

export type RopeGallery = NonNullable<ReturnType<typeof createRopeGallery>>;
