import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink, Code } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitHubRepo } from '@/types/github';

interface RepositoryCardProps {
  repo: GitHubRepo;
  index: number;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repo, index }) => {
  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get language color
  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      Python: 'bg-blue-500',
      JavaScript: 'bg-yellow-500',
      TypeScript: 'bg-blue-600',
      HTML: 'bg-orange-500',
      CSS: 'bg-purple-500',
      Java: 'bg-red-500',
      'C#': 'bg-green-600',
      PHP: 'bg-indigo-500',
      Ruby: 'bg-red-600',
      Go: 'bg-blue-400',
      Rust: 'bg-orange-600',
      Swift: 'bg-orange-500',
      Kotlin: 'bg-purple-600',
      Dart: 'bg-blue-300',
      Shell: 'bg-gray-500',
      Jupyter: 'bg-orange-400',
    };

    return colors[language] || 'bg-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card className="h-full bg-gray-800/60 border-gray-700 hover:border-gray-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-lg text-white truncate">
              {repo.name}
            </h3>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
              aria-label={`Visit ${repo.name} repository`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <p className="text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
            {repo.description || 'No description provided'}
          </p>

          <div className="mt-auto">
            {/* Topics/Tags */}
            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {repo.topics.slice(0, 3).map((topic, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs"
                  >
                    {topic}
                  </Badge>
                ))}
                {repo.topics.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="bg-gray-700 text-gray-300 text-xs"
                  >
                    +{repo.topics.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-3">
                {/* Language */}
                {repo.language && (
                  <div className="flex items-center">
                    <span className={`h-3 w-3 rounded-full mr-1.5 ${getLanguageColor(repo.language)}`}></span>
                    <span>{repo.language}</span>
                  </div>
                )}
                
                {/* Stars */}
                {repo.stars > 0 && (
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                    <span>{repo.stars}</span>
                  </div>
                )}
                
                {/* Forks */}
                {repo.forks > 0 && (
                  <div className="flex items-center">
                    <GitFork className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    <span>{repo.forks}</span>
                  </div>
                )}
              </div>
              
              {/* Updated date */}
              <div className="text-gray-500">
                Updated {formatDate(repo.updated_at)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RepositoryCard;
