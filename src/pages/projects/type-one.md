---
layout: ../../layouts/ProjectLayout.astro
title: "Type One"
subtitle: "Conference website"
type: "School project"
year: "2026"
client: "Lorem ipsum"
# One line for cards (homepage): what it is.
summary: "A bold, mobile-first conference website for TYPE01 magazine."
# Tools / tech stack, shown as pills on the homepage card. Fill in, e.g. ["Figma", "Astro", "GSAP"]
# stack: []
transitionId: "project-type-one-hero"

services:
  - Typography
  - Visual Design

tags:
  - Typography
  - Visual

# Header text (right of the hero photo); the first paragraph is the lead. Inline HTML is allowed.
concept:
  - "A bold, loud and dynamic website for TYPE01's first-ever conference, designed to make people take action."
  - "TYPE01 isn't your typical design magazine: it's modern and unafraid to push the boundaries of typography and graphic design. The website had to carry that same energy. My keywords: <strong>motion, energy, dynamic, loud and strong gradients</strong>, which you can see straight away in the header."

# Header video (left), silent and looping.
heroVideo: "/images/projects/type_01/video/type1_video-web.mp4"

# Photo scroll (right column, below the header), top to bottom. size: full (default) | half | third
gallery:
  - src: "/images/projects/type1.webp"
    alt: "Type One typography poster"
  - src: "/images/projects/type_01/wireframing.webp"
    alt: "Wireframes in Figma: desktop homepage, conference program and mobile screens"
  - src: "/images/projects/type_01/website-speakers.webp"
    alt: "TYPE01 website: speakers grid with big SPEAK letters, speaker portraits and key numbers"
  - src: "/images/projects/type_01/website-program-workshops.webp"
    alt: "TYPE01 website: day program with workshop cards for Python for Designers and Cyrillic Type Design"
  - src: "/images/projects/type_01/website-program-dinner.webp"
    alt: "TYPE01 website: program card for the Official Saturday Dinner Party"
  - src: "/images/projects/type_01/website-accommodation.webp"
    alt: "TYPE01 website: accommodation section for Hotel Indigo London with a discount code"
---

<details name="chapter" open>
<summary>Why bold works</summary>

TYPE01 is all about fresh takes on design, so a minimal, safe approach wouldn't work. Instead I leaned into:

- **Typography as the hero:** the type itself becomes content, fitting for a typography conference.
- **Dynamic grids** that reflect the variety of the program: workshops, talks, exhibitions and networking.
- **Expressive compositions** that mirror the magazine's editorial style.

One look tells you: this conference is different.

</details>

<details name="chapter">
<summary>Mobile: speed and clarity</summary>

Designers on their phone want to act fast, like booking a workshop. The flow goes from a hero with "Get tickets", through the schedule and workshop booking, to speaker bios and the live stream.

- **Full-width layouts** that make the most of the small screen.
- **Large, thumb-friendly buttons** for quick actions like "Buy tickets" or "Watch live".
- **Fixed CTAs at the bottom,** so key actions are always one tap away.
- **A linear, vertical flow** with a clear hierarchy, so nobody gets lost.
- **Date filtering in the navigation:** tap between Friday workshops and Saturday talks, with a clear active state.

</details>

<details name="chapter">
<summary>Desktop: room to explore</summary>

On desktop there's room to compare schedules, browse speakers and dive into the details.

- **Multi-column grids:** schedules side by side, speakers at a glance.
- **Asymmetric, expressive layouts** that use the wide canvas, interesting but never overwhelming.
- **Typography at full scale:** bigger and more experimental, so the type becomes a showcase.
- **Hover interactions:** subtle animations on speaker cards that mobile can't offer.
- **Multiple entry points** and a fixed navigation: start from the speakers or explore freely, with plenty of ticket CTAs along the way.

</details>

<details name="chapter">
<summary>Mobile vs desktop</summary>

The same content, designed for two different moments:

- **Mobile = speed and clarity:** one column, a vertical flow and fixed CTAs for immediate action.
- **Desktop = exploration and expression:** multi-column grids for comparing, asymmetric layouts and typography at full scale.

</details>
