// Makes the share previews (Open Graph images, 1200×630 JPG) that LinkedIn, WhatsApp,
// Slack and others show when someone shares a link to the portfolio.
//   - public/og/default.jpg: home, about and the project overview
//   - public/og/<project>.jpg: one per project page, from its header image
// Run it after adding a project or changing a header image:  npm run og
import { readdir, readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const PUBLIC = join(ROOT, "public");
const OUT = join(PUBLIC, "og");
const W = 1200;
const H = 630;
const TINTS = ["#e9e3fb", "#ffe8d2", "#f6dcef", "#dfe9fb"];

await mkdir(OUT, { recursive: true });

// ---------- default card: name + role on the cobalt gradient, photo in an arch ----------
{
	const photo = await sharp(join(PUBLIC, "images/header-img.webp"))
		.resize(380, 500, { fit: "cover", position: "attention" })
		.composite([
			{
				input: Buffer.from(
					`<svg width="380" height="500"><rect width="380" height="500" rx="190" ry="190" /><rect y="190" width="380" height="310" rx="28" /></svg>`,
				),
				blend: "dest-in",
			},
		])
		.png()
		.toBuffer();

	const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
		<defs>
			<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="#3d4fec"/>
				<stop offset=".55" stop-color="#8c86f4"/>
				<stop offset="1" stop-color="#ffd3c2"/>
			</linearGradient>
		</defs>
		<rect width="${W}" height="${H}" fill="url(#sky)"/>
		<rect x="738" y="59" width="404" height="524" rx="202" ry="202" fill="#ffc93c"/>
		<text x="80" y="250" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="104" font-weight="900" fill="#fff" letter-spacing="-3">INDI WATTÉ</text>
		<text x="84" y="320" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="38" font-weight="500" fill="#fff">Designer &amp; front-end developer</text>
		<text x="84" y="372" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" fill="#ffffff" fill-opacity=".85">Brand identities · campaigns · websites</text>
		<rect x="84" y="430" width="300" height="64" rx="32" fill="#ffa2b6"/>
		<text x="234" y="472" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="26" font-weight="700" fill="#17153a">Based in Belgium</text>
	</svg>`);

	await sharp(background)
		.composite([{ input: photo, left: 750, top: 71 }])
		.jpeg({ quality: 86 })
		.toFile(join(OUT, "default.jpg"));
	console.log("og/default.jpg");
}

// ---------- one per project page, from its header image ----------
const projectsTs = await readFile(join(ROOT, "src/data/projects.ts"), "utf8");
const pagesDir = join(ROOT, "src/pages/projects");
const files = (await readdir(pagesDir)).filter((f) => f.endsWith(".md") && !f.startsWith("_"));

for (const [i, file] of files.entries()) {
	const slug = file.replace(/\.md$/, "");
	const md = await readFile(join(pagesDir, file), "utf8");
	// The header image; video headers use the project's card image from projects.ts
	let image = md.match(/^heroImage:\s*"([^"]+)"/m)?.[1];
	if (!image) {
		const card = projectsTs.match(new RegExp(`image: "([^"]+)",\\s*href: "/projects/${slug}"`));
		image = card?.[1];
	}
	if (!image) {
		console.warn(`skipped ${slug}: no header image found`);
		continue;
	}

	// The image sits whole on a soft tint (transparent mockups float, nothing is cropped)
	const picture = await sharp(join(PUBLIC, decodeURIComponent(image)))
		.resize(W - 120, H - 80, { fit: "inside" })
		.toBuffer();
	await sharp({ create: { width: W, height: H, channels: 3, background: TINTS[i % TINTS.length] } })
		.composite([{ input: picture, gravity: "center" }])
		.jpeg({ quality: 86 })
		.toFile(join(OUT, `${slug}.jpg`));
	console.log(`og/${slug}.jpg`);
}
