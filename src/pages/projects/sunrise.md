---
layout: ../../layouts/ProjectLayout.astro
title: "Sunrise"
subtitle: "A ship that can't afford to forget"
type: "School project · Experience Design 4"
# [fill in: duration, e.g. "12 weeks, 2026"]
year: "2026"
client: "Hyperion"
# Shown at the top of the info block.
team: "Team of 3"
role: "UX researcher"
# One line for cards (homepage): what it is.
summary: "A living archive and quiz app that keep a generation ship's critical knowledge from fading."
# Tools / tech stack, shown as pills on the homepage card.
stack: ["UX research, User tesing, Wireframing"]
transitionId: "project-sunrise-hero"

services:
  - UX Research
  - Product Design
  - Usability Testing
  - Prototyping

tags:
  - UX research
  - User testing
  - Wireframig

# Header text (right of the hero photo); the first paragraph is the lead. Inline HTML is allowed.
concept:
  - "Designing a living archive that notices when a generation ship is starting to forget, and helps its crew relearn before it matters."
  - "A shared archive tracks which critical topics nobody has opened in a while. When a topic starts to fade, it sends a sensory cue to crew devices and invites them to a <strong>five-minute refresher quiz</strong>. Three testing rounds drove two iterations of both the dashboard and the app."

# Header photo (left); the card on /projects morphs into it.
heroImage: "/images/projects/sunrise/hero.webp"

# Photo scroll (right column), top to bottom. size: full (default) | half | third
# chapter: the chapter a photo belongs to (1 = the first); the photos after it follow along.
# Drop each image in at its src path and the placeholder is replaced automatically.
gallery:
  # 4. Personas
  - src: "/images/projects/sunrise/personas.webp"
    chapter: 4
    alt: "Persona overview: illustrated portraits of Morena Garcia, Rael Voss and Dano Kalé, with Morena's full profile: background, pain points, motivation and needs"
    caption: "Our three ship-born personas, with Morena's full profile."
  # 5. Design principles
  - src: "/images/projects/sunrise/principles-venn.webp"
    chapter: 5
    alt: "Venn diagram of the three principles: attentive accessibility, learning should be active and soft-skill appreciation, overlapping in critical thinking, equitable standards and freedom of speech"
    caption: "The final principles and where they overlap."
  # 7. Shape the concept
  - src: "/images/projects/sunrise/journey-map.webp"
    chapter: 7
    alt: "Emotional journey map from trigger to contribution, dipping lowest at the knowledge gap"
    placeholder: "The emotional journey map: trigger, notification, test, gap, learning, contribution."
  - src: "/images/projects/sunrise/storyboard.webp"
    alt: "Eleven storyboard panels: the archive detects a gap, a young crew member fails the test, finds Maya's entries and records a new one with her"
    caption: "The full storyboard, with the wireframes for each step. Scroll inside it to see it all."
    tall: true
  # 8. Goals, flows and architecture
  - src: "/images/projects/sunrise/user-flow.webp"
    chapter: 8
    alt: "Final user flow covering the test, postpone, fail and archive paths"
    placeholder: "Final user flow (the decision diagram covering test, postpone, fail and archive paths)."
    size: half
  - src: "/images/projects/sunrise/flowchart.webp"
    alt: "Flowchart linking the quiz app to the archive"
    placeholder: "Flowchart linking the quiz app (home → topic → quiz → result) to the archive (home → topic → detail)."
    size: half
  # 9. Prototype
  - src: "/images/projects/sunrise/lofi-sketches.webp"
    chapter: 9
    alt: "Lo-fi quiz screens and the annotated archive dashboard sketch, including the crossed-out grid version"
    caption: "First sketches of the quiz and the archive, annotated. Scroll inside it to see it all."
    tall: true
  - src: "/images/projects/sunrise/ai-output.webp"
    alt: "AI-generated dashboard screen made with Stitch or Lovable"
    caption: "AI output"
    placeholder: "One AI-generated screen (Stitch or Lovable), labelled \"AI output\"."
    size: half
  - src: "/images/projects/sunrise/own-design.webp"
    alt: "Our own Figma screen for the same task"
    caption: "Our own design"
    placeholder: "Your own screen for the same task, side by side."
    size: half
  # 10. Test
  - src: "/images/projects/sunrise/testing.webp"
    chapter: 10
    alt: "Paper prototypes of the quiz app and the archive, laid out on a table during a Wizard of Oz session"
    caption: "Round 2: the paper Wizard of Oz prototypes."
  - src: "/images/projects/sunrise/heatmap.webp"
    alt: "Eye-tracking heatmap from round 3"
    placeholder: "One eye-tracking heatmap from round 3."
  # 11. What testing changed
  - src: "/images/projects/sunrise/iteration-1.webp"
    chapter: 11
    alt: "Archive dashboard, iteration 1, with sticky-note feedback from testing"
    caption: "Iteration 1, with the feedback from testing on sticky notes."
  - src: "/images/projects/sunrise/iteration-2.webp"
    alt: "Archive dashboard, iteration 2: rehearsal requests, recent adds and the add-to-archive form"
    caption: "Iteration 2: rehearsal requests, a clear + button and the form to add knowledge."
  - src: "/images/projects/sunrise/iteration-1-phone.webp"
    alt: "Quiz app, iteration 1: the NCCL-1 home screen, postponed tests, completed tests and sensory settings"
    caption: "Quiz app, iteration 1."
  - src: "/images/projects/sunrise/iteration-2-phone.webp"
    alt: "Quiz app, iteration 2: Good morning Oona home, postponed and completed quizzes, sensory cue and tone-of-voice settings, and a quiz with feedback after every answer"
    caption: "Quiz app, iteration 2: a personal home, tone-of-voice settings and feedback after every answer."
  # 12. The final prototypes
  - src: "/images/projects/sunrise/hero.webp"
    chapter: 12
    alt: "The final archive dashboard on a laptop: Welcome in, Oona"
    caption: "The archive dashboard."
  - src: "/images/projects/sunrise/final-app.webp"
    alt: "The final quiz app on a phone: Good morning Oona"
    caption: "The personal-device app."
    size: half

