"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "./translations";

const STORAGE_KEY = "cv-locale";

type Listener = () => void;

let locale: Locale = "fr";
let hydrated = false;
const listeners = new Set<Listener>();

function persist(next: Locale) {
    if (typeof document !== "undefined") {
        document.documentElement.lang = next;
    }
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, next);
    }
}

/** Charge la préférence sauvegardée (safe côté client). */
export function initLanguageStore() {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "fr" || stored === "en") {
        locale = stored;
        persist(locale);
    }
}

function emit() {
    listeners.forEach((listener) => listener());
}

export function getLocale(): Locale {
    return locale;
}

export function setLocale(next: Locale) {
    initLanguageStore();
    if (locale === next) return;
    locale = next;
    persist(next);
    emit();
}

export function toggleLocale() {
    setLocale(locale === "fr" ? "en" : "fr");
}

export function subscribeLocale(listener: Listener) {
    initLanguageStore();
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/** Store partagé — fonctionne hors du Context React (Scroll html Drei, portails, Canvas R3F). */
export function useLanguage() {
    const currentLocale = useSyncExternalStore(
        subscribeLocale,
        getLocale,
        () => "fr" as Locale
    );

    return {
        locale: currentLocale,
        setLocale,
        toggleLocale,
    };
}
