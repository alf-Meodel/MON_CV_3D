export type Locale = "fr" | "en";

export const NAV_ITEMS = [
    { id: "intro", title: { fr: "Accueil", en: "Home" } },
    { id: "design-1", title: { fr: "Compétences Design", en: "Design Skills" } },
    { id: "design-2", title: { fr: "Création Visuelle", en: "Visual Creation" } },
    { id: "dev-1", title: { fr: "Développement Front", en: "Front-End Development" } },
    { id: "dev-2", title: { fr: "Back & Méthodes", en: "Back-End & Methods" } },
    { id: "parcours-1", title: { fr: "Parcours Pro", en: "Professional Path" } },
    { id: "parcours-2", title: { fr: "Formations", en: "Education" } },
    { id: "experiences", title: { fr: "Autres Expériences", en: "Other Experience" } },
    { id: "interets", title: { fr: "Centres d'Intérêt", en: "Interests" } },
    { id: "langues", title: { fr: "Langues", en: "Languages" } },
    { id: "contact", title: { fr: "Contact", en: "Contact" } },
] as const;

export const COPY = {
    hero: {
        pre: { fr: "Bonjour, je suis", en: "Hello, I am" },
        design: { fr: "UX/UI Designer", en: "UX/UI Designer" },
        dev: { fr: "Développeur", en: "Developer" },
    },
    design1: {
        title: { fr: "Compétences Design", en: "Design Skills" },
        items: {
            fr: [
                "UX centrée utilisateur",
                "Maquettage Figma",
                "Design System",
                "Identités visuelles",
                "Optimisation Web",
            ],
            en: [
                "User-centered UX",
                "Figma wireframing",
                "Design System",
                "Visual identities",
                "Web optimization",
            ],
        },
    },
    design2: {
        title: { fr: "Création Visuelle", en: "Visual Creation" },
        items: {
            fr: [
                "Modélisation 3D",
                "Conception 2D / 3D",
                "Montage audio / vidéo",
                "IA génératives",
                "Captation drone",
            ],
            en: [
                "3D modeling",
                "2D / 3D design",
                "Audio / video editing",
                "Generative AI",
                "Drone capture",
            ],
        },
    },
    dev1: {
        title: { fr: "Développement Front", en: "Front-End Development" },
        items: {
            fr: ["HTML / CSS / JavaScript", "TypeScript", "React / Next.js", "Three.js / R3F", "Tailwind CSS"],
            en: ["HTML / CSS / JavaScript", "TypeScript", "React / Next.js", "Three.js / R3F", "Tailwind CSS"],
        },
    },
    dev2: {
        title: { fr: "Back & Méthodes", en: "Back-End & Methods" },
        items: {
            fr: ["Node.js / Fastify", "Pipeline CI / CD", "Tests unitaires & E2E", "MERISE / UML"],
            en: ["Node.js / Fastify", "CI / CD pipeline", "Unit & E2E testing", "MERISE / UML"],
        },
    },
    parcours1: {
        title: { fr: "Parcours Pro", en: "Professional Path" },
        items: {
            fr: [
                { year: "2024", label: "SIMPLON CDA" },
                { year: "2023", label: "Meodel Design" },
                { year: "2022", label: "Mairie de Wavrechain" },
            ],
            en: [
                { year: "2024", label: "SIMPLON CDA" },
                { year: "2023", label: "Meodel Design" },
                { year: "2022", label: "Wavrechain Town Hall" },
            ],
        },
    },
    parcours2: {
        title: { fr: "Formations", en: "Education" },
        items: {
            fr: [
                { year: "2021", label: "POPSchool UX/UI" },
                { year: "2020", label: "SVPRINT Dev Web" },
                { year: "2019", label: "POPSchool Java EE" },
            ],
            en: [
                { year: "2021", label: "POPSchool UX/UI" },
                { year: "2020", label: "SVPRINT Web Dev" },
                { year: "2019", label: "POPSchool Java EE" },
            ],
        },
    },
    experiences: {
        title: { fr: "Autres Expériences", en: "Other Experience" },
        items: {
            fr: ["Concours Infirmier", "Éducateur Spécialisé, Péruwelz", "Admin CARMI du Nord, Lens"],
            en: ["Nursing exam", "Special Educator, Péruwelz", "CARMI du Nord Admin, Lens"],
        },
    },
    interets: {
        title: { fr: "Centres d'Intérêt", en: "Interests" },
        items: {
            fr: [
                "Composition Musicale",
                "Création Audiovisuelle",
                "Marche / Vélo / Photo / Drones",
                "Nouvelles Technologies",
                "Impression 3D",
            ],
            en: [
                "Music composition",
                "Audiovisual creation",
                "Walking / Cycling / Photography / Drones",
                "New technologies",
                "3D printing",
            ],
        },
    },
    langues: {
        title: { fr: "Langues", en: "Languages" },
        items: {
            fr: ["Français — maternelle", "Anglais — intermédiaire", "Polonais — bilingue"],
            en: ["French — native", "English — intermediate", "Polish — bilingual"],
        },
    },
    contact: {
        title: { fr: "Contact", en: "Contact" },
        location: { fr: "Valenciennes, Nord", en: "Valenciennes, France" },
    },
    langToggle: {
        toEnglish: { fr: "English", en: "English" },
        toFrench: { fr: "Français", en: "Français" },
        ariaToEnglish: { fr: "Passer en anglais", en: "Switch to English" },
        ariaToFrench: { fr: "Passer en français", en: "Switch to French" },
    },
} as const;

export function t<T extends Record<Locale, string>>(entry: T, locale: Locale): string {
    return entry[locale];
}

export function tList(entry: { fr: readonly string[]; en: readonly string[] }, locale: Locale): readonly string[] {
    return entry[locale];
}
