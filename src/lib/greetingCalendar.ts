import type { ContributionDay } from '@/services/githubClient';

/**
 * Builds a year-shaped contribution calendar whose lit cells spell a word.
 *
 * Commit art: the pattern is drawn, not recorded. The chart is 53 weeks by
 * 7 days, laid out column-major to match the grid it renders into.
 */

const WEEKS = 53;
const DAYS = 7;

/* Variable-width bitmap font, 5 rows tall. Most glyphs are 3 columns so the
   whole phrase fits inside 53 weeks; W gets 5 because it is unreadable
   narrower than that. */
const GLYPHS: Record<string, string[]> = {
    H: ['101', '101', '111', '101', '101'],
    E: ['111', '100', '110', '100', '111'],
    L: ['100', '100', '100', '100', '111'],
    O: ['111', '101', '101', '101', '111'],
    D: ['110', '101', '101', '101', '110'],
    R: ['110', '101', '110', '101', '101'],
    W: ['10001', '10001', '10101', '11011', '01010'],
    ' ': ['00', '00', '00', '00', '00'],
};

const GLYPH_ROWS = 5;
/* Vertical centring: 5 rows of glyph inside 7 rows of week. */
const ROW_OFFSET = 1;

const measure = (text: string) => {
    let width = 0;
    const chars = [...text.toUpperCase()].filter((c) => GLYPHS[c]);
    chars.forEach((c, i) => {
        width += GLYPHS[c][0].length;
        if (i < chars.length - 1) width += 1; // gap column
    });
    return { chars, width };
};

export const buildGreetingCalendar = (text = 'HELLO WORLD'): ContributionDay[] => {
    const { chars, width } = measure(text);

    /* Centre the phrase across the year. */
    const startCol = Math.max(0, Math.floor((WEEKS - width) / 2));

    // col -> row -> lit
    const lit = new Set<string>();
    let col = startCol;
    for (const char of chars) {
        const glyph = GLYPHS[char];
        const w = glyph[0].length;
        for (let r = 0; r < GLYPH_ROWS; r++) {
            for (let c = 0; c < w; c++) {
                if (glyph[r][c] === '1') lit.add(`${col + c}:${r + ROW_OFFSET}`);
            }
        }
        col += w + 1;
    }

    /* Anchor to today so the month labels line up with a real year. */
    const today = new Date();
    const end = new Date(today);
    // Wind back to the most recent Saturday so the last column is complete.
    end.setDate(end.getDate() + (6 - end.getDay()));
    const totalDays = WEEKS * DAYS;

    const days: ContributionDay[] = [];

    // Column-major, matching `grid-flow-col grid-rows-7`.
    for (let c = 0; c < WEEKS; c++) {
        for (let r = 0; r < DAYS; r++) {
            const index = c * DAYS + r;
            const date = new Date(end);
            date.setDate(end.getDate() - (totalDays - 1 - index));

            const isLit = lit.has(`${c}:${r}`);
            // Lit cells vary between the top two levels, and a little quiet
            // noise sits elsewhere, so it reads as a graph rather than a bitmap.
            const level = isLit
                ? Math.random() > 0.4 ? 4 : 3
                : Math.random() > 0.9 ? 1 : 0;

            const count = level === 0 ? 0 : level * 3 + Math.floor(Math.random() * 4);

            days.push({
                date: date.toISOString().split('T')[0],
                count,
                level,
            });
        }
    }

    return days;
};
