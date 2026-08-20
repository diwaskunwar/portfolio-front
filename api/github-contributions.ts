/**
 * Vercel Edge Function. Server side, never shipped to the browser.
 *
 * This is the only place `GITHUB_TOKEN` is read. It must never carry the
 * `VITE_` prefix — Vite inlines anything prefixed that way into the client
 * bundle as a literal string, so every visitor's browser would receive the
 * token in plaintext, readable with view-source. That already happened once
 * with a different credential on this project; the fix then was revoking it,
 * and the fix here is making sure a token can never reach the browser at all.
 *
 * The token buys two things a logged-out request cannot get:
 *   1. GitHub's contribution GraphQL query, `contributionsCollection`, which
 *      is the actual calendar shown on a profile page (including private
 *      commits, when the token belongs to the profile owner). There is no
 *      unauthenticated equivalent — the REST approximation this replaced had
 *      to fan out into per-repo commit pages to fake the same picture.
 *   2. 5,000 requests/hour instead of 60, and this function makes exactly one
 *      of them.
 *
 * The response is cached at Vercel's edge for an hour (`s-maxage`), shared
 * across every visitor, with a day of stale-while-revalidate on top. GitHub
 * gets called at most once an hour for the whole site, regardless of traffic
 * — the actual fix for the rate-limit crash, not just a relocation of it.
 */
export const config = { runtime: 'edge' };

const QUERY = `
  query ($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

/* Same bucketing GitHub's own calendar uses, so the five shades on this page
   read the same way they would on github.com. */
const levelFor = (count: number): number => {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 7) return 2;
  if (count <= 12) return 3;
  return 4;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export default async function handler(): Promise<Response> {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME || 'diwaskunwar';

  if (!token) {
    // Not "no data" — misconfigured. The client treats this as a real error
    // rather than an empty calendar, so a missing env var fails loudly in
    // testing instead of quietly rendering a blank grid in production.
    return json({ error: 'GITHUB_TOKEN is not configured on the server.' }, 501);
  }

  const to = new Date();
  const from = new Date(to);
  from.setUTCFullYear(from.getUTCFullYear() - 1);

  let upstream: Response;
  try {
    upstream = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'diwas-kunwar-portfolio',
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { login: username, from: from.toISOString(), to: to.toISOString() },
      }),
    });
  } catch {
    return json({ error: 'Could not reach GitHub.' }, 502);
  }

  if (!upstream.ok) {
    return json({ error: `GitHub responded ${upstream.status}.` }, 502);
  }

  const payload = await upstream.json();
  const calendar = payload?.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar) {
    return json({ error: 'Unexpected response shape from GitHub.' }, 502);
  }

  const days = calendar.weeks.flatMap((week: { contributionDays: { date: string; contributionCount: number }[] }) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: levelFor(day.contributionCount),
    }))
  );

  return new Response(
    JSON.stringify({ total: calendar.totalContributions, days }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        /* A contribution count only changes when a new commit lands, so a
           day-old figure is rarely wrong and never worth a live round trip
           to serve. Vercel's edge treats these three together: `s-maxage`
           is how long a cached copy is served as fresh outright;
           `stale-while-revalidate` is the much longer window after that
           where a visitor still gets the cached copy instantly while a
           fresh one is fetched in the background for whoever asks next;
           `stale-if-error` means a GitHub outage or a spent rate limit
           serves the last good snapshot instead of the section's error
           state. Net effect: at most one real GitHub call across every
           visitor per cache period, and everyone else gets an edge hit. */
        'cache-control':
          'public, s-maxage=21600, stale-while-revalidate=604800, stale-if-error=604800',
      },
    }
  );
}
