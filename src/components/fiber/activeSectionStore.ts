"use client";

import { useSyncExternalStore } from "react";

type Listener = () => void;

let activeIndex = 0;
const listeners = new Set<Listener>();

function emit() {
    listeners.forEach((listener) => listener());
}

export function getActiveSectionIndex(): number {
    return activeIndex;
}

export function setActiveSectionIndex(index: number) {
    if (activeIndex === index) return;
    activeIndex = index;
    emit();
}

export function subscribeActiveSectionIndex(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/** Lecture seule — index mis à jour par SectionNav. */
export function useActiveSectionIndex() {
    return useSyncExternalStore(
        subscribeActiveSectionIndex,
        getActiveSectionIndex,
        () => 0
    );
}
