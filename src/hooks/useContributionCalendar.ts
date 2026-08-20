import { useCallback, useState } from 'react';
import type { ContributionDay } from '@/components/sections/ContributionsChart';

interface ContributionsPayload {
    total: number;
    days: ContributionDay[];
}

interface State {
    data: ContributionsPayload | null;
    loading: boolean;
    error: string | null;
}

/* Module scope, so it survives a remount — StrictMode's double-invoke in
   dev, or the reader scrolling away from this section and back — without a
   second network round trip. The edge function is already cached for hours
   at Vercel's layer; this is the same idea one hop closer, for the one
   visitor who is still on the page. */
let cached: ContributionsPayload | null = null;
let cachedAt = 0;
const CLIENT_CACHE_MS = 5 * 60 * 1000;

/**
 * Fetches the real contribution calendar from this site's own edge function
 * (`api/github-contributions.ts`), never from GitHub directly.
 *
 * The function holds the token and does the GitHub call server side, so this
 * hook is a same-origin, credential-free request — nothing here can leak
 * anything, unlike a browser call authenticated with a token would.
 */
export const useContributionCalendar = () => {
    const [state, setState] = useState<State>(() =>
        cached ? { data: cached, loading: false, error: null } : { data: null, loading: false, error: null }
    );

    const fetchContributions = useCallback(async (force = false) => {
        if (!force && cached && Date.now() - cachedAt < CLIENT_CACHE_MS) {
            setState({ data: cached, loading: false, error: null });
            return;
        }

        setState((s) => ({ ...s, loading: true, error: null }));
        try {
            const res = await fetch('/api/github-contributions');
            const body = await res.json();
            if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
            cached = body as ContributionsPayload;
            cachedAt = Date.now();
            setState({ data: cached, loading: false, error: null });
        } catch (error) {
            setState({
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : 'Could not load contributions.',
            });
        }
    }, []);

    return { ...state, fetchContributions };
};
