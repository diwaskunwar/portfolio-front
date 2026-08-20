import React, { memo, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Github, Users } from 'lucide-react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import SectionHeader from '@/components/common/SectionHeader';
import Reveal from '@/components/common/Reveal';
import CountUp from '@/components/common/CountUp';
import ContributionsChart from './ContributionsChart';
import { useGithubData } from '@/hooks/useGithubData';
import { useContributionCalendar } from '@/hooks/useContributionCalendar';
import { GITHUB_URL } from '@/lib/links';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Two data sources, two very different trust levels.
 *
 * The account totals (public repos, followers) come from an unauthenticated
 * call straight to GitHub's REST API — one request, no credential, safe to
 * make from the browser. The contribution calendar comes from this site's
 * own edge function (`api/github-contributions.ts`), which holds a GitHub
 * token server side and calls GitHub's GraphQL API once, cached for an hour
 * at Vercel's edge. That token must never reach the browser — see the
 * function's own comment for why — so the client only ever talks to our own
 * `/api/github-contributions`, never to GitHub with a credential attached.
 *
 * This section used to fetch the full repo list a second way and build an
 * approximate twelve-month calendar out of per-repo commit pages: roughly
 * twenty unauthenticated GitHub requests on every page load, against a
 * budget of sixty per hour shared across every visitor behind the same IP.
 * That tripped the limit on its own. The repositories themselves, with real
 * per-repo stars and forks, live in Open source below; this section is just
 * the calendar and the two totals GitHub's cheapest endpoint gives up front.
 */
const GitHubActivity = () => {
  const { profile, fetchProfile } = useGithubData(false);
  const contributions = useContributionCalendar();
  const reduce = useReducedMotion();
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    fetchProfile();
    contributions.fetchContributions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Section id="github-activity" className="py-10 sm:py-12 md:py-14 xl:py-16">
      <Container className="w-full">
        <SectionHeader
          chapter="github-activity"
          command="curl -s api.github.com/users/diwaskunwar"
          title="On GitHub"
        >
          A year of real activity, and the account totals GitHub reports.
          The repositories themselves, with real stars and forks on each
          one, are in Open source below.
        </SectionHeader>

        {/* The calendar. Loading, error, and data states mirror the pattern
            every other fetched section on this page uses. */}
        <Reveal className="mb-10 md:mb-12 xl:mb-14" amount={0.15}>
          <div className="rounded-lg border border-border p-6 md:p-8">
            {contributions.loading && !contributions.data ? (
              <div className="skeleton h-[168px] rounded-lg" />
            ) : contributions.error ? (
              <div className="flex flex-col items-start gap-4 py-6">
                <p className="text-muted-foreground">Could not load commit history just now.</p>
                <button
                  onClick={() => contributions.fetchContributions()}
                  className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/35 hover:bg-surface-raised"
                >
                  Try again
                </button>
              </div>
            ) : contributions.data ? (
              <ContributionsChart data={contributions.data.days} />
            ) : null}
            {contributions.data && (
              <p className="mt-6 border-t border-border pt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <CountUp to={contributions.data.total} duration={1} /> contributions in the last year
              </p>
            )}
          </div>
        </Reveal>

        {profile.loading && !profile.data && (
          <div className="grid grid-cols-2 gap-4 md:gap-5">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-lg" />
            ))}
          </div>
        )}

        {!profile.loading && profile.error && (
          <div className="rounded-lg border border-border p-10">
            <p className="text-muted-foreground">Could not reach GitHub just now.</p>
            <button
              onClick={() => fetchProfile()}
              className="mt-5 rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/35 hover:bg-surface-raised"
            >
              Try again
            </button>
          </div>
        )}

        {profile.data && (
          <div className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:mb-12 xl:mb-14">
            {[
              { label: 'Public repositories', value: profile.data.public_repos, icon: Github },
              { label: 'Followers', value: profile.data.followers, icon: Users },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : i * 0.07 }}
                className="bg-background p-6"
              >
                <stat.icon size={16} strokeWidth={1.5} className="text-muted-foreground" />
                <p className="mt-4 font-mono text-3xl font-medium tracking-[-0.03em] text-foreground">
                  <CountUp to={stat.value} duration={1.2} />
                </p>
                <p className="label-mono mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        <Reveal>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background transition-opacity duration-200 hover:opacity-90 active:translate-y-px"
          >
            <Github size={17} strokeWidth={1.75} />
            View full profile
          </a>
        </Reveal>
      </Container>
    </Section>
  );
};

export default memo(GitHubActivity);
