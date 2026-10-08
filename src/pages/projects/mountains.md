---
layout: ../../layouts/ProjectLayout.astro
title: "Hiking in the alps"
subtitle: "digital interactive experience"
type: "School project"
year: "2025"
# One line for cards (homepage): what it is.
summary: "An interactive hiking experience you play with your own body and voice."
# Tools / tech stack, shown as pills on the homepage card.
stack: ["ml5.js", "GSAP"]
transitionId: "project-mountains-hero"

services:
  - Visual Identity
  - Art Direction

tags:
  - Identity
  - Visual

# Header text (right of the hero photo); the first paragraph is the lead. Inline HTML is allowed.
concept:
  - "Surviving the Alps: an interactive experience where you become an expert hiker by reliving my memories of the Austrian Alps."
  - "Through <strong>voice, gesture and animation</strong> you move, react and learn. Small challenges bring back the tension, the exhaustion and the satisfaction of a real hike: from packing your bag, through the chaos of a storm, to the peace at the peak."

# Header video (left), silent and looping.
heroVideo: "/images/projects/mountains/mountain-mock-web.mp4"

# Photo scroll (right column, below the header), top to bottom. size: full (default) | half | third
# A .mp4/.webm/.mov src becomes a silent looping video (with controls to turn the sound on).
gallery:
  - src: "/images/projects/mountains/mountains-header.webp"
    alt: "Mountains header artwork"
  - src: "/images/projects/mountains/storyboard.webp"
    alt: "Storyboard for the digital experience of becoming an expert hiker, in five steps from the valley to the top"
  - src: "/images/projects/mountains/interaction-packing.webp"
    alt: "Interaction: drag and drop hiking gear like a compass, rope and boots into the backpack"
---

<details name="chapter" open>
<summary>The idea</summary>

Theme: **memory, nature and survival.** You learn to hike by making the right choices, reading nature's moods and feeling how unpredictable and powerful it can be.

The experience isn't only nostalgic: it's informative and encouraging too, with real tips that might make you want to start hiking yourself.

</details>

<details name="chapter">
<summary>Why it matters</summary>

From the age of ten to seventeen, I spent every summer with my dad and sister in **St. Anton am Arlberg**, in the Austrian Alps. Cowbells echoing through the valleys, fresh milk, long hikes, swimming lakes and that deep satisfaction after a day of walking.

One memory stands out: my first really long hike to a snowy summit. Planning routes, taking wrong turns, learning to be patient with each other's pace, wanting to quit and feeling happy at the same time. We got caught in mountain storms, with thunder rolling through the forest and lightning lighting up the path.

Those summers grew my love for the mountains. I still feel at home there, and this project lets others step inside that story.

</details>

<details name="chapter">
<summary>The journey</summary>

The experience follows the storyboard in five steps:

1. **Arrival in the valley:** you're welcomed into the Austrian Alps.
2. **Preparing for the hike:** pack your backpack with the right gear by dragging and dropping it in.
3. **The climb:** walk along with your own movement to keep climbing.
4. **The first storm:** the weather turns; protect yourself before the lightning strikes.
5. **Reaching the top:** the storm has passed. Take a deep breath and relax.

</details>

<details name="chapter">
<summary>Technical</summary>

The experience combines **ml5.js** machine learning models with **GSAP** animation.

ml5.js runs in the browser and uses the webcam and microphone, so your body and voice become the controller: the experience recognises your gestures and voice and reacts to them. GSAP brings the mountains to life, with the animations, transitions and the build-up of the storm reacting to what you do.

</details>
