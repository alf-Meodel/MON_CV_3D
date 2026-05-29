"use client";

import { useLangToggleLabels, useLanguage } from "@/contexts/Language";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FlagIcon } from "./FlagIcon";

export function LanguageToggle() {
    const { locale, toggleLocale } = useLanguage();
    const { label, ariaLabel } = useLangToggleLabels(locale);
    const isFrench = locale === "fr";
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="cv-lang-toggle">
            <button
                type="button"
                className={`cv-glass-ribbon cv-lang-toggle__btn ${isFrench ? "cv-lang-toggle__btn--to-en" : "cv-lang-toggle__btn--to-fr"}`}
                onClick={toggleLocale}
                aria-label={ariaLabel}
            >
                {!isFrench && <FlagIcon code="fr" className="cv-lang-toggle__flag" />}
                <span className="cv-lang-toggle__label">{label}</span>
                {isFrench && <FlagIcon code="gb" className="cv-lang-toggle__flag" />}
            </button>
        </div>,
        document.body
    );
}
