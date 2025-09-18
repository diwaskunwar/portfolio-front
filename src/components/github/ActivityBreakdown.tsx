
import React from 'react';
import { motion } from 'framer-motion';
import { ActivityBreakdown as ActivityBreakdownType } from '@/types/github';

interface ActivityBreakdownProps {
  data?: ActivityBreakdownType;
}

const ActivityBreakdown: React.FC<ActivityBreakdownProps> = ({ data }) => {
  const safeData: ActivityBreakdownType = data ?? {
    commits: { count: 0, percentage: 0 },
    pull_requests: { count: 0, percentage: 0 },
    issues: { count: 0, percentage: 0 },
    code_reviews: { count: 0, percentage: 0 },
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Activity Breakdown
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(safeData).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
              <motion.div
                className={`h-2.5 rounded-full ${
                  key === 'commits' ? 'bg-green-600 dark:bg-green-500' :
                  key === 'pull_requests' ? 'bg-purple-600 dark:bg-purple-500' :
                  key === 'issues' ? 'bg-yellow-600 dark:bg-yellow-500' :
                  'bg-blue-600 dark:bg-blue-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${value.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between items-center min-w-[120px]">
              <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {key.replace('_', ' ')}
              </span>
              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                {value.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityBreakdown;
