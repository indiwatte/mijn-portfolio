// Every creature's pupils (src/components/creatures/Creature.astro) move towards the
// pointer, as far as its eye allows: the further away the pointer, the closer to the edge
// of the eye. A creature opens its eyes wide when the pointer comes close.
// A creature with data-look-at="<selector>" looks at that element instead while there's no
// mouse, or when it has rested for a moment: the hero creatures point the way down.
// One listener for all creatures on the page, updated at most once per frame.

let pointerX: number | null = null;
let pointerY: number | null = null;
let frame = 0;
let resting = true; // no mouse yet, or it hasn't moved for a while
let restTimer: ReturnType<typeof setTimeout> | undefined;
const REST = 1500; // ms

function update() {
    frame = 0;
    for (const svg of document.querySelectorAll<SVGSVGElement>("[data-creature]")) {
        const box = svg.getBoundingClientRect();
        // Hidden on this screen size, or far off screen: skip the work.
        if (!box.width || box.bottom < -200 || box.top > window.innerHeight + 200) continue;

        // What to look at: the guide target while the mouse rests, else the mouse.
        let lookX = pointerX;
        let lookY = pointerY;
        const target = svg.dataset.lookAt && resting ? document.querySelector(svg.dataset.lookAt) : null;
        if (target) {
            const t = target.getBoundingClientRect();
            lookX = t.left + t.width / 2;
            lookY = t.top + t.height / 2;
        }
        if (lookX === null || lookY === null) continue;

        const near = target ? Infinity : Math.hypot(lookX - (box.left + box.width / 2), lookY - (box.top + box.height / 2));
        svg.classList.toggle("is-near", near < box.width * 0.9);

        for (const pupil of svg.querySelectorAll<SVGGElement>("[data-pupil]")) {
            const eye = pupil.parentElement!.querySelector<SVGCircleElement>("[data-eye]")!;
            const max = Number(pupil.dataset.max);
            const eyeBox = eye.getBoundingClientRect();
            const dx = lookX - (eyeBox.left + eyeBox.width / 2);
            const dy = lookY - (eyeBox.top + eyeBox.height / 2);
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
    // Touch has no resting mouse to follow: keep guiding.
    resting = event.pointerType !== "mouse";
    clearTimeout(restTimer);
    restTimer = setTimeout(() => {
        resting = true;
        schedule();
    }, REST);
    schedule();
};

window.addEventListener("pointermove", follow, { passive: true });
window.addEventListener("pointerdown", follow, { passive: true }); // a tap on touch screens
window.addEventListener("scroll", schedule, { passive: true });
schedule(); // look at the guide target from the start
