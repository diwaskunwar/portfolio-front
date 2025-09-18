
import { useState, useEffect } from 'react';
import { ContributionStats } from '@/types/github';
import githubService from '@/services/githubService';

export const useGithubContributions = () => {
  const [contributionData, setContributionData] = useState<ContributionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);

        // Use githubService instead of direct fetch
        const data = await githubService.getContributions(12, {
          onSuccess: (responseData) => {
            setContributionData(responseData);
          },
          onError: (err) => {
            setError("Failed to load contribution data");
            console.error(err);
          },
          onFinally: () => {
            setLoading(false);
          }
        });

        // Set data in case it wasn't set in the callback
        if (!contributionData) {
          setContributionData(data);
        }
      } catch (err) {
        // This catch block is a fallback in case the onError callback doesn't execute
        setError("Failed to load contribution data");
        console.error(err);
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  return { contributionData, loading, error };
};
