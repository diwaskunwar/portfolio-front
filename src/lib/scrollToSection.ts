/**
 * Scrolls to a section by id.
 *
 * Sections below the fold mount lazily, so the real element may not exist
 * yet. `DeferredSection` exposes `data-section-placeholder` on the reserved
 * space it holds open, which is the correct destination in that case. A plain
 * `href="#id"` anchor silently does nothing when the id is absent, so every
 * in-page jump goes through here.
 */
export const scrollToSection = (id: string) => {
    const target =
        document.getElementById(id) ??
        document.querySelector(`[data-section-placeholder="${id}"]`);

    if (!target) return false;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
};
