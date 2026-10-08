---
# Template for a project detail page. Copy this file to <project-slug>.md and fill it in.
# (Files starting with "_" are not turned into pages.) Also add the project to src/data/projects.ts
# with href "/projects/<project-slug>" and transitionName equal to the transitionId below.
layout: ../../layouts/ProjectLayout.astro
title: "Project title"
subtitle: "Lorem ipsum dolor sit amet."
type: "School project"
year: "2026"
client: "Lorem ipsum"
# One line for cards (homepage): what it is.
summary: "Lorem ipsum dolor sit amet."
# Your role and the tools / tech stack (role shows in the info block and on homepage cards).
# role: "Visual designer"
# stack: ["Figma", "Astro"]
transitionId: "project-<project-slug>-hero"

services:
  - Lorem
  - Ipsum

tags:
  - Lorem
  - Ipsum

# Header text (right of the hero photo); the first paragraph is the lead. Inline HTML is allowed.
concept:
  - "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
  - "Ut enim ad minim veniam, quis nostrud <strong>exercitation ullamco laboris</strong> nisi ut aliquip ex ea commodo consequat."

# Header photo (left); the card on /projects morphs into it.
heroImage: "/images/projects/<project-slug>/hero.webp"
# Optional: a silent looping video instead of the photo (heroImage then serves as its poster).
# heroVideo: "/images/projects/<project-slug>/hero.mp4"

# Photo scroll (right column, below the header), top to bottom. size: full (default) | half | third
# A .mp4/.webm/.mov src becomes a silent looping video (with controls to turn the sound on).
gallery:
  - src: "/images/projects/<project-slug>/photo-1.webp"
    alt: "Describe the photo"
  - src: "/images/projects/<project-slug>/photo-2.webp"
    alt: "Describe the photo"
    caption: "Optional caption."
    size: half
  - src: "/images/projects/<project-slug>/photo-3.webp"
    alt: "Describe the photo"
    size: half

# Optional buttons under the chapters.
# links:
#   - label: "Visit website"
#     href: "https://example.com"
---

<details name="chapter" open>
<summary>The idea</summary>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

</details>

<details name="chapter">
<summary>Visual language</summary>

Lorem ipsum dolor sit amet, **consectetur adipiscing elit**, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

</details>

<details name="chapter">
<summary>The brand</summary>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

</details>

<details name="chapter">
<summary>The experience</summary>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

</details>
