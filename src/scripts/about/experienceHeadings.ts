import { ScrollTrigger } from "../gsap";

// About page: the heading of the experience group you are reading ("Experience",
// "Education") lights up in pink while that group crosses the middle of the screen.
function initExperienceHeadings() {
    document.querySelectorAll<HTMLElement>(".experience-group").forEach((group) => {
        const heading = group.querySelector<HTMLElement>(".experience-heading");
        if (!heading) return;

        ScrollTrigger.create({
            trigger: group,
            start: "top center",
            end: "bottom center",
            toggleClass: { targets: heading, className: "is-active" },
        });
    });
}

initExperienceHeadings();
