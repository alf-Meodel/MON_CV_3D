"use client";

import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/contexts/Language";
import { NAV_ITEMS, t } from "@/i18n/translations";
import { setActiveSectionIndex, useActiveSectionIndex } from "./activeSectionStore";
import { LanguageToggle } from "./LanguageToggle";
import { resolveActiveSectionIndex, scrollToSectionByIndex, type DreiScrollSync } from "./sectionScroll";

export { NAV_ITEMS };

const MOBILE_NAV_MQ = "(max-width: 767px)";

function useMobileNavLayout() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(MOBILE_NAV_MQ);
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    return isMobile;
}

/**
 * Doit rester dans <Scroll html> pour useScroll().
 * Portal vers body pour un vrai position:fixed (hors transform du scroll Drei).
 */
export function SectionNav() {
    const scroll = useScroll();
    const viewportHeight = useThree((state) => state.size.height);
    const { locale } = useLanguage();
    const activeIndex = useActiveSectionIndex();
    const isMobile = useMobileNavLayout();
    const [navExpanded, setNavExpanded] = useState(false);
    const navExpandedRef = useRef(false);
    const activeIndexRef = useRef(activeIndex);
    const navRef = useRef<HTMLElement | null>(null);
    const [mounted, setMounted] = useState(false);

    activeIndexRef.current = activeIndex;

    const setExpanded = useCallback((expanded: boolean) => {
        navExpandedRef.current = expanded;
        setNavExpanded(expanded);
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isMobile) {
            document.body.classList.remove("cv-intro-active");
            return;
        }
        document.body.classList.toggle("cv-intro-active", activeIndex === 0);
        return () => document.body.classList.remove("cv-intro-active");
    }, [activeIndex, isMobile]);

    useEffect(() => {
        if (!isMobile || !navExpanded) return;

        const collapseNav = (event: MouseEvent) => {
            const target = event.target;
            if (!(target instanceof Node)) return;
            if (navRef.current?.contains(target)) return;
            if (document.querySelector(".cv-lang-toggle")?.contains(target)) return;
            setExpanded(false);
        };

        document.addEventListener("click", collapseNav, true);
        return () => document.removeEventListener("click", collapseNav, true);
    }, [isMobile, navExpanded, setExpanded]);

    const syncActiveIndex = useCallback(() => {
        const next = resolveActiveSectionIndex(
            scroll.el,
            scroll as unknown as DreiScrollSync,
            viewportHeight
        );
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
            setActiveSectionIndex(index);
            scrollToSectionByIndex(scroll.el, index, scroll as unknown as DreiScrollSync, viewportHeight);
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        },
        [scroll, viewportHeight]
    );

    const handleMobileNavTap = useCallback(
        (index: number) => {
            if (!navExpandedRef.current) {
                setExpanded(true);
                return;
            }

            if (index === activeIndexRef.current) return;

            scrollToSection(index);
        },
        [scrollToSection, setExpanded]
    );

    const handleItemClick = useCallback(
        (index: number, event: ReactMouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();

            if (!isMobile) {
                scrollToSection(index);
                return;
            }

            handleMobileNavTap(index);
        },
        [isMobile, scrollToSection, handleMobileNavTap]
    );

    if (!mounted) return null;

    const navStateClass =
        isMobile && !navExpanded ? "cv-section-nav--collapsed" : "cv-section-nav--expanded";

    return createPortal(
        <>
            <LanguageToggle />

            <nav
                ref={navRef}
                className={`cv-section-nav ${navStateClass}`}
                aria-label={locale === "fr" ? "Navigation du CV" : "Resume navigation"}
                aria-expanded={isMobile ? navExpanded : undefined}
            >
                <ul className="cv-section-nav__list">
                    {NAV_ITEMS.map((item, index) => {
                        const title = t(item.title, locale);
                        const isActive = activeIndex === index;
                        return (
                            <li
                                key={item.id}
                                className={`cv-section-nav__row ${isActive ? "cv-section-nav__row--active" : ""}`}
                            >
                                <button
                                    type="button"
                                    onClick={(event) => handleItemClick(index, event)}
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
