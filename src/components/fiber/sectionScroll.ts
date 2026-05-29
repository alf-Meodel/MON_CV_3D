const SECTION_SELECTOR = "[data-section-index]";

/** Section dont le centre est le plus proche du centre du viewport scroll. */
export function measureActiveSectionIndex(container: HTMLElement): number {
    const sections = container.querySelectorAll<HTMLElement>(SECTION_SELECTOR);
    if (!sections.length) return 0;

    const viewportMid = container.getBoundingClientRect().top + container.clientHeight / 2;

    let bestIndex = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    sections.forEach((section) => {
        const index = Number(section.dataset.sectionIndex);
        if (Number.isNaN(index)) return;

        const rect = section.getBoundingClientRect();
        const sectionMid = rect.top + rect.height / 2;
        const dist = Math.abs(sectionMid - viewportMid);

        if (dist < bestDist) {
            bestDist = dist;
            bestIndex = index;
        }
    });

    return bestIndex;
}

/** Scroll précis vers une section, quel que soit le nesting ou la hauteur viewport. */
export function scrollToSectionByIndex(container: HTMLElement, index: number): void {
    const section = container.querySelector<HTMLElement>(`${SECTION_SELECTOR}[data-section-index="${index}"]`);
    if (!section) return;

    const containerRect = container.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const top = container.scrollTop + (sectionRect.top - containerRect.top);

    container.scrollTo({ top, behavior: "smooth" });
}
