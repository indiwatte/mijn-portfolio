// The creature drawings, shared by the hero (HeroCreatures.astro) and the footer wordmark.
// Each creature is drawn in a 160×160 box:
//  - body:  SVG markup drawn behind the eyes (uses the gradients/filters in CreatureDefs.astro)
//  - over:  SVG markup drawn on top of the eyes (brows, mouths, noses…)
//  - eyes:  [x, y, radius]

export type Eye = [x: number, y: number, r: number];

export interface CreatureArt {
	body: string;
	over?: string;
	eyes: Eye[];
}

export const INK = "#17153a";

const gloss = (d: string, width: number) =>
	`<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="${width}" stroke-linecap="round" transform="translate(-3 -4)"/>`;

const worm = "M26 40 C70 8 132 26 122 74 C114 112 62 114 66 88 C70 64 110 74 106 110 C104 128 112 136 124 132";
const squiggle = "M14 92 q15 -34 30 0 t30 0 t30 0 t30 0";

const petals = [0, 60, 120, 180, 240, 300]
	.map((a) => {
		const r = (a * Math.PI) / 180;
		return `<circle cx="${(80 + Math.cos(r) * 32).toFixed(1)}" cy="${(70 + Math.sin(r) * 32).toFixed(1)}" r="25" fill="url(#cr-petal)"/>`;
	})
	.join("");

export const creatureArt = {
	// Fuzzy rainbow, peeking out from under its own arch
	rainbow: {
		body: `<g filter="url(#cr-fur)" fill="none" stroke-width="17" stroke-linecap="round">
			<path d="M16 128 A64 64 0 0 1 144 128" stroke="url(#cr-orange)"/>
			<path d="M32 128 A48 48 0 0 1 128 128" stroke="url(#cr-pink)"/>
			<path d="M48 128 A32 32 0 0 1 112 128" stroke="url(#cr-butter)"/>
		</g>`,
		eyes: [[64, 118, 15], [96, 118, 15]],
	},
	// Grumpy fluffy bunny (orange)
	bunny: {
		body: `<g filter="url(#cr-fur)" fill="url(#cr-orange)" stroke="url(#cr-orange)">
			<path d="M58 70 L44 18 M90 66 L104 16" stroke-width="26" stroke-linecap="round"/>
			<circle cx="74" cy="100" r="46" stroke="none"/>
			<circle cx="34" cy="128" r="9" stroke="none"/><circle cx="114" cy="128" r="9" stroke="none"/>
		</g>`,
		over: `<path d="M48 80 Q74 66 100 80" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
			<ellipse cx="75" cy="117" rx="6" ry="5" fill="#ff6f91"/>`,
		eyes: [[61, 98, 14], [89, 98, 14]],
	},
	// Happy flower on wiggly legs
	flower: {
		body: `<g fill="none" stroke="#ff8fb8" stroke-width="5" stroke-linecap="round">
			<path d="M68 104 q-8 10 0 20 q8 10 0 20"/><path d="M92 104 q8 10 0 20 q-8 10 0 20"/>
		</g>
		${petals}
		<circle cx="80" cy="70" r="32" fill="url(#cr-petal)"/>`,
		over: `<path d="M66 86 Q80 104 94 86 Z" fill="#c2185b"/><ellipse cx="80" cy="95" rx="5" ry="3" fill="#ff6f91"/>
			<ellipse cx="58" cy="84" rx="6" ry="3.5" fill="#ff6f91" opacity=".6"/><ellipse cx="102" cy="84" rx="6" ry="3.5" fill="#ff6f91" opacity=".6"/>`,
		eyes: [[68, 68, 11], [92, 68, 11]],
	},
	// Butter apple waving both hands
	apple: {
		body: `<g stroke="url(#cr-butter)" stroke-linecap="round" fill="none">
			<path d="M42 98 L24 76" stroke-width="10"/><path d="M118 98 L136 76" stroke-width="10"/>
			<path d="M68 132 L64 152 L56 152 M92 132 L96 152 L104 152" stroke-width="9" stroke-linejoin="round"/>
		</g>
		<circle cx="22" cy="72" r="9" fill="url(#cr-butter)"/><circle cx="138" cy="72" r="9" fill="url(#cr-butter)"/>
		<path d="M80 50 Q82 38 90 32" fill="none" stroke="#6b2a12" stroke-width="5" stroke-linecap="round"/>
		<ellipse cx="96" cy="40" rx="11" ry="6" fill="#ffa6e6" transform="rotate(-25 96 40)"/>
		<circle cx="80" cy="94" r="44" fill="url(#cr-butter)"/>
		<ellipse cx="64" cy="70" rx="12" ry="7" fill="#fff" opacity=".45" transform="rotate(-30 64 70)"/>`,
		over: `<path d="M70 114 Q80 122 90 114" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
		eyes: [[67, 92, 13], [93, 92, 13]],
	},
	// Glossy worm tied in a knot
	worm: {
		body: `<path d="${worm}" fill="none" stroke="url(#cr-worm)" stroke-width="30" stroke-linecap="round"/>
			${gloss(worm, 7)}`,
		eyes: [[116, 128, 12], [139, 124, 12]],
	},
	// Fuzzy peach cloud, one eye bigger than the other
	cloud: {
		body: `<path filter="url(#cr-fur)" fill="url(#cr-peach)" d="M30 110 C10 110 10 80 30 76 C26 52 54 42 66 58 C74 36 110 38 112 60 C134 56 150 82 134 96 C146 114 124 130 110 120 C102 136 72 136 66 122 C52 132 32 126 30 110 Z"/>`,
		over: `<ellipse cx="82" cy="108" rx="6" ry="7" fill="${INK}"/>`,
		eyes: [[64, 86, 16], [98, 84, 12]],
	},
	// Lilac slime drop sticking its tongue out
	drop: {
		body: `<path fill="url(#cr-slime)" d="M80 16 C100 58 130 80 126 112 C122 140 102 152 80 152 C58 152 38 140 34 112 C30 80 60 58 80 16 Z"/>
			<ellipse cx="62" cy="72" rx="8" ry="16" fill="#fff" opacity=".35" transform="rotate(25 62 72)"/>`,
		over: `<path d="M68 128 Q80 136 92 128" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
			<path d="M80 131 q8 0 8 9 q0 7 -8 7 q-8 0 -8 -7 q0 -9 8 -9 Z" fill="#ff6f91"/>`,
		eyes: [[64, 106, 14], [96, 106, 14]],
	},
	// Fuzzy pink cyclops
	cyclops: {
		body: `<circle filter="url(#cr-fur)" cx="80" cy="84" r="54" fill="url(#cr-pink)"/>`,
		over: `<path d="M64 124 Q80 132 96 124" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
		eyes: [[80, 80, 26]],
	},
	// Glossy squiggle, just for fun
	squiggle: {
		body: `<path d="${squiggle}" fill="none" stroke="url(#cr-worm)" stroke-width="13" stroke-linecap="round"/>${gloss(squiggle, 3)}`,
		eyes: [],
	},
} satisfies Record<string, CreatureArt>;

export type CreatureName = keyof typeof creatureArt;
