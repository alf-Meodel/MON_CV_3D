const SECTION_SELECTOR = "[data-section-index]";
const NAV_SCROLL_MS = 520;

export type DreiScrollSync = {
    scroll: { current: number };
    offset: number;
    delta: number;
    eps: number;
    pages: number;
    fixed: HTMLDivElement;
};

let navScrollAnim: number | null = null;

function clampRatio(value: number): number {
    return Math.min(Math.max(0, value), 1);
}

function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/** Ratio Drei 0→1 pour une page (index 0 … pages-1). */
export function getPageRatio(index: number, pages: number): number {
    if (pages <= 1) return 0;
    return clampRatio(index / (pages - 1));
}

/** Index de page le plus proche d'un ratio Drei. */
export function getPageIndexFromRatio(ratio: number, pages: number): number {
    if (pages <= 1) return 0;
    return Math.round(clampRatio(ratio) * (pages - 1));
}

function getScrollThreshold(container: HTMLElement): number {
    return Math.max(0, container.scrollHeight - container.clientHeight);
}

function applyDreiPageState(
    container: HTMLElement,
    drei: DreiScrollSync,
    viewportHeight: number,
    ratio: number
): void {
    const scrollThreshold = getScrollThreshold(container);
    const top = ratio * scrollThreshold;

    container.scrollTop = top;
    drei.scroll.current = ratio;
    drei.offset = ratio;
    drei.delta = Math.max(drei.delta, drei.eps * 2);

    const htmlLayer = drei.fixed.firstElementChild as HTMLElement | null;
    if (htmlLayer) {
        htmlLayer.style.transform = `translate3d(0px,${viewportHeight * (drei.pages - 1) * -ratio}px,0px)`;
    }
}

/** Index actif via offset Drei (aligné sur le rendu visuel). */
export function measureActiveSectionIndexFromOffset(offset: number, pages: number): number {
    return getPageIndexFromRatio(offset, pages);
}

function parseTranslateY(transform: string): number | null {
    if (!transform || transform === "none") return null;

    const translateMatch = transform.match(/translate3d\([^,]+,\s*(-?[\d.]+)px/i);
    if (translateMatch) return parseFloat(translateMatch[1]);

    const translate2Match = transform.match(/translate\([^,]+,\s*(-?[\d.]+)px/i);
    if (translate2Match) return parseFloat(translate2Match[1]);

    const matrix3Match = transform.match(/matrix3d\(([^)]+)\)/);
    if (matrix3Match) {
        const values = matrix3Match[1].split(",").map((value) => parseFloat(value.trim()));
        if (values.length >= 14) return values[13];
    }

    const matrix2Match = transform.match(/matrix\(([^)]+)\)/);
    if (matrix2Match) {
        const values = matrix2Match[1].split(",").map((value) => parseFloat(value.trim()));
        if (values.length >= 6) return values[5];
    }

    return null;
}

/**
 * Index actif via le transform du layer HTML Drei (position réellement affichée).
 * Plus fiable que offset seul sur mobile tactile.
 */
export function measureActiveSectionIndexFromTransform(
    fixed: HTMLDivElement | null | undefined,
    viewportHeight: number,
    pages: number
): number | null {
    if (!fixed || viewportHeight <= 0 || pages <= 1) return null;

    const htmlLayer = fixed.firstElementChild as HTMLElement | null;
    if (!htmlLayer) return null;

    const inlineTransform = htmlLayer.style.transform;
    const computedTransform = window.getComputedStyle(htmlLayer).transform;
    const translateY =
        parseTranslateY(inlineTransform) ??
        parseTranslateY(computedTransform === "none" ? "" : computedTransform);

    if (translateY == null || Number.isNaN(translateY)) return null;

    const ratio = clampRatio(-translateY / (viewportHeight * (pages - 1)));
    return getPageIndexFromRatio(ratio, pages);
}

/** Index actif — scrollTop du conteneur (fallback). */
export function measureActiveSectionIndex(container: HTMLElement, pages: number): number {
    const scrollThreshold = getScrollThreshold(container);
    if (scrollThreshold <= 0) return 0;
    return getPageIndexFromRatio(container.scrollTop / scrollThreshold, pages);
}

/** Résout l'index actif en combinant transform, scrollTop et offset Drei. */
export function resolveActiveSectionIndex(
    container: HTMLElement | null | undefined,
    drei: DreiScrollSync,
    viewportHeight: number
): number {
    const { pages } = drei;
    const fromTransform = measureActiveSectionIndexFromTransform(drei.fixed, viewportHeight, pages);
    if (fromTransform != null) return fromTransform;

    if (container) {
        return measureActiveSectionIndex(container, pages);
    }

    const fromCurrent = measureActiveSectionIndexFromOffset(drei.scroll.current, pages);
    const fromOffset = measureActiveSectionIndexFromOffset(drei.offset, pages);
    return Math.max(fromCurrent, fromOffset);
}

/**
 * Scroll smooth vers une page, offset + transform HTML synchronisés (pas de lag Drei).
 */
export function scrollToSectionByIndex(
    container: HTMLElement,
    index: number,
    drei: DreiScrollSync,
    viewportHeight: number
): void {
    const section = container.querySelector<HTMLElement>(`${SECTION_SELECTOR}[data-section-index="${index}"]`);
    if (!section) return;

    const targetRatio = getPageRatio(index, drei.pages);
    const startRatio = drei.offset;

    if (navScrollAnim != null) {
        cancelAnimationFrame(navScrollAnim);
        navScrollAnim = null;
    }

    const reducedMotion =
        typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || Math.abs(targetRatio - startRatio) < 0.0001) {
        applyDreiPageState(container, drei, viewportHeight, targetRatio);
        return;
    }

    const startTime = performance.now();

    const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / NAV_SCROLL_MS);
        const ratio = startRatio + (targetRatio - startRatio) * easeInOutCubic(t);
        applyDreiPageState(container, drei, viewportHeight, ratio);

        if (t < 1) {
            navScrollAnim = requestAnimationFrame(step);
        } else {
            applyDreiPageState(container, drei, viewportHeight, targetRatio);
            navScrollAnim = null;
        }
    };

    navScrollAnim = requestAnimationFrame(step);
}
