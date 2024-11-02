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
                <div className="max-w-sm w-full">
                    <div className="bg-white/70 rounded-lg px-8 py-12">
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
                    <h1 className="font-semibold font-serif text-2xl">Franck Leroy - Concepteur Développeur d&#39;Application 3D</h1>
                    <p className="text-gray-500">Bienvenue sur mon portfolio</p>
                    <p className="mt-3">Compétences techniques :</p>
                    <ul className="leading-9">
                        <li>🖥️ NextJS</li>
                        <li>⚛️ ReactJS</li>
                        <li>📜 TypeScript</li>
                        <li>🎨 React Three Fiber</li>
                        <li>🧩 ThreeJS</li>
                        <li>💨 Tailwind CSS</li>
                        <li>🔄 Redux</li>
                        <li>🔥 Firebase</li>
                        <li>💾 MySQL / MongoDB</li>
                    </ul>

                </Section>


                {/* Compétences transversales */}
                <Section>
                    <h1 className="font-semibold font-serif text-2xl">💡 Compétences Transversales</h1>
                    <ul className="leading-9">
                        <li>🎨 Web Design</li>
                        <li>📐 Optimisation 3D</li>
                        <li>📅 Gestion de projets Agile</li>
                        <li>🖇️ Diagrammes UML / MERISE</li>
                        <li>📝 Création de Maquettes</li>
                        <li>🎯 Approche UX / UI</li>
                        <li>🗂️ Organisation - Trello / Jira</li>
                    </ul>
                </Section>

                {/* Parcours professionnel */}
                <Section>
                    <h1 className="font-semibold font-serif text-2xl">🏢 Parcours Professionnel</h1>
                    <ul className="leading-9">
                        <li><b>📅 2024 :</b> SIMPLON CDA - Formation Concepteur Développeur d’application</li>
                        <li><b>💼 2023 :</b> Meodel Design - Création de mon entreprise de Design Web</li>
                        <li><b>🏛️ 2022 :</b> Mairie de Wavrechain - Designer Web / Photographe</li>
                        <li><b>📘 2021 :</b> POPSchool, Anzin - Formation UX/UI DESIGN</li>
                        <li><b>🏢 2020 :</b> SVPRINT, Anzin - Développeur Web</li>
                        <li><b>📚 2019 :</b> POPSchool, Anzin - JAVA EE</li>
                    </ul>

                </Section>

                {/* Autres expériences */}
                <Section>
                    <h1 className="font-semibold font-serif text-2xl">🌍 Autres Expériences</h1>
                    <ul className="leading-9">
                        <li>📜 Concours Infirmier en Candidat Libre</li>œ
                        <li>👨‍👩‍👧 Éducateur Spécialisé - Au bonheur de chacun, Péruwelz</li>
                        <li>📞 Employé administratif - CARMI du Nord, Lens</li>
                    </ul>
                </Section>

                {/* Centres d'intérêt */}
                <Section>
                    <h1 className="font-semibold font-serif text-2xl">🎉 Centres d&#39;Intérêt</h1>

                    <ul className="leading-9">
                        <li>🎶 Composition Musicale</li>
                        <li>🎥 Création Audiovisuelle</li>
                        <li>🚶 Marche / 🚴 Vélo / 📸 Photo / 🚁 Drones</li>
                        <li>🖥️ Nouvelles Technologies</li>
                        <li>🖨️ Impression 3D</li>
                    </ul>
                </Section>

                {/* Langues */}
                <Section>
                    <h1 className="font-semibold font-serif text-2xl">🌐 Langues</h1>
                    <ul className="leading-9">
                        <li>🇫🇷 Français - Langue maternelle</li>
                        <li>🇬🇧 Anglais - Niveau intermédiaire</li>
                        <li>🇵🇱 Polonais - Bilingue</li>
                    </ul>
                </Section>

                {/* Coordonnées */}
                <Section>
                    <h1 className="font-semibold font-serif text-2xl">📞 Coordonnées</h1>
                    <ul className="leading-9">
                        <li>👤 <b>Nom :</b> Franck Leroy</li>
                        <li>📧 <b>Email :</b> franck.leroy222@hotmail.fr</li>
                        <li>📍 <b>Localisation :</b> Nord, Valenciennes</li>
                        <li>📱 <b>Téléphone :</b> 06 42 91 83 04</li>
                        <li>🚗 <b>Permis :</b> Oui</li>
                    </ul>
                </Section>
            </div>
        </Scroll>
    );

};
