// Order of the projects on /projects, the "01 / 06" counter on detail pages, and the
// "coming soon" projects. Each project's tile on /projects uses its own Markdown file.
export interface Project {
    title: string;
    category: string;
    year: string;
    description: string;
    image: string;
    href: string;
    /** Shared-element name so the image morphs into the detail page hero. */
    transitionName?: string;
    isUpcoming?: boolean;
}

export const projects: Project[] = [
    {
        title: "Miles & Meals",
        category: "Branding",
        year: "2026",
        description:
            "A world of flavours in every box: brand identity, packaging and digital design for a street-food meal kit.",
        image: "/images/projects/miles-meals/overview-red-box.webp",
        href: "/projects/miles-meals",
        transitionName: "project-miles-meals-hero",
    },
    {
        title: "Sounds Like Antwerp",
        category: "Web design",
        year: "2025-6",
        description:
            "Web design, UI/UX research, concepting and visual design around the sound of the city.",
        image: "/images/projects/antwerp/metro-poster.webp",
        href: "/projects/sounds-like-antwerp",
        transitionName: "project-sounds-like-antwerp-hero",
    },
    {
        title: "Type One",
        category: "Typography",
        year: "2026",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        image: "/images/projects/type1.webp",
        href: "/projects/type-one",
        transitionName: "project-type-one-hero",
    },
    {
        title: "Mountains",
        category: "Identity",
        year: "2026",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        image: "/images/projects/mountains/mountain-mock-still.webp",
        href: "/projects/mountains",
        transitionName: "project-mountains-hero",
    },
    {
        title: "Thrive",
        category: "Web design",
        year: "2026",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        image: "/images/projects/thrive/laptop-mockup.webp",
        href: "/projects/thrive",
        transitionName: "project-thrive-hero",
    },
    {
        title: "3D Shot Machine",
        category: "3D · Blender",
        year: "2026",
        description: "A playful 3D scene modelled in Blender. Work in progress.",
        image: "/images/projects/blender/blender-render.webp",
        href: "#",
        isUpcoming: true,
    },
];
