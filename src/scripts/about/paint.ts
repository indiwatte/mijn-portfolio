import { gsap } from "../gsap";
import "../creatures"; // the googly eyes of the painted figures follow the mouse too

// About page: paint on the background of the intro, and every stroke comes alive.
// While you paint, the stroke is drawn "wet" on a canvas behind the text and photos.
// When you let go it turns into a clean figure in the same colour: a closed shape becomes
// a round creature, an open line becomes a glossy worm with its eyes where you stopped.
// The figures float gently and look at the mouse, like the creatures in the header.
// With a mouse you can always paint; on touch screens the "Paint" toggle switches it on.

type Point = { x: number; y: number; width: number };
type XY = [number, number];

const SVG = "http://www.w3.org/2000/svg";
const MAX_FIGURES = 14;
const BRISTLES = [
    // offset across the stroke (share of its width), opacity
    [0, 0.9],
    [-0.32, 0.45],
    [0.3, 0.5],
    [-0.12, 0.6],
    [0.16, 0.55],
] as const;

let figureCount = 0;

// ---------- colour helpers ----------
const mix = (hex: string, target: number, amount: number) => {
    const n = parseInt(hex.slice(1), 16);
    const channel = (shift: number) => Math.round(((n >> shift) & 255) * (1 - amount) + target * amount);
    return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
};
const lighter = (hex: string, amount = 0.55) => mix(hex, 255, amount);
const darker = (hex: string, amount = 0.3) => mix(hex, 0, amount);

// ---------- geometry helpers ----------
const round = (n: number) => Math.round(n * 10) / 10;

// Catmull-Rom spline through the points, as cubic Béziers.
function smoothPath(points: XY[], closed: boolean) {
    const at = (i: number) =>
        closed ? points[(i + points.length) % points.length] : points[Math.max(0, Math.min(points.length - 1, i))];
    let d = `M${round(points[0][0])} ${round(points[0][1])}`;
    const last = closed ? points.length : points.length - 1;
    for (let i = 0; i < last; i++) {
        const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
        d += ` C${round(p1[0] + (p2[0] - p0[0]) / 6)} ${round(p1[1] + (p2[1] - p0[1]) / 6)}`;
        d += ` ${round(p2[0] - (p3[0] - p1[0]) / 6)} ${round(p2[1] - (p3[1] - p1[1]) / 6)}`;
        d += ` ${round(p2[0])} ${round(p2[1])}`;
    }
    return closed ? `${d} Z` : d;
}

// Keep only the points that matter for the shape (Ramer-Douglas-Peucker).
function simplify(points: XY[], tolerance: number): XY[] {
    if (points.length < 3) return points;
    const [ax, ay] = points[0];
    const [bx, by] = points[points.length - 1];
    const length = Math.hypot(bx - ax, by - ay) || 1;
    let index = 0;
    let max = 0;
    for (let i = 1; i < points.length - 1; i++) {
        const [px, py] = points[i];
        const distance = Math.abs((by - ay) * px - (bx - ax) * py + bx * ay - by * ax) / length;
        if (distance > max) [max, index] = [distance, i];
    }
    if (max <= tolerance) return [points[0], points[points.length - 1]];
    return [...simplify(points.slice(0, index + 1), tolerance).slice(0, -1), ...simplify(points.slice(index), tolerance)];
}

// One googly eye in the shared creature structure (src/scripts/creatures.ts moves the pupil).
function eye(x: number, y: number, r: number) {
    return `<g>
        <circle cx="${round(x)}" cy="${round(y)}" r="${round(r)}" fill="#fff" data-eye />
        <g class="painted-pupil" data-pupil data-max="${round(r * 0.36)}">
            <circle cx="${round(x)}" cy="${round(y)}" r="${round(r * 0.62)}" fill="url(#cr-pupil)" />
            <circle cx="${round(x - r * 0.2)}" cy="${round(y - r * 0.22)}" r="${round(r * 0.16)}" fill="#fff" />
        </g>
    </g>`;
}

// ---------- colour + texture ----------
// Each brush colour melts into warm partner colours (like the soft risograph-style posters
// these figures are inspired by): [highlight, main, edge, inner glow].
const PALETTES: Record<string, [string, string, string, string]> = {
    "#ff5a1f": ["#ffd84d", "#ff5a1f", "#ff7fb3", "#ffe27a"], // orange -> sunflower top, pink edge
    "#2a3be8": ["#a9b8ff", "#2a3be8", "#ff8fc8", "#c9f0ff"], // cobalt -> periwinkle, pink edge
    "#ff8fb1": ["#ffe6c2", "#ff8fb1", "#ff5a1f", "#fff0a8"], // pink -> cream top, orange edge
    "#ffc93c": ["#fff6c9", "#ffc93c", "#ff6a2a", "#d8ff9e"], // sunflower -> orange edge, lime glow
    "#17153a": ["#7a74c9", "#17153a", "#ff5a1f", "#ff9ec4"], // ink -> violet top, orange edge
};
const paletteFor = (hex: string): [string, string, string, string] =>
    PALETTES[hex.toLowerCase()] ?? [lighter(hex), hex, darker(hex), lighter(hex, 0.8)];