# Buttons under the chapters. Paste the URLs between the quotes: a button only shows once
# its link is filled in.
links:
  - label: "Open the prototype"
    href: ""
  - label: "View on Behance"
    href: ""
---

<h3 class="chapter-group">The brief</h3>

<details name="chapter" open>
<summary>A ship that can't afford to forget</summary>

**Hyperion** asked us to explore how knowledge can be sustained across every generation of a generation ship: a closed, self-sustaining spacecraft whose journey outlasts any single human life. The people who arrive are the descendants of the people who left.

On a ship travelling for 250 years, people born on board have never seen Earth. Critical knowledge is passed on by word of mouth, gets distorted, and disappears when the people who hold it retire or die. Forgetting how to manually override a water purifier or handle an electrical fire isn't an inconvenience. It can threaten the survival of everyone on board.

Our goal was a learning system that keeps essential knowledge alive in a way that is **accessible and fair to everyone**, whatever their role or background.

</details>

<details name="chapter">
<summary>What I did on this team</summary>

[fill in: 3 to 5 bullets. Name the parts you led, not just took part in, with verbs like led, ran, designed, synthesised, facilitated. For example:]

- Led the persona research and wrote [which persona(s)]
- Ran [n] Wizard of Oz sessions and built the testing dashboard used to synthesise results
- Designed the quiz app from lo-fi sketches through iteration 2
- Facilitated the [Inversion / Bias] brainstorm

</details>

<h3 class="chapter-group">The process</h3>

<details name="chapter">
<summary>Choosing the right problem</summary>

Desk research surfaced three themes worth pursuing on a generation ship: **entertainment and sport** (how do you move your body in an enclosed space?), **health and wellness** (mental health over a lifetime in confinement) and **knowledge and education**. We chose knowledge because it is the one where failure is silent: nobody notices a gap until the moment it's needed.

We then named three outcomes the solution had to support: **anticipating problems** before they become disasters, **equity** so everyone has the same access to knowledge, and **quality** so what gets stored stays accurate and reliable.

**How might we provide continuous learning opportunities, minding equity, for all people born on the ship?**

Before generating ideas we compared five ethical frameworks (virtue, deontology, consequentialism, contract and care) and shortlisted three:

- **Deontology, rejected:** duties and universal rules leave little room for personal circumstances, which clashed with our focus on accessibility and equity.
- **Contract, rejected:** a fair distribution of responsibilities, but it treats people as participants in a system rather than focusing on their needs and vulnerabilities.
- **Care, chosen:** it centres relationships, empathy and attentiveness to others' needs. On the ship, preserving knowledge is about survival and also about caring for the wellbeing of future generations.

</details>

<details name="chapter">
<summary>Three people born on the ship</summary>

We built personas for people who have never seen Earth, each with a different relationship to knowledge: someone who holds it, someone who lacks it, and someone who adapted it.

