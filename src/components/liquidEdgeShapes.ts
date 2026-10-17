// The organic "liquid" edge shapes (wave with inlets, domes, floating blobs and dry-brush
// strokes), generated from a seed. Used by LiquidEdge.astro (a coloured edge on top of a
// section) and by edgeMask() (the same shapes as a CSS mask, e.g. to cut a photo).

export const WIDTH = 1440;
export const HEIGHT = 300;

export function liquidEdgeShapes(seed: number) {
    // Small seeded random generator (same output for the same seed).
    let state = seed;
    const random = () => {
    	state = (state + 0x6d2b79f5) | 0;
    	let t = Math.imul(state ^ (state >>> 15), 1 | state);
    	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const between = (min: number, max: number) => min + random() * (max - min);
    const round = (n: number) => Math.round(n * 10) / 10;


    type Point = [number, number];
    const pt = ([x, y]: Point) => `${round(x)} ${round(y)}`;

    // Smooth curve through the points (Catmull-Rom spline as cubic Béziers).
    function smooth(points: Point[], closed: boolean) {
    	const at = (i: number) =>
    		closed ? points[(i + points.length) % points.length] : points[Math.max(0, Math.min(points.length - 1, i))];
    	const last = closed ? points.length : points.length - 1;
    	let d = "";
    	for (let i = 0; i < last; i++) {
    		const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    		const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    		const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    		d += ` C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
    	}
    	return d;
    }
    const closedSmooth = (points: Point[]) => `M${pt(points[0])}${smooth(points, true)} Z`;

    // A soft, wobbly blob: wide and low, like a cloud lump.
    function blob(cx: number, cy: number, w: number, h: number, flatBottom = false) {
    	const count = 9;
    	const points: Point[] = Array.from({ length: count }, (_, i) => {
    		const angle = (i / count) * Math.PI * 2 + between(-0.12, 0.12);
    		const wobble = between(0.85, 1.12);
    		let y = Math.sin(angle) * h * wobble;
    		if (flatBottom && y > 0) y *= 0.25; // sits on the wave
    		return [cx + Math.cos(angle) * w * wobble, cy + y];
    	});
    	return closedSmooth(points);
    }

    // A tapered brush stroke along a gentle curve: thin at both ends, full in the middle.
    function stroke(x: number, y: number, length: number, width: number, tilt: number, bend: number) {
    	const steps = 22;
    	const cos = Math.cos(tilt);
    	const sin = Math.sin(tilt);
    	const centre: Point[] = Array.from({ length: steps + 1 }, (_, i) => {
    		const t = i / steps;
    		const lx = (t - 0.5) * length;
    		const ly = bend * (4 * t * (1 - t) - 1) * length * 0.18 + Math.sin(t * Math.PI * 2) * length * 0.03;
    		return [x + lx * cos - ly * sin, y + lx * sin + ly * cos];
    	});
    	const left: Point[] = [];
    	const right: Point[] = [];
    	centre.forEach(([cx, cy], i) => {
    		const [nx, ny] = centre[Math.min(i + 1, steps)];
    		const [ox, oy] = centre[Math.max(i - 1, 0)];
    		const a = Math.atan2(ny - oy, nx - ox);
    		const t = i / steps;
    		const half = (width / 2) * Math.pow(Math.sin(Math.PI * t), 0.7) + 0.6;
    		left.push([cx - Math.sin(a) * half, cy + Math.cos(a) * half]);
    		right.push([cx + Math.sin(a) * half, cy - Math.cos(a) * half]);
    	});
    	return closedSmooth([...left, ...right.reverse()]);
    }

    // The wave: rolling hills, some low valleys and a few high crests.
    const wave: Point[] = [];
    for (let x = -120; x < WIDTH + 240; x += between(140, 240)) {
    	const r = random();
    	wave.push([x, r < 0.22 ? between(60, 110) : r < 0.6 ? between(130, 190) : between(200, 245)]);
    }
    const waveY = (x: number) => {
    	const i = Math.max(0, wave.findIndex(([wx]) => wx > x) - 1);
    	const [x1, y1] = wave[i];
    	const [x2, y2] = wave[i + 1] ?? wave[i];
    	return x2 === x1 ? y1 : y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
    };

    // Inlets: long tapered channels of the section behind, cut into the wave (even-odd holes).
    const inlets: string[] = [];
    for (let i = 0; i < 3; i++) {
    	const length = between(160, 260);
    	const cx = between(length / 2 + 30, WIDTH - length / 2 - 30);
    	const top = Math.max(waveY(cx - length / 2), waveY(cx), waveY(cx + length / 2)) + 26;
    	if (top + 20 < HEIGHT - 10) inlets.push(stroke(cx, top, length, between(14, 22), between(-0.08, 0.08), random() < 0.5 ? -0.4 : 0.4));
    }
    const waveFill = `M-120 ${HEIGHT} L${pt(wave[0])}${smooth(wave, false)} L${WIDTH + 240} ${HEIGHT} Z ${inlets.join(" ")}`;

    // Domes sitting on the wave, and loose blobs floating above it.
    const domes = Array.from({ length: 2 }, () => {
    	const cx = between(120, WIDTH - 120);
    	const h = between(28, 48);
    	return blob(cx, waveY(cx) + h * 0.35, between(60, 95), h); // sunk into the wave
    });
    const floaters = Array.from({ length: 2 }, () => {
    	const cx = between(80, WIDTH - 80);
    	return blob(cx, Math.max(40, waveY(cx) - between(70, 110)), between(30, 55), between(10, 16));
    });

    // Dry-brush strokes above (and sometimes dipping into) the wave.
    const strokes = Array.from({ length: 6 }, (_, i) => {
    	const x = (WIDTH / 6) * i + between(40, WIDTH / 6 - 40);
    	const y = Math.max(28, waveY(x) - between(30, 95));
    	return stroke(x, y, between(120, 230), between(9, 17), between(-0.45, 0.45), random() < 0.5 ? -1 : 1);
    });

    return { waveFill, domes, floaters, strokes };
}

// The edge as a standalone SVG for a CSS mask-image: everything the shapes cover is
// opaque. flip turns it upside down (for a bottom edge).
export function edgeMask(seed: number, flip = false) {
    const { waveFill, domes, floaters, strokes } = liquidEdgeShapes(seed);
    const id = `m${seed}`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" preserveAspectRatio="xMidYMax slice">
<defs><filter id="${id}" x="-5%" y="-30%" width="110%" height="160%">
<feTurbulence type="fractalNoise" baseFrequency="0.9 0.35" numOctaves="2" seed="${seed}" result="noise"/>
<feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -7 4.75" result="speckle"/>
<feComposite in="SourceGraphic" in2="speckle" operator="in" result="dry"/>
<feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="1" seed="${seed + 1}" result="rough"/>
<feDisplacementMap in="dry" in2="rough" scale="6" xChannelSelector="R" yChannelSelector="G"/>
</filter></defs>
<g fill="#000"${flip ? ` transform="translate(0 ${HEIGHT}) scale(1 -1)"` : ""}>
<path d="${waveFill}" fill-rule="evenodd"/>
${domes.map((d) => `<path d="${d}"/>`).join("")}
${floaters.map((d) => `<path d="${d}"/>`).join("")}
<g filter="url(#${id})">${strokes.map((d) => `<path d="${d}"/>`).join("")}</g>
</g></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