// Gradients, grain and glow for one figure (ids are unique per figure).
function figureDefs(id: string, color: string, blur: number) {
    const [light, main, edge, glow] = paletteFor(color);
    return `
        <radialGradient id="${id}-fill" cx="32%" cy="26%" r="85%">
            <stop offset="0" stop-color="${light}"/>
            <stop offset=".45" stop-color="${main}"/>
            <stop offset="1" stop-color="${edge}"/>
        </radialGradient>
        <linearGradient id="${id}-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${light}"/>
            <stop offset=".5" stop-color="${main}"/>
            <stop offset="1" stop-color="${edge}"/>
        </linearGradient>
        <radialGradient id="${id}-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stop-color="${glow}" stop-opacity=".85"/>
            <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="${id}-shine" cx="50%" cy="50%" r="50%">
            <stop offset="0" stop-color="#fff" stop-opacity=".75"/>
            <stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </radialGradient>
        <!-- Grain: fine noise blended into the colour, kept inside the shape -->
        <filter id="${id}-grain" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" stitchTiles="stitch" result="noise"/>
            <feColorMatrix in="noise" type="saturate" values="0" result="mono"/>
            <feComposite in="mono" in2="SourceAlpha" operator="in" result="speckle"/>
            <feBlend in="SourceGraphic" in2="speckle" mode="overlay" result="textured"/>
            <feComposite in="textured" in2="SourceAlpha" operator="in"/>
        </filter>
        <!-- Soft glow trail that hangs below the figure -->
        <filter id="${id}-blur" x="-60%" y="-60%" width="220%" height="260%">
            <feGaussianBlur stdDeviation="${round(blur)}"/>
        </filter>`;
}

