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

const WORDS = ["codes", "draws", "builds", "explores", "listens", "iterates", "plays"];

// Headline letters: static "Designer who" line + a slot-machine word that cycles every 2s.
export function initHeroText() {
    // "Designer" + mockup pill + "who"
    const staticLine = document.getElementById("hero-line-static");
    if (staticLine) splitIntoLetters(staticLine, "Designer");
    const staticEnd = document.getElementById("hero-line-static-end");
    if (staticEnd) splitIntoLetters(staticEnd, "who");

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

            // Clip only while the reel is spinning.
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
}
