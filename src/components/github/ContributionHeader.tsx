
import React from 'react';
import { GitCommit, GitPullRequest } from 'lucide-react';
import { ContributionData } from '@/types/github';

interface ContributionHeaderProps {
  data: ContributionData;
}

const ContributionHeader: React.FC<ContributionHeaderProps> = ({ data }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
    <div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
        GitHub Contributions
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {data.total_contributions} contributions in the last 90 days
      </p>
    </div>

    <div className="flex items-center mt-4 md:mt-0 space-x-4">
      <div className="flex items-center">
        <GitCommit size={16} className="text-green-600 dark:text-green-400 mr-1" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {(data.activity_breakdown?.commits?.count ?? 0)} commits
        </span>
      </div>
      <div className="flex items-center">
        <GitPullRequest size={16} className="text-purple-600 dark:text-purple-400 mr-1" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {(data.activity_breakdown?.pull_requests?.count ?? 0)} PRs
        </span>
      </div>
    </div>
  </div>
);

export default ContributionHeader;
