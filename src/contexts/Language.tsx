"use client";

import { useLanguage } from "@/i18n/languageStore";
import { COPY, type Locale } from "@/i18n/translations";

export { useLanguage };

/** Évite d'importer COPY partout pour les labels du toggle. */
export function useLangToggleLabels(locale: Locale) {
    const isFrench = locale === "fr";
    return {
        label: isFrench ? COPY.langToggle.toEnglish[locale] : COPY.langToggle.toFrench[locale],
        ariaLabel: isFrench ? COPY.langToggle.ariaToEnglish[locale] : COPY.langToggle.ariaToFrench[locale],
    } as const;
}
