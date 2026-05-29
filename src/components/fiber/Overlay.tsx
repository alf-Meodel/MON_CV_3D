"use client";

import { Scroll } from '@react-three/drei';
import React from 'react';
import { useThree } from '@react-three/fiber';
import { useLanguage } from '@/contexts/Language';
import { COPY, t, tList } from '@/i18n/translations';
import { SectionNav } from './SectionNav';

interface SectionProps {
    id: string;
    index: number;
    right?: boolean;
    hero?: boolean;
    children: React.ReactNode;
}

const Section = ({ id, index, right, hero, children }: SectionProps) => {
    const pageHeight = useThree((state) => state.size.height);

    return (
        <section
            id={id}
            data-section-index={index}
            style={{ height: pageHeight, minHeight: pageHeight }}
            className={`flex flex-col justify-center p-6 md:p-10 ${right ? "items-end" : "items-start"} center-on-mobile`}
        >
            <div className="w-full md:w-3/4 lg:w-1/2 flex items-center justify-center">
                <div className={`w-full ${hero ? "max-w-md md:max-w-xl lg:max-w-2xl" : "max-w-md md:max-w-lg"}`}>
                    <div className={hero ? "cv-hero-card" : "cv-content-card md:px-6 md:py-7 px-5 py-6"}>
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 className="font-semibold font-serif text-xl md:text-2xl">{children}</h2>
);

const SectionList = ({ items }: { items: readonly string[] }) => (
    <ul className="mt-3 leading-7 list-disc list-inside space-y-0.5 text-sm md:text-base">
        {items.map((item) => (
            <li key={item}>{item}</li>
        ))}
    </ul>
);

const YearList = ({ items }: { items: readonly { year: string; label: string }[] }) => (
    <ul className="mt-3 leading-7 list-disc list-inside space-y-0.5 text-sm md:text-base">
        {items.map((item) => (
            <li key={`${item.year}-${item.label}`}>
                <b>{item.year} :</b> {item.label}
            </li>
        ))}
    </ul>
);

export const Overlay = () => {
    const { locale } = useLanguage();

    return (
        <Scroll html>
            <SectionNav />
            <div className="w-screen">
                <Section id="intro" index={0} hero>
                    <div className="cv-hero cv-hero--bento">
                        <div className="cv-hero__grid">
                            <div className="cv-hero__cell cv-hero__cell--name">
                                <h1 className="cv-hero__title">{t(COPY.hero.title, locale)}</h1>
                            </div>

                            <div className="cv-hero__cell cv-hero__cell--design">
                                <p className="cv-hero__cell-title cv-hero__cell-title--desktop">{t(COPY.hero.design, locale)}</p>
                                <p className="cv-hero__cell-title cv-hero__cell-title--mobile">{t(COPY.hero.designShort, locale)}</p>
                            </div>

                            <div className="cv-hero__cell cv-hero__cell--dev">
                                <p className="cv-hero__cell-title">{t(COPY.hero.dev, locale)}</p>
                            </div>
                        </div>
                    </div>
                </Section>

                <Section id="design-1" index={1}>
                    <SectionHeading>{t(COPY.design1.title, locale)}</SectionHeading>
                    <SectionList items={tList(COPY.design1.items, locale)} />
                </Section>

                <Section id="dev-1" index={2}>
                    <SectionHeading>{t(COPY.dev1.title, locale)}</SectionHeading>
                    <SectionList items={tList(COPY.dev1.items, locale)} />
                </Section>

                <Section id="dev-2" index={3}>
                    <SectionHeading>{t(COPY.dev2.title, locale)}</SectionHeading>
                    <SectionList items={tList(COPY.dev2.items, locale)} />
                </Section>

                <Section id="accompagnement" index={4}>
                    <SectionHeading>{t(COPY.design2.title, locale)}</SectionHeading>
                    <SectionList items={tList(COPY.design2.items, locale)} />
                </Section>

                <Section id="parcours-1" index={5}>
                    <SectionHeading>{t(COPY.parcours1.title, locale)}</SectionHeading>
                    <SectionList items={tList(COPY.parcours1.items, locale)} />
                </Section>

                <Section id="parcours-2" index={6}>
                    <SectionHeading>{t(COPY.parcours2.title, locale)}</SectionHeading>
                    <YearList items={COPY.parcours2.items[locale]} />
                </Section>

                <Section id="interets" index={7}>
                    <SectionHeading>{t(COPY.interets.title, locale)}</SectionHeading>
                    <SectionList items={tList(COPY.interets.items, locale)} />
                </Section>

                <Section id="langues" index={8}>
                    <SectionHeading>{t(COPY.langues.title, locale)}</SectionHeading>
                    <SectionList items={tList(COPY.langues.items, locale)} />
                </Section>

                <Section id="contact" index={9}>
                    <SectionHeading>{t(COPY.contact.title, locale)}</SectionHeading>
                    <ul className="mt-3 leading-7 list-disc list-inside space-y-0.5 text-sm md:text-base">
                        <li>
                            <a href={`mailto:${COPY.contact.email}`} className="underline hover:underline-offset-2">
                                {COPY.contact.email}
                            </a>
                        </li>
                        <li>
                            <a
                                href={COPY.contact.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:underline-offset-2"
                            >
                                {t(COPY.contact.websiteLabel, locale)}
                            </a>
                        </li>
                        <li>
                            <a href="tel:+33642918304" className="underline hover:underline-offset-2">
                                06 42 91 83 04
                            </a>
                        </li>
                        <li>{t(COPY.contact.location, locale)}</li>
                    </ul>
                </Section>
            </div>
        </Scroll>
    );
};
