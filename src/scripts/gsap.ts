// Single place that registers the GSAP plugins, so every module shares one instance.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Mobile browsers resize the viewport when the address bar shows/hides; don't
// recalculate every trigger (and re-layout every pin) for that.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
