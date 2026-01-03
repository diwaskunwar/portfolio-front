import React, { memo } from 'react';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import { GitHubRepo } from '@/types/github';

interface RepositoryCardProps {
  repo: GitHubRepo;
  index: number;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repo, index }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/5 hover:border-white/20 transition-all duration-300 group"
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fadeIn 0.5s ease-out forwards',
        opacity: 0
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-white text-base tracking-tight group-hover:translate-x-1 transition-transform truncate flex-1 mr-4 uppercase">
          {repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}
        </h3>
        <ExternalLink className="h-4 w-4 text-white group-hover:scale-125 transition-all" />
      </div>

      {/* Description */}
      <p className="text-white/80 text-sm mb-4 line-clamp-2 leading-relaxed font-light min-h-[2.5rem]">
        {repo.description || 'A project built with care'}
      </p>

      {/* Tags */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {repo.topics.slice(0, 3).map((topic, i) => (
            <span
              key={i}
              className="text-[10px] tracking-wider text-white uppercase px-2 py-1 border border-white/40 rounded-full font-bold"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-white pt-4 border-t border-white/20 font-bold">
        <div className="flex items-center gap-4">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              {repo.language}
            </span>
          )}

          {repo.stars > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" fill="white" />
              {repo.stars}
            </span>
          )}

          {repo.forks > 0 && (
            <span className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              {repo.forks}
            </span>
          )}
        </div>

        <span className="text-white/80">
          {formatDate(repo.updated_at)}
        </span>
      </div>
    </a>
  );
};

export default memo(RepositoryCard);
