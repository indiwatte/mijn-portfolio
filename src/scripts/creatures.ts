// Every creature's pupils (src/components/creatures/Creature.astro) move towards the
// pointer, as far as its eye allows: the further away the pointer, the closer to the edge
// of the eye. A creature opens its eyes wide when the pointer comes close.
// One listener for all creatures on the page, updated at most once per frame.

let pointerX: number | null = null;
let pointerY: number | null = null;
let frame = 0;

function update() {
    frame = 0;
    if (pointerX === null || pointerY === null) return;
    for (const svg of document.querySelectorAll<SVGSVGElement>("[data-creature]")) {
        const box = svg.getBoundingClientRect();
        // Hidden on this screen size, or far off screen: skip the work.
        if (!box.width || box.bottom < -200 || box.top > window.innerHeight + 200) continue;
        const near = Math.hypot(pointerX - (box.left + box.width / 2), pointerY - (box.top + box.height / 2));
        svg.classList.toggle("is-near", near < box.width * 0.9);

        for (const pupil of svg.querySelectorAll<SVGGElement>("[data-pupil]")) {
            const eye = pupil.parentElement!.querySelector<SVGCircleElement>("[data-eye]")!;
            const max = Number(pupil.dataset.max);
            const eyeBox = eye.getBoundingClientRect();
            const dx = pointerX - (eyeBox.left + eyeBox.width / 2);
            const dy = pointerY - (eyeBox.top + eyeBox.height / 2);
            const distance = Math.hypot(dx, dy) || 1;
            const reach = max * Math.min(1, distance / 80);
            pupil.style.transform = `translate(${((dx / distance) * reach).toFixed(2)}px, ${((dy / distance) * reach).toFixed(2)}px)`;
        }
    }
}

const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
};

const follow = (event: PointerEvent) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    schedule();
};

window.addEventListener("pointermove", follow, { passive: true });
window.addEventListener("pointerdown", follow, { passive: true }); // a tap on touch screens
window.addEventListener("scroll", schedule, { passive: true });
