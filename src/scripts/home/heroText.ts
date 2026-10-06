import { gsap } from "../gsap";

// Replace an element's text with one span per letter (spaces stay as plain text nodes).
function splitIntoLetters(el: HTMLElement, text: string) {
    el.textContent = "";
    text.split("").forEach((char) => {
        if (char === " ") {
            el.appendChild(document.createTextNode(" "));
            return;
        }
        const letter = document.createElement("span");
        letter.textContent = char;
        letter.className = "hover-letter";
        el.appendChild(letter);
    });
}

const WORDS = ["codes", "overthinks", "draws", "designs", "obsesses", "builds", "iterates", "questions"];

// Headline letters: static "Designer who" line + a slot-machine word that cycles every 2s.
export function initHeroText() {
    const staticLine = document.getElementById("hero-line-static");
    if (staticLine) splitIntoLetters(staticLine, "Designer who");

    const wordEl = document.getElementById("hero-word");
    const dynamicLine = document.getElementById("hero-line-dynamic");
    let wordIndex = 0;

    if (wordEl && dynamicLine) {
        splitIntoLetters(wordEl, WORDS[wordIndex]);

        // Only spin the word while the hero is on screen (no wasted work while reading further down).
        let heroVisible = true;
        const hero = document.getElementById("hero");
        if (hero) {
            new IntersectionObserver(([entry]) => {
                heroVisible = entry.isIntersecting;
            }).observe(hero);
        }

        setInterval(() => {
            if (!heroVisible || document.hidden) return;
            wordIndex = (wordIndex + 1) % WORDS.length;
            const nextWord = WORDS[wordIndex];

            // Clip only while the reel is spinning so hover pops never get cropped at rest.
            dynamicLine.classList.add("is-spinning");

            gsap
                .timeline({
                    onComplete: () => dynamicLine.classList.remove("is-spinning"),
                })
                .to(wordEl, {
                    yPercent: -100,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.in",
                })
                .call(() => {
                    splitIntoLetters(wordEl, nextWord);
                    gsap.set(wordEl, { yPercent: 100, opacity: 0 });
                })
                .to(wordEl, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: "back.out(1.7)",
                });
        }, 2000);
    }

    // Delegated hover so newly generated letters (after each word swap) react too.
    // Listening on the headline only, not the whole document, and only with a mouse.
    const headline = staticLine?.closest("h1");
    if (!headline || !window.matchMedia("(hover: hover)").matches) return;

    headline.addEventListener("mouseover", (event) => {
        const letter = (event.target as HTMLElement).closest<HTMLElement>(".hover-letter");
        if (!letter) return;
        gsap.to(letter, {
            y: -16,
            rotate: gsap.utils.random(-14, 14),
            color: getComputedStyle(document.documentElement).getPropertyValue("--home-pink").trim(),
            duration: 0.35,
            ease: "back.out(3)",
            overwrite: true,
        });
    });

    headline.addEventListener("mouseout", (event) => {
        const letter = (event.target as HTMLElement).closest<HTMLElement>(".hover-letter");
        if (!letter) return;
        gsap.to(letter, {
            y: 0,
            rotate: 0,
            color: "#ffffff",
            duration: 0.5,
            ease: "elastic.out(1, 0.4)",
            overwrite: true,
        });
    });
}
