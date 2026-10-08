---
layout: ../../layouts/ProjectLayout.astro
title: "Sounds Like Antwerp"
subtitle: "Turning city data into sound"
type: "School project"
year: "2026"
client: "Visit Antwerp"
# Shown at the top of the info block.
team: "Team of 4"
role: "Visual Design lead"
# One line for cards (homepage): what it is.
summary: "A website that turns Antwerp's live city data into music, for Visit Antwerp."
# Tools / tech stack, shown as pills on the homepage card. Fill in, e.g. ["Figma", "Astro", "GSAP"]
# stack: []
transitionId: "project-sounds-like-antwerp-hero"

services:
  - Web Design
  - UI/UX Research
  - Concepting
  - Visual Design

tags:
  - Web design
  - UI/UX
  - Visual

# Header text (right of the hero photo); the first paragraph is the lead. Inline HTML is allowed.
concept:
  - "For Visit Antwerp, our team of four developed Sounds Like Antwerp, a digital experience that lets you discover the city through sound."
  - "Using live data and the unique energy of different neighbourhoods, Antwerp is transformed into music. Instead of following another typical city guide, visitors can listen to the city, explore its rhythm and create their own Sound of Antwerp."

# Header photo (left); the card on /projects morphs into it.
heroImage: "/images/projects/antwerp/laptop-mockup.webp"

# Photo scroll (right column, below the header), top to bottom. size: full (default) | half | third
gallery:
  - src: "/images/projects/antwerp/grouppic.jpg"
    alt: "The four team members in front of the projected Sounds Like Antwerp website"
    caption: "The team at the final presentation."
  - src: "/images/projects/antwerp/process.MP4"
    alt: "The team brainstorming at a whiteboard: why, how, what, problem, concept, target audience and pain points"
    caption: "Process: brainstorming from the problem and the target audience's pain points to the concept."
  - src: "/images/projects/antwerp/metro-poster.webp"
    alt: "Sounds Like Antwerp poster in a metro station"
    caption: "Campaign poster: make your own music at soundslikeantwerp.be."
  - src: "/images/projects/antwerp/website-home.webp"
    alt: "Home page: Hear the sounds of Antwerp"
  - src: "/images/projects/antwerp/website-neighbourhood-map.webp"
    alt: "Neighbourhood map with live traffic, noise, crowd and heat data"
    caption: "Pick a neighbourhood on the map to hear its live data."
  - src: "/images/projects/antwerp/website-sound-builder.webp"
    alt: "Sound builder connecting city sensors to instruments"
    caption: "The sound builder: connect live city sensors to instruments."
  - src: "/images/projects/antwerp/website-your-sound.webp"
    alt: "Result screen: This is your sound of Antwerp"
  - src: "/images/projects/antwerp/website-events.webp"
    alt: "Events overview: What's on in Antwerp"
  - src: "/images/projects/antwerp/video_antwerp.mp4"
    alt: "Screen recording of the Sounds Like Antwerp experience"
    caption: "Demo of the experience."

# Buttons under the chapters. Paste the URLs between the quotes: a button only shows once
# its link is filled in.
links:
  - label: "Visit project"
    href: ""
  - label: "Figma process"
    href: "https://www.figma.com/board/nxJT4IDezHBYjiw2muusCk/INT4---Visit-Antwerp---FigJam?node-id=67-1171&t=7H1ltylYbgEb48AW-0"
  - label: "UX case on Behance"
    href: "https://www.behance.net/gallery/250907007/Sounds-like-Antwerp"
---

<details name="chapter" open>
<summary>Collaborators</summary>

- **Abdulhalim Yalcinkaya:** Team Lead
- **Agata Tomaszewska:** Developer
- **Indi Watté:** Visual Designer
- **Luna Ben Elfkih:** UX Designer

</details>

<details name="chapter">
<summary>The problem</summary>

Young urban travellers don't find Antwerp relevant. They know it exists, but nothing has made them feel it was made for them. The city's most interesting qualities are invisible in conventional tourism content.

**Research question:** how might we reshape the perception of Antwerp for young urban travellers, from "Go to Antwerp? No thanks!" to a vibrant, must-visit destination?

</details>

<details name="chapter">
<summary>Research</summary>

[Fill in how you got to the question: who you talked to and how. For example: "We surveyed 30 students aged 18–25 and interviewed 5 of them", competitor analysis of other city guides, personas. One or two sentences is enough.]

</details>

<details name="chapter">
<summary>The concept</summary>

A digital-first platform that lets the city speak for itself. Sounds Like Antwerp turns Antwerp's real sensor data into generative music and art, so anyone can experience the city before setting foot in it, and feel part of it.

You pick a neighbourhood on a map of Antwerp, open the sound builder and connect the city's live sensors to instruments. Save your sound, share it, and find out what's on in that part of the city.

</details>

<details name="chapter">
<summary>Visual language</summary>

Starting from Visit Antwerp’s youth branding, I kept the city fonts and narrowed the 9-colour palette down to acid lime, black and electric blue, the colours closest to the underground rave scene. Pixel fonts, dither effects and grain turn documentary photos of the city into fragmented data. It’s recognisably Antwerp, but raw, experimental and made for a younger crowd.

</details>

<details name="chapter">
<summary>Technology</summary>

Each neighbourhood has live readings from Antwerp's city sensors: **noise, traffic, crowds, events and heat**, each as a value between 0 and 1 (Central Station at a quiet moment: noise 0.28, traffic 0.24, crowd 0.51).

In the sound builder you connect a sensor to an instrument (drums, bass guitar, electric guitar, synth lead or synth pad), and its live value drives that instrument. Gain, pitch and tempo (BPM) let you shape the result, so the soundtrack changes with where and when you listen.

Built with: [fill in the tools, e.g. Web Audio API / Tone.js, p5.js, Webflow, and the city data source you used].

</details>

<details name="chapter">
<summary>Results & reflection</summary>

Sounds Like Antwerp is a proof of concept for Visit Antwerp, focused on the idea, the interaction and whether it's feasible, rather than a production-ready platform.

**Feedback:** Visit Antwerp was enthusiastic about Sounds Like Antwerp and showed real interest in the concept. They saw strong potential in taking the prototype further towards a full realisation.

**What I learned:** As my first real client project, this was an exciting step. It showed me how projects work in the industry and how important planning and clear communication are. As the visual designer, I worked closely with the team to validate design choices and support the developers in bringing the visuals to life. The part I enjoyed most was translating Visit Antwerp’s existing branding into our own campaign identity, giving it a rave-inspired twist that speaks directly to young urban travellers.
</details>
