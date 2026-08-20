/**
 * The page read as one sequence.
 *
 * Every section used to open the same way with nothing saying where it sat in
 * the whole, so the page scanned as nine unrelated pages stacked on top of
 * each other rather than one argument told in order. Numbering them makes the
 * order legible: a reader landing halfway down knows there is a beginning
 * above them and how much is left below.
 *
 * Order is declared once, here, and each section looks up its own number. A
 * section moved in Index.tsx has to be moved here too, but nothing can end up
 * with a number that disagrees with the section next to it — which is exactly
 * what hand-written "01", "02" labels drift into.
 *
 * The hero is deliberately absent. It is the cover, not chapter one.
 */
export const CHAPTERS = [
    'professional-journey',
    'shipped-work',
    'how-i-brew',
    'technical-expertise',
    'certificates',
    'projects',
    'github-activity',
    'off-the-clock',
    'get-in-touch',
] as const;

export type ChapterId = (typeof CHAPTERS)[number];

export const CHAPTER_COUNT = CHAPTERS.length;

/** 1-based position. Returns 0 for an id that is not a chapter. */
export const chapterNumber = (id: ChapterId): number => CHAPTERS.indexOf(id) + 1;

/** Zero-padded, so 01 through 09 stay the same width as 10 would. */
export const chapterLabel = (id: ChapterId): string =>
    String(chapterNumber(id)).padStart(2, '0');
