"use client";  // Ce composant est aussi un composant Client

import { Scroll } from '@react-three/drei';
import React from 'react';


interface SectionProps {
    right?: boolean;
    children: React.ReactNode;
}


const Section = ({ right, children }: SectionProps) => {
    return (
        <section className={`h-screen flex flex-col justify-center p-10 ${right ? "items-end" : "items-start"} center-on-mobile`}>
            <div className="w-full md:w-3/4 lg:w-1/2 flex items-center justify-center">
                <div className="max-w-2xl md:max-w-3xl w-full">
                    <div className="bg-white/70 backdrop-blur-md rounded-lg px-8 py-12 shadow-lg">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};

export const Overlay = () => {
    return (
        <Scroll html>
            <div className="w-screen">
                {/* En-tête */}
                <Section>
                    <h1 className="font-serif font-semibold tracking-tight leading-tight text-3xl md:text-4xl">Franck LEROY - UX UI Designer & Développeur</h1>
                    <div className="mt-3 h-1 w-24 bg-teal-600 rounded"></div>
                    <h2 className="mt-6 font-semibold text-2xl md:text-3xl">Compétences Design</h2>
                    <ul className="leading-9 list-disc list-inside space-y-1">
                        <li>Conception centrée utilisateur</li>
                        <li>Maquettage sur Figma</li>
                        <li>Optimisation pour le Web</li>
                        <li>Modélisation et scènes 3D</li>
                        <li>Création d’identités visuelles (charte, déclinaisons)</li>
                        <li>Conception 2D / 3D</li>
                        <li>Design System</li>
                        <li>Montage audio et vidéo</li>
                        <li>Utilisation d’IA génératives</li>
                        <li>Captation vidéo drone</li>
                    </ul>

                </Section>


                {/* Compétences transversales */}
                <Section>
                    <h1 className="font-semibold font-serif text-2xl md:text-3xl mt-6">Compétences Développement Web</h1>
                    <ul className="leading-9 list-disc list-inside space-y-1">
                        <li>HTML / CSS / JavaScript</li>
                        <li>TypeScript</li>
                        <li>ReactJS / NextJS</li>
                        <li>Three.js / React Three Fiber</li>
                        <li>Tailwind CSS</li>
                        <li>Node.js / Fastify</li>
                        <li>Pipeline CI / CD</li>
                        <li>Tests unitaires et intégration E2E</li>
                        <li>MERISE et UML</li>
                    </ul>
                </Section>

                {/* Parcours professionnel */}
                <Section>
                    <h1 className="font-semibold font-serif text-2xl">Parcours Professionnel</h1>
                    <ul className="leading-9 list-disc list-inside space-y-1">
                        <li><b>2024 :</b> SIMPLON CDA - Formation Concepteur Développeur d’applications</li>
                        <li><b>2023 :</b> Meodel Design - Création de mon entreprise de Design Web</li>
                        <li><b>2022 :</b> Mairie de Wavrechain - Designer Web / Photographe</li>
                        <li><b>2021 :</b> POPSchool, Anzin - Formation UX/UI DESIGN</li>
                        <li><b>2020 :</b> SVPRINT, Anzin - Développeur Web</li>
                        <li><b>2019 :</b> POPSchool, Anzin - découverte du JAVA EE</li>
                    </ul>

                </Section>

                {/* Autres expériences */}
                <Section>
                    <h1 className="font-semibold font-serif text-2xl">Autres Expériences</h1>
                    <ul className="leading-9 list-disc list-inside space-y-1">
                        <li>Concours Infirmier en Candidat Libre</li>
                        <li>Éducateur Spécialisé - Au bonheur de chacun, Péruwelz</li>
                        <li>Employé administratif - CARMI du Nord, Lens</li>
                    </ul>
                </Section>

                {/* Centres d'intérêt */}
                <Section>
                    <h1 className="font-semibold font-serif text-2xl">Centres d&#39;Intérêt</h1>

                    <ul className="leading-9 list-disc list-inside space-y-1">
                        <li>Composition Musicale</li>
                        <li>Création Audiovisuelle</li>
                        <li>Marche / Vélo / Photo / Drones</li>
                        <li>Nouvelles Technologies</li>
                        <li>Impression 3D</li>
                    </ul>
                </Section>

                {/* Langues */}
                <Section>
                    <h1 className="font-semibold font-serif text-2xl">Langues</h1>
                    <ul className="leading-9 list-disc list-inside space-y-1">
                        <li>Français - Langue maternelle</li>
                        <li>Anglais - Niveau intermédiaire</li>
                        <li>Polonais - Bilingue</li>
                    </ul>
                </Section>

                {/* Coordonnées */}
                <Section>
                    <h1 className="font-semibold font-serif text-2xl">Coordonnées</h1>
                    <ul className="leading-9 list-disc list-inside space-y-1">
                        <ul className="leading-9 list-disc list-inside space-y-2">
                            <li><b>Nom :</b> Franck LEROY</li>
                            <li><b>Email : </b>
                                <a href="mailto:franck.leroy222@hotmail.fr" className="text-blue-600 hover:text-blue-800 underline hover:underline-offset-2 transition-colors">
                                    franck.leroy222@hotmail.fr
                                </a>
                            </li>
                            <li><b>Localisation :</b> Nord, Valenciennes</li>
                            <li><b>Téléphone : </b>
                                <a href="tel:+33642918304" className="text-blue-600 hover:text-blue-800 underline hover:underline-offset-2 transition-colors">
                                    06 42 91 83 04
                                </a>
                            </li>
                            <li><b>Permis :</b> Oui</li>
                        </ul>

                    </ul>
                </Section>
            </div>
        </Scroll>
    );

};
