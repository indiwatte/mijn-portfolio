import { gsap } from "../gsap";

// About page hero: the big title rises in once the loader has slid away,
// then shrinks with the scroll (scrubbed) until the photos and text move up under it.
function initHeroTitle() {
	const hero = document.querySelector<HTMLElement>("[data-about-hero]");
	const title = document.querySelector<HTMLElement>("[data-about-title]");
	const stage = document.querySelector<HTMLElement>(".about-hero-stage");
	if (!hero || !title || !stage) return;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	const lines = gsap.utils.toArray<HTMLElement>(".about-title-line > span", title);
	const mark = title.querySelector<HTMLElement>("[data-about-mark]");
	// the highlight waits, empty, until the title is in (the text keeps its own colour until
	// the stroke covers it; js-markers: see the marker styles in global.css)
	if (mark) {
		document.documentElement.classList.add("js-markers");
		gsap.set(mark, { backgroundSize: "0% 78%" });
	}

	const rise = () => {
		gsap.from(lines, {
			yPercent: 110,
			duration: 1.2,
			ease: "power4.out",
			stagger: 0.15,
		});
		// then the marker glides over my name: slow start, smooth finish
		if (mark) {
			gsap.to(mark, {
				backgroundSize: "100% 78%",
				duration: 1.3,
				ease: "power2.inOut",
				delay: 1,
				onUpdate() {
					mark.classList.toggle("is-marked", this.progress() > 0.4);
				},
			});
		}
	};

	// Wait for the loader to finish sliding up, so the title doesn't animate behind it. The
	// loader can already be done (or gone) by the time this runs, so cover every case, once.
	let started = false;
	const start = () => {
		if (started) return;
		started = true;
		rise();
	};
	const loader = document.querySelector<HTMLElement>("[data-loader]");
	// its slide-up: 250ms delay + 800ms (Loader.astro)
	const afterSlide = () => setTimeout(start, 1050);
	if (!loader) {
		start();
	} else if (loader.classList.contains("is-done")) {
		afterSlide();
	} else {
		loader.addEventListener("transitionend", (event) => event.target === loader && start());
		new MutationObserver((_, observer) => {
			if (!loader.classList.contains("is-done")) return;
			observer.disconnect();
			afterSlide(); // in case transitionend is skipped (hidden tab)
		}).observe(loader, { attributes: true, attributeFilter: ["class"] });
	}

	// The stage starts full screen, then collapses to the shrunk title's height.
	// The title ends up at the top of the screen and the photos and text follow right under it.
	const scale = () => (window.matchMedia("(min-width: 768px)").matches ? 0.42 : 0.6);
	const topSpace = () => Math.max(window.innerHeight * 0.14, 88); // room under the fixed header
	const bottomSpace = () => window.innerHeight * 0.04; // gap between title and content
	const stageHeight = () => topSpace() + title.offsetHeight * scale() + bottomSpace();

	gsap
		.timeline({
			scrollTrigger: {
				trigger: hero,
				start: "top top",
				end: "bottom bottom",
				scrub: 0.6,
				invalidateOnRefresh: true,
			},
		})
		.fromTo(
			stage,
			{ height: () => stage.offsetHeight },
			{ height: stageHeight, ease: "none" },
			0,
		)
		.to(title, { scale, y: () => (topSpace() - bottomSpace()) / 2, ease: "none" }, 0);
}

initHeroTitle();
