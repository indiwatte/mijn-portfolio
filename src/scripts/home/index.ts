// Entry point for the homepage: each concern lives in its own file under this folder.
// Shared behaviour (cursor, footer reveal) is loaded by the components in BaseLayout.
import { initHeroText } from "./heroText";
import { initHeroScroll } from "./heroScroll";
import { initHeroWater } from "./heroWater";
import { initProjectsGallery } from "./projectsGallery";
import { initScrollPath } from "./scrollPath";
import { initMarkers } from "../markers";

initHeroText();
initHeroWater();
initHeroScroll();
initProjectsGallery();
initScrollPath();
initMarkers();
