import { gsap } from "../gsap";

export function initMusicPod() {
    const playBtn = document.getElementById("pod-play");
    const audio = document.getElementById("pod-audio") as HTMLAudioElement | null;
    const progressBar = document.getElementById("pod-progress");
    if (!playBtn || !audio) return;

    // Continuous vinyl spin, paused until music plays.
    const spinTween = gsap.to(".pod-vinyl", {
        rotate: 360,
        duration: 4,
        repeat: -1,
        ease: "none",
        paused: true,
    });

    playBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playBtn.textContent = "❚❚";
            spinTween.play();
        } else {
            audio.pause();
            playBtn.textContent = "▶";
            spinTween.pause();
        }
    });

    // Progress bar grows with scaleX (GPU) instead of width (layout).
    if (progressBar) {
        audio.addEventListener("timeupdate", () => {
            if (!audio.duration) return;
            gsap.set(progressBar, { scaleX: audio.currentTime / audio.duration });
        });
    }
}
