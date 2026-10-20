---
layout: ../../layouts/ProjectLayout.astro
title: "Type One"
subtitle: "Conference website"
type: "School project"
year: "2026"
client: "TYPE01 Magazine (school project)"
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
  - Web design

# Header text (right of the hero photo); the first paragraph is the lead. Inline HTML is allowed.
concept:
  - "A bold, loud and dynamic website for TYPE01's first-ever conference, designed to make people take action."
  - "TYPE01 isn't your typical design magazine: it's modern and unafraid to push the boundaries of typography and graphic design. The website had to carry that same energy. My keywords: <strong>motion, energy, dynamic, loud and strong gradients</strong>, which you can see straight away in the header."

# Header video (left), silent and looping.
heroVideo: "/images/projects/type_01/video/type1_video-web.mp4"

# Photo scroll (right column, below the header), top to bottom. size: full (default) | half | third
# chapter: the chapter a photo belongs to (1 = the first); the photos after it follow along.
gallery:
  # 1. Why bold works
  - src: "/images/projects/type1.webp"
    chapter: 1
    alt: "Type One typography poster"
  # 2. Exploration & wireframing
  - src: "/images/projects/type_01/exploration2.webp"
    chapter: 2
    alt: "Figma canvas with a moodboard (bold typography, bright colour, experimental gradients, keywords like loud, acid and electric) next to the first homepage versions in pink and lilac"
    caption: "Moodboard and first directions: loud, bright and anti-minimal."
  - src: "/images/projects/type_01/exploration1.webp"
    alt: "Figma canvas with many iterations of the TYPE01 homepage in black, lime, pink and blue, each with the big SPEAKERS letter grid"
    caption: "Round after round of homepage versions, pushing the SPEAKERS grid and the colours."
  - src: "/images/projects/type_01/wireframing.webp"
    alt: "Wireframes in Figma: desktop homepage, conference program and mobile screens"
    caption: "Wireframes for desktop and mobile."
  # 3. Mobile: speed and clarity
  - src: "/images/projects/type_01/mobile-mockup.webp"
    chapter: 3
    alt: "Four mobile screens of the TYPE01 website: the agenda, a workshop card with a Book button, the day program with filters and the ticket prices, each with a fixed Ticket here button at the bottom"
    caption: "The mobile flow: agenda, workshops, program and tickets, with the ticket button always in reach."
  # 4. Desktop: room to explore
  - src: "/images/projects/type_01/website-speakers.webp"
    chapter: 4
    alt: "TYPE01 website: speakers grid with big SPEAK letters, speaker portraits and key numbers"
  - src: "/images/projects/type_01/website-program-workshops.webp"
    alt: "TYPE01 website: day program with workshop cards for Python for Designers and Cyrillic Type Design"
  # 5. Mobile vs desktop
  - src: "/images/projects/type_01/website-program-dinner.webp"
    chapter: 5
    alt: "TYPE01 website: program card for the Official Saturday Dinner Party"
  - src: "/images/projects/type_01/website-accommodation.webp"
    alt: "TYPE01 website: accommodation section for Hotel Indigo London with a discount code"

# Buttons under the chapters. Paste the URL between the quotes: the button only shows
# once its link is filled in.
links:
  - label: "Mobile prototype"
    href: "https://www.figma.com/proto/z8q4CFKHUFakbDw5ZdO3U2/TYPE01?node-id=821-3367&viewport=-40%2C47%2C0.27&t=SCJqcYZKlWNuV09R-1&scaling=min-zoom&content-scaling=fixed&page-id=784%3A2879"
  - label: "Desktop prototype"
    href: "https://www.figma.com/proto/z8q4CFKHUFakbDw5ZdO3U2/TYPE01?node-id=784-1483&viewport=205%2C245%2C0.07&t=DFnphE3JS8o6E18i-1&scaling=min-zoom&content-scaling=fixed&page-id=265%3A860"
---

<details name="chapter" open>
<summary>Why bold works</summary>

TYPE01 is all about fresh takes on design, so a minimal, safe approach wouldn't work. Instead I leaned into:

- **Typography as the hero:** the type itself becomes content, fitting for a typography conference.
- **Dynamic grids** that reflect the variety of the program: workshops, talks, exhibitions and networking.
- **Expressive compositions** that mirror the magazine's editorial style.

One look tells you: this conference is different.

</details>

<h3 class="chapter-group">The process</h3>

<details name="chapter">
<summary>Exploration &amp; wireframing</summary>

I started wide: a moodboard full of **bold typography, bright colour and experimental gradients**, with keywords like loud, acid, electric and anti-minimal.

From there I explored round after round of homepage directions in Figma, testing colour combinations and pushing the big SPEAKERS letter grid until it felt as loud as the magazine. In parallel I wireframed the structure for desktop and mobile, so the bold look always sat on a clear layout.

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

<details name="chapter">
<summary>Reflection</summary>

**What I learned:** Designing for mobile and desktop isn't about squeezing the same layout onto a smaller screen. Both have a very different purpose: on a phone, visitors want to find the programme or buy a ticket quickly, while on desktop there's room to explore and to let the bold typography do the talking. So each one needs its own design decisions, not just the main layout principles carried over.

</details>
