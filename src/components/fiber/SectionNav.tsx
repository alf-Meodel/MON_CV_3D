"use client";

import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/contexts/Language";
import { NAV_ITEMS, t } from "@/i18n/translations";
import { setActiveSectionIndex } from "./activeSectionStore";
import { LanguageToggle } from "./LanguageToggle";
import { resolveActiveSectionIndex, scrollToSectionByIndex, type DreiScrollSync } from "./sectionScroll";

export { NAV_ITEMS };

/**
 * Doit rester dans <Scroll html> pour useScroll().
 * Portal vers body pour un vrai position:fixed (hors transform du scroll Drei).
 */
export function SectionNav() {
    const scroll = useScroll();
    const viewportHeight = useThree((state) => state.size.height);
    const { locale } = useLanguage();
    const [activeIndex, setActiveIndexLocal] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const syncActiveIndex = useCallback(() => {
        const next = resolveActiveSectionIndex(
            scroll.el,
            scroll as unknown as DreiScrollSync,
            viewportHeight
        );
        setActiveIndexLocal((prev) => (prev === next ? prev : next));
        setActiveSectionIndex(next);
    }, [scroll, viewportHeight]);

    useEffect(() => {
        const el = scroll.el;
        if (!el) return;

        el.addEventListener("scroll", syncActiveIndex, { passive: true });
        syncActiveIndex();

        return () => el.removeEventListener("scroll", syncActiveIndex);
    }, [scroll.el, syncActiveIndex]);

    useFrame(syncActiveIndex);

    const scrollToSection = useCallback(
        (index: number) => {
            if (!scroll.el) return;
            setActiveIndexLocal(index);
            setActiveSectionIndex(index);
            scrollToSectionByIndex(scroll.el, index, scroll as unknown as DreiScrollSync, viewportHeight);
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        },
        [scroll, viewportHeight]
    );

    const handleNavPointerUp = useCallback((event: PointerEvent<HTMLButtonElement>) => {
        event.currentTarget.blur();
    }, []);

    if (!mounted) return null;

    return createPortal(
        <>
            <LanguageToggle />

            <nav className="cv-section-nav" aria-label={locale === "fr" ? "Navigation du CV" : "CV navigation"}>
                <ul className="cv-section-nav__list">
                    {NAV_ITEMS.map((item, index) => {
                        const title = t(item.title, locale);
                        const isActive = activeIndex === index;
                        return (
                        <li key={item.id} className="cv-section-nav__row">
                            <button
                                type="button"
                                onClick={() => scrollToSection(index)}
                                onPointerUp={handleNavPointerUp}
                                className={`cv-section-nav__item ${isActive ? "cv-section-nav__item--active" : ""}`}
                                data-nav-active={isActive ? "true" : "false"}
                                aria-label={title}
                                aria-current={isActive ? "true" : undefined}
                            >
                                <span className="cv-section-nav__label">{title}</span>
                                <span className="cv-section-nav__ring">
                                    <span className="cv-section-nav__fill" />
                                </span>
                            </button>
                        </li>
                        );
                    })}
                    </ul>
            </nav>
        </>,
        document.body
    );
}