- **Morena Garcia, 51, psychologist:** *"I have watched people fall apart in ways that were completely preventable."* She only reaches people once they come to her door, usually too late, and needs to document her knowledge before she retires.
- **Rael Voss, 21, not yet assigned:** *"I don't always know which parts of what I learned actually apply here."* Gaps only show up when something goes wrong. She needs a clear sense of what she knows versus what she still needs to learn.
- **Dano Kalé, 41, sanitation & waste:** *"The Earth-born taught me everything, but half of it needed fixing for here."* The next generation will have nobody Earth-born to learn from. He needs his adapted knowledge valued, and ways to share it without writing it all down.

**Across all three, the problem wasn't access to information. Knowledge lives in people, people leave, and nobody can tell what they've forgotten until an emergency exposes it.**

Two learning theorists shaped how we responded. **Paulo Freire** argues that education should empower people instead of passively transferring knowledge from authority figures. **Lev Vygotsky** shows that learning happens best just beyond your current ability, with support from others. Together they pushed us away from a static manual and toward something active and social.

</details>

<details name="chapter">
<summary>Principles that took three drafts</summary>

We wanted principles concrete enough to settle arguments later. Getting there took three iterations and two rounds of feedback from our coaches.

1. **Draft 1, from secondary research:** five topics (holistic skills, equality, freedom of speech, accessibility, qualitative education). Feedback: too many, too overlapping. Pick three.
2. **Draft 2, merged to three:** holistic skills, qualitative education, accessibility. Feedback: titles too vague, the *why* behind each was missing, and the differences between them were unclear.
3. **Final, three principles:**
   - **Attentive accessibility.** If someone can't access education, the problem is the system, not the person.
   - **Learning should be active.** People learn by doing and reflecting, not by receiving.
   - **Soft-skill appreciation.** Emotional, creative and ethical skills count as much as technical ones.

Where they overlap: critical thinking, equitable standards and freedom of speech.

</details>

<details name="chapter">
<summary>Diverge wide, then converge on purpose</summary>

Each of us ran two techniques, so we came at the problem from six angles:

- **To diverge:** Inversion brainstorm, Bias brainstorm, Random word association and Chili Sin Carne.
- **To converge:** a COCD box and Six Thinking Hats.

Three of them shaped the final idea most:

- **Inversion:** we designed the *worst* education system first: authoritarian, exclusive, learning as a privilege. Flipping it gave us a collaborative, lifelong system woven into daily ship life.
- **Bias brainstorm, curse of knowledge:** experts forget what it's like not to know. On the ship, critical knowledge is assumed, not taught, which became the core reason the system must actively check what people know.
- **Random word, "coral reef":** fragile, endangered, an ecosystem. Thinking of knowledge as endangered led to a device that flags a "species" of knowledge that's dying out.

We pooled every idea into a **COCD box**, voted on the ideas that best answered our HMW and clustered them into three concepts: a **skill sensor + test**, an immersive **Earth course** and a **living ship archive**. We stress-tested each with a different method (Six Thinking Hats, Speedboat, SWOT and Rose, Bud, Thorn).

**Decision: drop the Earth course and merge the other two.** A convincing immersive experience didn't fit our timeframe, and its emotional risks conflicted with *attentive accessibility*. The sensor and the archive covered each other's weaknesses: the archive gives the quiz a source of truth, and the quiz stops the archive from becoming a graveyard nobody opens.

</details>

<details name="chapter">
<summary>How Sunrise works</summary>

Anyone on board can add knowledge, experiences and improvements to the archive. The archive tracks which topics marked as critical are still being opened. When one goes untouched too long, it sends a sensory cue (vibration, sound or a visual pulse, chosen by each person) to crew devices. People take a five-minute refresher. If they don't know the answers, the app sends them back to the archive to relearn, and they can add what they know.

The journey map exposed the riskiest moment: **the gap**, when someone fails a test about something they were supposed to know. Much of our later design work (tone of voice, feedback after every answer, framing results as a shared responsibility rather than a personal failure) was about making that dip shallower.

**Storyboard:** the archive notices nobody has opened the manual water-override topic in over two years. A young crew member gets the cue, takes the test and realises he doesn't know the answers. The entries are old and all written by Maya, 74, who still works in his section. She demonstrates the override live, and together they record a new entry in her voice.

</details>

<details name="chapter">
<summary>Goals, flows and architecture</summary>