// ---------- turning a stroke into a figure ----------
function buildFigure(stroke: Point[], color: string) {
    const raw = stroke.map(({ x, y }) => [x, y] as XY);
    const xs = raw.map((p) => p[0]);
    const ys = raw.map((p) => p[1]);
    const box = { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
    const size = Math.max(box.x1 - box.x0, box.y1 - box.y0);
    const length = raw.reduce((sum, p, i) => (i ? sum + Math.hypot(p[0] - raw[i - 1][0], p[1] - raw[i - 1][1]) : 0), 0);
    const width = Math.max(8, stroke.reduce((sum, p) => sum + p.width, 0) / stroke.length);
    const [sx, sy] = raw[0];
    const [ex, ey] = raw[raw.length - 1];
    const closed = size > 30 && Math.hypot(ex - sx, ey - sy) < Math.max(40, size * 0.35);
    const id = `painted-${++figureCount}`;

    let shape = ""; // the figure's silhouette, reused for the glow trail
    let extras = ""; // inner glow, shine and mouth, on top of the silhouette
    let eyes = "";
    let blur = 14;

    if (size < 26) {
        // A dab: a little glowing drop with one eye
        const cx = (box.x0 + box.x1) / 2;
        const cy = (box.y0 + box.y1) / 2;
        const r = Math.max(14, width);
        blur = r * 0.45;
        shape = `<circle cx="${round(cx)}" cy="${round(cy)}" r="${round(r)}" fill="url(#${id}-fill)" />`;
        extras = `<ellipse cx="${round(cx - r * 0.35)}" cy="${round(cy - r * 0.4)}" rx="${round(r * 0.4)}" ry="${round(r * 0.25)}" fill="url(#${id}-shine)" />`;
        eyes = eye(cx, cy - r * 0.1, r * 0.42);
    } else if (closed) {
        // A closed shape: a soft blob that follows what you drew, with two eyes
        const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
        const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
        const sectors = 14;
        const radii = Array.from({ length: sectors }, () => 0);
        for (const [x, y] of raw) {
            const sector = Math.floor(((Math.atan2(y - cy, x - cx) + Math.PI) / (Math.PI * 2)) * sectors) % sectors;
            radii[sector] = Math.max(radii[sector], Math.hypot(x - cx, y - cy));
        }
        // Fill sectors you didn't pass through, then soften the outline
        const average = radii.filter(Boolean).reduce((a, b) => a + b, 0) / (radii.filter(Boolean).length || 1);
        const filled = radii.map((r) => r || average);
        const soft = filled.map((r, i) => (filled[(i + sectors - 1) % sectors] + r * 2 + filled[(i + 1) % sectors]) / 4);
        const outline = soft.map((r, i) => {
            const angle = -Math.PI + ((i + 0.5) / sectors) * Math.PI * 2;
            return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as XY;
        });
        const r = Math.min(...soft);
        blur = r * 0.35;
        shape = `<path d="${smoothPath(outline, true)}" fill="url(#${id}-fill)" />`;
        extras = `
            <ellipse cx="${round(cx + r * 0.1)}" cy="${round(cy + r * 0.3)}" rx="${round(r * 0.75)}" ry="${round(r * 0.45)}" fill="url(#${id}-glow)" />
            <ellipse cx="${round(cx - r * 0.38)}" cy="${round(cy - r * 0.42)}" rx="${round(r * 0.42)}" ry="${round(r * 0.26)}" fill="url(#${id}-shine)" transform="rotate(-30 ${round(cx - r * 0.38)} ${round(cy - r * 0.42)})" />
            <path d="M${round(cx - r * 0.18)} ${round(cy + r * 0.25)} Q${round(cx)} ${round(cy + r * 0.38)} ${round(cx + r * 0.18)} ${round(cy + r * 0.25)}" fill="none" stroke="#17153a" stroke-width="${round(Math.max(2, r * 0.06))}" stroke-linecap="round" />`;
        const eyeR = Math.max(6, Math.min(22, r * 0.22));
        eyes = eye(cx - r * 0.3, cy - r * 0.08, eyeR) + eye(cx + r * 0.3, cy - r * 0.08, eyeR);
    } else {
        // An open line: a smooth, glossy worm with its eyes at the end where you stopped
        const line = simplify(raw, 4);
        const path = smoothPath(line.length > 1 ? line : [raw[0], raw[raw.length - 1]], false);
        const w = Math.max(10, Math.min(36, width * 1.2));
        blur = w * 0.6;
        shape = `<path d="${path}" fill="none" stroke="url(#${id}-line)" stroke-width="${round(w)}" stroke-linecap="round" stroke-linejoin="round" />`;
        extras = `<path d="${path}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="${round(w * 0.22)}" stroke-linecap="round" transform="translate(${round(-w * 0.12)} ${round(-w * 0.16)})" />`;
        // Two eyes side by side across the end of the line
        const [px, py] = raw[Math.max(0, raw.length - 6)];
        const angle = Math.atan2(ey - py, ex - px) + Math.PI / 2;
        const eyeR = Math.max(6, w * 0.42);
        const spread = eyeR * 0.95;
        eyes = eye(ex + Math.cos(angle) * spread, ey + Math.sin(angle) * spread, eyeR) +
            eye(ex - Math.cos(angle) * spread, ey - Math.sin(angle) * spread, eyeR);
        if (length < 60) eyes = eye(ex, ey, eyeR); // short lines get a single eye
    }

    // Absolutely placed SVG around the figure, in the paint area's own coordinates
    // (extra room at the bottom for the glow trail)
    const pad = 40;
    const x = box.x0 - pad;
    const y = box.y0 - pad;
    const w = box.x1 - box.x0 + pad * 2;
    const h = box.y1 - box.y0 + pad * 2 + blur * 2;
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("class", "painted-figure");
    svg.setAttribute("viewBox", `${round(x)} ${round(y)} ${round(w)} ${round(h)}`);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("data-creature", "");
    svg.style.cssText = `left:${round(x)}px; top:${round(y)}px; width:${round(w)}px; height:${round(h)}px;`;
    svg.style.setProperty("--float-time", `${(4 + Math.random() * 3).toFixed(1)}s`);
    svg.style.setProperty("--float-delay", `${(-Math.random() * 4).toFixed(1)}s`);
    svg.style.setProperty("--float-rotate", `${(Math.random() * 8 - 4).toFixed(1)}deg`);
    svg.innerHTML = `<defs>${figureDefs(id, color, blur)}</defs>
        <g class="painted-trail" filter="url(#${id}-blur)" opacity=".6" transform="translate(0 ${round(blur * 1.2)}) scale(1 1)">${shape}</g>
        <g filter="url(#${id}-grain)">${shape}${extras}</g>
        <g class="painted-eyes">${eyes}</g>`;
    return svg;
}

function initPaint() {
    const area = document.querySelector<HTMLElement>("[data-paint-area]");
    const canvas = area?.querySelector<HTMLCanvasElement>("[data-paint-canvas]");
    const figures = area?.querySelector<HTMLElement>("[data-paint-figures]");
    const toolbar = document.querySelector<HTMLElement>("[data-paint-toolbar]");
    const pencil = document.querySelector<HTMLElement>("[data-paint-pencil]");
    const message = document.querySelector<HTMLElement>("[data-paint-message]");
    if (!area || !canvas || !figures || !toolbar || area.dataset.ready) return;
    area.dataset.ready = "true";

    const ctx = canvas.getContext("2d")!;
    const swatches = [...toolbar.querySelectorAll<HTMLButtonElement>("[data-color]")];
    const sizes = [...toolbar.querySelectorAll<HTMLButtonElement>("[data-size]")];
    const toggle = toolbar.querySelector<HTMLButtonElement>("[data-paint-toggle]")!;
    const clear = toolbar.querySelector<HTMLButtonElement>("[data-paint-clear]")!;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let color = swatches[0]?.dataset.color ?? "#ff5a1f";
    let size = Number(sizes[1]?.dataset.size ?? 14);
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let touchPainting = false;

    // ---- Canvas size follows the intro ----
    let ratio = 1;
    const resize = () => {
        ratio = Math.min(window.devicePixelRatio || 1, 2);
        const { width, height } = area.getBoundingClientRect();
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    };
    new ResizeObserver(resize).observe(area);
    resize();
    const wipe = () => {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    };

    // ---- Wet brush ----
    let last: Point | null = null;
    let lastTime = 0;
    let pointerId: number | null = null;
    let stroke: Point[] = [];

    const local = (event: PointerEvent) => {
        const box = area.getBoundingClientRect();
        return { x: event.clientX - box.left, y: event.clientY - box.top };
    };

    const segment = (from: Point, to: Point) => {
        const angle = Math.atan2(to.y - from.y, to.x - from.x) + Math.PI / 2;
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);
        ctx.strokeStyle = color;
        for (const [offset, alpha] of BRISTLES) {
            ctx.globalAlpha = alpha;
            ctx.lineWidth = Math.max(1, ((from.width + to.width) / 2) * (offset === 0 ? 1 : 0.35));
            ctx.beginPath();
            ctx.moveTo(from.x + nx * offset * from.width, from.y + ny * offset * from.width);
            ctx.lineTo(to.x + nx * offset * to.width, to.y + ny * offset * to.width);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    };

    const canPaint = (event: PointerEvent) => {
        if (event.button !== 0) return false;
        // Keep the polaroids, links, buttons, the toolbar and the figures working as usual.
        if ((event.target as Element).closest("a, button, [data-polaroid], [data-paint-toolbar]")) return false;
        if (event.pointerType === "touch" || coarse) return touchPainting;
        return true;
    };

    area.addEventListener("pointerdown", (event) => {
        if (!canPaint(event)) return;
        event.preventDefault(); // no text selection while painting
        pointerId = event.pointerId;
        area.setPointerCapture(event.pointerId);
        const { x, y } = local(event);
        last = { x, y, width: size };
        stroke = [last];
        lastTime = performance.now();
        segment(last, { x: x + 0.1, y: y + 0.1, width: size }); // a dab when you just click
        area.classList.add("is-painting");
        pencil?.classList.add("is-down");
    });

    area.addEventListener("pointermove", (event) => {
        if (event.pointerId !== pointerId || !last) return;
        const now = performance.now();
        for (const e of event.getCoalescedEvents?.() ?? [event]) {
            const { x, y } = local(e);
            const distance = Math.hypot(x - last.x, y - last.y);
            if (distance < 1.5) continue;
            const speed = distance / Math.max(1, now - lastTime);
            // Faster = thinner, eased towards the target so the width never jumps.
            const target = size * Math.max(0.35, Math.min(1.3, 1.25 - speed * 0.35));
            const point = { x, y, width: last.width + (target - last.width) * 0.3 };
            segment(last, point);
            stroke.push(point);
            last = point;
        }
        lastTime = now;
    });

    // ---- The stroke comes alive ----
    const bringToLife = (points: Point[]) => {
        const figure = buildFigure(points, color);
        figures.appendChild(figure);
        while (figures.children.length > MAX_FIGURES) figures.firstElementChild!.remove();
        toolbar.classList.add("has-painted");

        if (reduceMotion) {
            wipe();
        } else {
            // The wet paint fades while the figure pops out of it, then it starts floating
            gsap.to(canvas, { opacity: 0, duration: 0.45, ease: "power1.out", onComplete: () => {
                wipe();
                gsap.set(canvas, { opacity: 1 });
            } });
            gsap.from(figure, {
                scale: 0.6,
                opacity: 0,
                duration: 0.7,
                ease: "back.out(2.2)",
                transformOrigin: "50% 50%",
                onComplete: () => figure.classList.add("is-floating"),
            });
        }

        if (message && !message.classList.contains("is-shown")) {
            message.classList.add("is-shown");
        }
    };

    const stop = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        pointerId = null;
        last = null;
        area.classList.remove("is-painting");
        pencil?.classList.remove("is-down");
        if (stroke.length) bringToLife(stroke);
        stroke = [];
    };
    area.addEventListener("pointerup", stop);
    area.addEventListener("pointercancel", stop);

    // ---- Toolbar ----
    const select = (buttons: HTMLButtonElement[], chosen: HTMLButtonElement) =>
        buttons.forEach((button) => button.setAttribute("aria-pressed", String(button === chosen)));

    swatches.forEach((swatch) =>
        swatch.addEventListener("click", () => {
            color = swatch.dataset.color!;
            select(swatches, swatch);
            toolbar.style.setProperty("--brush", color);
            pencil?.style.setProperty("--pencil", color);
            // the blob you dip into gives a little squish
            if (!reduceMotion) gsap.fromTo(swatch, { scale: 0.8 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)", clearProps: "scale" });
        }),
    );
    sizes.forEach((button) =>
        button.addEventListener("click", () => {
            size = Number(button.dataset.size);
            select(sizes, button);
        }),
    );
    clear.addEventListener("click", () => {
        wipe();
        figures.replaceChildren();
        toolbar.classList.remove("has-painted");
    });
    toggle.addEventListener("click", () => {
        touchPainting = !touchPainting;
        toggle.setAttribute("aria-pressed", String(touchPainting));
        area.classList.toggle("is-touch-painting", touchPainting);
    });

    // ---- The palette pops out of the screen, then tilts with the mouse ----
    if (!reduceMotion) {
        const blobs = toolbar.querySelectorAll(".paint-swatch, .paint-size");
        gsap.timeline({ scrollTrigger: { trigger: toolbar, start: "top 95%", once: true } })
            .from(toolbar, {
                scale: 0.2,
                rotation: -35,
                y: 90,
                autoAlpha: 0,
                duration: 1,
                ease: "back.out(1.7)",
            })
            .from(blobs, { scale: 0, duration: 0.45, ease: "back.out(3)", stagger: 0.06 }, "-=0.45");

        const tiltX = gsap.quickTo(toolbar, "rotationX", { duration: 0.5, ease: "power3.out" });
        const tiltY = gsap.quickTo(toolbar, "rotationY", { duration: 0.5, ease: "power3.out" });
        gsap.set(toolbar, { transformPerspective: 700 });
        toolbar.addEventListener("pointermove", (event) => {
            const box = toolbar.getBoundingClientRect();
            tiltY(((event.clientX - box.left) / box.width - 0.5) * 22);
            tiltX(-((event.clientY - box.top) / box.height - 0.5) * 22);
        });
        toolbar.addEventListener("pointerleave", () => {
            tiltX(0);
            tiltY(0);
        });
    }

    // ---- Pencil on the mouse while it's over the drawing area ----
    if (pencil && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const moveX = gsap.quickTo(pencil, "x", { duration: 0.08, ease: "power2.out" });
        const moveY = gsap.quickTo(pencil, "y", { duration: 0.08, ease: "power2.out" });
        const lean = gsap.quickTo(pencil, "rotation", { duration: 0.4, ease: "power2.out" });
        const height = () => pencil.offsetHeight;
        let previousX = 0;

        const show = (on: boolean) => {
            pencil.classList.toggle("is-visible", on);
            document.body.classList.toggle("is-pencil", on);
        };

        area.addEventListener("pointermove", (event) => {
            // Normal cursor over links, buttons, photos and the palette
            const blocked = !!(event.target as Element).closest("a, button, [data-polaroid], [data-paint-toolbar]");
            show(!blocked || pointerId !== null);
            // Tip of the pencil (bottom-left of its box) sits on the pointer
            moveX(event.clientX - 2);
            moveY(event.clientY - height() + 2);
            // Lean a little in the direction you move
            lean(Math.max(-14, Math.min(14, (event.clientX - previousX) * 0.8)));
            previousX = event.clientX;
        });
        area.addEventListener("pointerleave", () => show(false));
        document.addEventListener("astro:before-swap", () => document.body.classList.remove("is-pencil"), { once: true });
    }
}

initPaint();
