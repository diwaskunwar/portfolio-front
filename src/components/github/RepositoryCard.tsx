import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, GitFork, ArrowUpRight } from 'lucide-react';
import { GitHubRepo } from '@/types/github';

interface RepositoryCardProps {
  repo: GitHubRepo;
  index: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repo, index }) => {
  const reduce = useReducedMotion();

  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      // Was an inline CSS animation with opacity:0 baked into style, which
      // fired on mount regardless of whether the card had been scrolled to.
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: EASE, delay: reduce ? 0 : (index % 3) * 0.08 }}
      className="group flex h-full flex-col rounded-lg border border-border bg-surface/60 p-6 transition-colors duration-300 hover:border-foreground/30 hover:bg-surface-raised"
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <h3 className="truncate text-base font-medium tracking-[-0.01em] text-foreground">
          {repo.name.replace(/[-_]/g, ' ')}
        </h3>
        <ArrowUpRight
          size={17}
          strokeWidth={1.5}
          className="shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
        />
      </div>

      <p className="mb-5 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-muted-foreground">
        {repo.description || 'No description provided.'}
      </p>

      {repo.topics && repo.topics.length > 0 && (
        <ul className="mb-5 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 3).map((topic) => (
            <li
              key={topic}
              className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] text-muted-foreground"
            >
              {topic}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
        <div className="flex items-center gap-4">
          {repo.language && <span>{repo.language}</span>}

          {repo.stars > 0 && (
            <span className="flex items-center gap-1.5">
              <Star className="h-3 w-3" strokeWidth={1.75} />
              {repo.stars}
            </span>
          )}

          {repo.forks > 0 && (
            <span className="flex items-center gap-1.5">
              <GitFork className="h-3 w-3" strokeWidth={1.75} />
              {repo.forks}
            </span>
          )}
        </div>

        <span>{formatDate(repo.updated_at)}</span>
      </div>
    </motion.a>
  );
};

export default memo(RepositoryCard);
