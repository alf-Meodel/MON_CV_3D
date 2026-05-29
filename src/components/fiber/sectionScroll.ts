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
let navScrollTargetIndex: number | null = null;

export function isNavScrollAnimating(): boolean {
    return navScrollAnim != null;
}

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

function getPageHeight(container: HTMLElement | null | undefined, fallback: number): number {
    if (!container) return fallback;
    const section = container.querySelector<HTMLElement>(SECTION_SELECTOR);
    if (section && section.offsetHeight > 0) return section.offsetHeight;
    return fallback;
}

function findTransformedHtmlLayer(fixed: HTMLDivElement): HTMLElement | null {
    for (const child of Array.from(fixed.children)) {
        if (!(child instanceof HTMLElement)) continue;
        const inline = child.style.transform;
        if (inline && inline !== "none") return child;
        const computed = window.getComputedStyle(child).transform;
        if (computed && computed !== "none") return child;
    }
    return fixed.firstElementChild as HTMLElement | null;
}

function getScrollThreshold(container: HTMLElement): number {
    return Math.max(0, container.scrollHeight - container.clientHeight);
}

function getIndexFromTranslateY(translateY: number, pageHeight: number, pages: number): number {
    if (pageHeight <= 0 || pages <= 1) return 0;
    return Math.min(pages - 1, Math.max(0, Math.round(-translateY / pageHeight)));
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

    const translateMatch = transform.match(/translate3d\([^,]+,\s*(-?[\d.eE+-]+)(?:px)?/i);
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
    pages: number,
    container?: HTMLElement | null
): number | null {
    if (!fixed || viewportHeight <= 0 || pages <= 1) return null;

    const htmlLayer = findTransformedHtmlLayer(fixed);
    if (!htmlLayer) return null;

    const inlineTransform = htmlLayer.style.transform;
    const computedTransform = window.getComputedStyle(htmlLayer).transform;
    const translateY =
        parseTranslateY(inlineTransform) ??
        parseTranslateY(computedTransform === "none" ? "" : computedTransform);

    if (translateY == null || Number.isNaN(translateY)) return null;

    const pageHeight = getPageHeight(container ?? null, viewportHeight);
    return getIndexFromTranslateY(translateY, pageHeight, pages);
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
    if (navScrollTargetIndex != null) return navScrollTargetIndex;

    const { pages } = drei;
    const fromCurrent = measureActiveSectionIndexFromOffset(drei.scroll.current, pages);
    const fromOffset = measureActiveSectionIndexFromOffset(drei.offset, pages);

    let fromScrollTop = fromCurrent;
    if (container) {
        const scrollThreshold = getScrollThreshold(container);
        if (scrollThreshold > 0) {
            fromScrollTop = getPageIndexFromRatio(container.scrollTop / scrollThreshold, pages);
        }
    }

    const fromTransform = measureActiveSectionIndexFromTransform(
        drei.fixed,
        viewportHeight,
        pages,
        container
    );

    const scrollSignals = Math.max(fromCurrent, fromScrollTop, fromOffset);

    // Transform bloqué à Accueil alors que le scroll a avancé (bug mobile fréquent)
    if (fromTransform === 0 && scrollSignals > 0) {
        return scrollSignals;
    }

    if (fromTransform != null) {
        if (Math.abs(fromTransform - scrollSignals) <= 1) {
            return fromOffset;
        }
        return fromTransform;
    }

    return scrollSignals;
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
    navScrollTargetIndex = index;

    if (navScrollAnim != null) {
        cancelAnimationFrame(navScrollAnim);
        navScrollAnim = null;
    }

    const reducedMotion =
        typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || Math.abs(targetRatio - startRatio) < 0.0001) {
        applyDreiPageState(container, drei, viewportHeight, targetRatio);
        navScrollTargetIndex = null;
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
            navScrollTargetIndex = null;
        }
    };

    navScrollAnim = requestAnimationFrame(step);
}
