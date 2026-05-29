"use client";

import { useScroll } from "@react-three/drei";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/contexts/Language";
import { NAV_ITEMS, t } from "@/i18n/translations";
import { LanguageToggle } from "./LanguageToggle";
import { measureActiveSectionIndex, scrollToSectionByIndex } from "./sectionScroll";

export { NAV_ITEMS };

/**
 * Doit rester dans <Scroll html> pour useScroll().
 * Portal vers body pour un vrai position:fixed (hors transform du scroll Drei).
 */
export function SectionNav() {
    const scroll = useScroll();
    const { locale } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const el = scroll.el;
        if (!el) return;

        let raf = 0;

        const updateActive = () => {
            setActiveIndex((prev) => {
                const next = measureActiveSectionIndex(el);
                return prev === next ? prev : next;
            });
        };

        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(updateActive);
        };

        updateActive();
        el.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        window.visualViewport?.addEventListener("resize", onScroll);

        return () => {
            cancelAnimationFrame(raf);
            el.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            window.visualViewport?.removeEventListener("resize", onScroll);
        };
    }, [scroll.el]);

    const scrollToSection = useCallback(
        (index: number) => {
            if (!scroll.el) return;
            scrollToSectionByIndex(scroll.el, index);
        },
        [scroll.el]
    );

    if (!mounted) return null;

    return createPortal(
        <>
            <LanguageToggle />

            <div className="cv-section-title" aria-live="polite">
                <div className="cv-glass-ribbon cv-section-title__ribbon" key={`${locale}-${NAV_ITEMS[activeIndex].id}`}>
                    <span className="cv-section-title__text">{t(NAV_ITEMS[activeIndex].title, locale)}</span>
                </div>
            </div>

            <nav className="cv-section-nav" aria-label={locale === "fr" ? "Navigation du CV" : "CV navigation"}>
                <div className="cv-section-nav__panel">
                    <ul className="cv-section-nav__list">
                    {NAV_ITEMS.map((item, index) => {
                        const title = t(item.title, locale);
                        return (
                        <li
                            key={item.id}
                            className={`cv-section-nav__row cv-section-nav__row--${index % 2 === 0 ? "out" : "in"}`}
                        >
                            <button
                                type="button"
                                onClick={() => scrollToSection(index)}
                                className={`cv-section-nav__item ${activeIndex === index ? "cv-section-nav__item--active" : ""}`}
                                aria-label={title}
                                aria-current={activeIndex === index ? "true" : undefined}
                            >
                                <span className="cv-section-nav__ring">
                                    <span className="cv-section-nav__fill" />
                                </span>
                            </button>
                        </li>
                        );
                    })}
                    </ul>
                </div>
            </nav>
        </>,
        document.body
    );
}