We split goals into **individual** (feel capable, be heard, not be embarrassed or left behind) and **community** (keep the mission alive, fix gaps fast, stay ready for emergencies). Every flow had to serve both.

The everyday contribution flow we settled on after several iterations: someone learns a trick or fix → opens the archive → fills in a short form (title, type, tags, media) → previews and saves → gets linked topics → others discover and reuse it.

</details>

<details name="chapter">
<summary>Messy sketches first</summary>

Our first wireframes were rough on purpose. We annotated them heavily so we could argue about features rather than pixels: a star for favourite entries, a colour showing how "healthy" the archive's knowledge is, a short time estimate so the test feels manageable, and accessibility settings right before the quiz starts. We scrapped an early grid layout for the archive because every card looked equally important.

**An experiment with AI prototyping.** We generated dashboard and quiz prototypes with Stitch and Lovable. The results looked polished: dark sci-fi consoles, telemetry, countdown warnings, "initiate purge" buttons. From a user's point of view they were overwhelming. High-pressure language worked against *attentive accessibility*, and dense dashboards worked against *active learning*. They were useful as a quick first look, but we went back to designing our own screens in Figma, guided by the principles and by testing.

</details>

<details name="chapter">
<summary>Testing a system nobody can live in yet</summary>

Our users don't exist yet, and neither does the ship. That ruled out several standard methods, so we chose deliberately:

- **Used:** Wizard of Oz (to fake the sensor, notifications and device behaviour), eye tracking (where attention actually goes) and Buy a Feature (what testers really prioritise).
- **Ruled out:** reliability testing (you can't test 200 years), guerrilla testing (the ship context needs too much explanation), online tools, The Mom Test (nobody has real-life experience of this world) and fake doors.

We wrote eight tasks, each with an explicit **success** and **failure** signal, and dropped two: one tested a "lockdown" that stopped people leaving a test, which conflicted with our principles. Testers played a nurse born on the ship, working through one scripted scenario from setting their sensory cue to "buying" the features they valued most.

1. **Buy a Feature**, with classmates: surfaced confusion about the basics and concerns about who can edit the archive.
2. **Wizard of Oz, paper:** one tester at a time, logged in a per-tester dashboard and merged into a combined summary.
3. **Wizard of Oz, digital + eye tracking:** Figma prototypes with heatmaps and fixation order per screen, focused on hierarchy, clarity and findability.

[fill in: how many testers per round, who they were, and any task success rates, times or a quote that stuck with you.]

</details>

<details name="chapter">
<summary>What testing changed</summary>

Each finding maps to a change in the next iteration.

**Archive dashboard**

- Settings and icons were confusing → repositioned settings, clearer iconography, language switch moved out of the main view.
- The "critical" button wasn't understood → a single, clear "+" button for adding knowledge.
- Walking to a separate archive room to add something felt like too much effort → contribute directly from any entry's detail page.
- Concern that anyone could add anything → voting on helpful comments and independent review instead of deletion.
- No sense of what to rehearse next → home split into critical topics and recent adds; crew can vote on topics to rehearse.

**Quiz app**

- Postponing a test took too many steps → a postpone button in the notification itself.
- No feedback until the end of the quiz → immediate feedback after every answer.
- "1 day left" didn't feel urgent → state the consequence: you'll lose your verification status.
- One tone of voice didn't suit everyone → choose formal, soft, neutral, motivating or narrative messaging.
- Testers saw a technical tool and missed the emotional stakes → Oona's story, to show why forgetting matters.

</details>

<h3 class="chapter-group">The final result</h3>

<details name="chapter">
<summary>The final prototypes</summary>

Two connected products: an **archive dashboard** where crew browse, search and contribute knowledge, and a **personal-device app** that delivers cues, refresher quizzes and results, with sensory and tone preferences each person controls.

</details>

<details name="chapter">
<summary>What I'd take into the next project</summary>

[draft: rewrite in your own voice and keep what's true for you]

**What worked:** agreeing on principles early gave us a fast way to settle disagreements, like dropping the Earth course and the lockdown task. Writing success and failure criteria before testing made synthesis much quicker.

**What I'd do differently:** test with people closer to our personas (nurses or shift workers in isolated jobs) instead of mostly classmates, measure task success and time per task so iterations can be compared with numbers, and test notification fatigue over several days instead of a single session.

**The biggest lesson:** a polished interface isn't the same as a usable one. The AI prototypes showed that clearly. Our own, plainer screens worked better because every element could be traced back to a principle and a test.

</details>
