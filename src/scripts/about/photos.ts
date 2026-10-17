import { gsap } from "../gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

// About page: two photos. The big one slides in from the side, then the small one
// comes out from behind it. Afterwards both can be dragged around the board.
function initPhotos() {
    const board = document.querySelector<HTMLElement>("[data-photo-board]");
    const big = board?.querySelector<HTMLElement>("[data-photo-big]");
    const small = board?.querySelector<HTMLElement>("[data-photo-small]");
    if (!board || !big || !small || board.dataset.ready) return;
    board.dataset.ready = "true";

    const photos = [big, small];
    const tilt = (photo: HTMLElement) => Number(photo.dataset.rotate ?? 0);
    let topLayer = 2;

    const makeDraggable = () => {
        photos.forEach((photo) => {
            Draggable.create(photo, {
                bounds: board,
                inertia: true,
                edgeResistance: 0.8,
                zIndexBoost: false, // own counter, kept inside the board
                onPress() {
                    photo.style.zIndex = String(++topLayer);
                    gsap.to(photo, { scale: 1.03, rotation: tilt(photo) / 3, duration: 0.25, ease: "power2.out" });
                },
                onRelease() {
                    gsap.to(photo, { scale: 1, rotation: tilt(photo), duration: 0.6, ease: "back.out(2)" });
                },
            });
        });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        photos.forEach((photo) => gsap.set(photo, { rotation: tilt(photo) }));
        makeDraggable();
        return;
    }

    // Measured before the photos move, so the small one starts at the centre of the big one.
    const bigBox = big.getBoundingClientRect();
    const smallBox = small.getBoundingClientRect();
    const fromBehind = {
        x: bigBox.left + bigBox.width / 2 - (smallBox.left + smallBox.width / 2),
        y: bigBox.top + bigBox.height / 2 - (smallBox.top + smallBox.height / 2),
    };

    gsap.set(big, { xPercent: -160, autoAlpha: 0, rotation: tilt(big) - 12 });
    gsap.set(small, { autoAlpha: 0 });

    gsap
        .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: board, start: "top 80%", once: true },
            onComplete: makeDraggable,
        })
        .to(big, { xPercent: 0, autoAlpha: 1, rotation: tilt(big), duration: 1.1 })
        .fromTo(
            small,
            { ...fromBehind, autoAlpha: 1, scale: 0.7, rotation: tilt(small) },
            { x: 0, y: 0, scale: 1, duration: 1.2, ease: "power3.inOut" },
            "-=0.1",
        );
}

initPhotos();
