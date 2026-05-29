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

/** Index actif — aligné sur le modèle pages Drei (1 section = 1 page). */
export function measureActiveSectionIndex(container: HTMLElement, pages: number): number {
    const scrollThreshold = getScrollThreshold(container);
    if (scrollThreshold <= 0) return 0;
    return getPageIndexFromRatio(container.scrollTop / scrollThreshold, pages);
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
