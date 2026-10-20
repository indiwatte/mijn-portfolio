// Order of the projects on /projects, the "01 / 06" counter on detail pages, and the
// "coming soon" projects. Each project's tile on /projects uses its own Markdown file.
export interface Project {
    title: string;
    category: string;
    year: string;
    description: string;
    /** Optional for "coming soon" projects: without it the tile shows a coloured block. */
    image?: string;
    href: string;
    /** Shared-element name so the image morphs into the detail page hero. */
    transitionName?: string;
    /** Background behind the image on /projects: a light shade of the mockup's main colour. */
    tint?: string;
    isUpcoming?: boolean;
}

export const projects: Project[] = [

    {
        title: "Sounds Like Antwerp",
        category: "Web design",
        year: "2025-6",
        description:
            "Web design, UI/UX research, concepting and visual design around the sound of the city.",
        image: "/images/projects/antwerp/metro-poster.webp",
        href: "/projects/sounds-like-antwerp",
        tint: "#e2e4fb",
        transitionName: "project-sounds-like-antwerp-hero",
    },
    {
        title: "Miles & Meals",
        category: "Branding",
        year: "2026",
        description:
            "A world of flavours in every box: brand identity, packaging and digital design for a street-food meal kit.",
        image: "/images/projects/miles-meals/overview-red-box.webp",
        href: "/projects/miles-meals",
        tint: "#cfe3d2",
        transitionName: "project-miles-meals-hero",
    },

    {
        title: "Type One",
        category: "Typography",
        year: "2026",
        description: "A bold, mobile-first conference website for TYPE01 magazine.",
        image: "/images/projects/type1.webp",
        href: "/projects/type-one",
        tint: "#f1f7b0",
        transitionName: "project-type-one-hero",
    },
    {
        title: "Rooster Rojo",
        category: "3D · Blender",
        year: "2026",
        description: "A 3D tequila factory in Blender, built as the header of Rooster Rojo's website.",
        image: "/images/projects/blender/rooster-header.webp",
        href: "/projects/rooster-rojo",
        tint: "#fde3e4",
        transitionName: "project-rooster-rojo-hero",
    },
    {
        title: "Interactive hiking experience",
        category: "Creative coding",
        year: "2025",
        description: "An interactive hiking experience you play with your own body and voice.",
        image: "/images/projects/mountains/mountain-mock-still.webp",
        href: "/projects/mountains",
        tint: "#f9d0e1",
        transitionName: "project-mountains-hero",
    },
    {
        title: "Sunrise",
        category: "UX research",
        year: "2026",
        description:
            "A living archive that notices when a generation ship starts to forget, and helps its crew relearn before it matters.",
        href: "/projects/sunrise",
        tint: "#ffe2c7",
        transitionName: "project-sunrise-hero",
    },
];
