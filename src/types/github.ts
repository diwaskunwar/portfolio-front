
// Re-export types from the GitHub client for consistency
export type { 
  GitHubRepo, 
  GitHubProfile, 
  ContributionStats, 
  ContributionDay, 
  ActivityBreakdown 
} from '../services/githubClient';

export type { 
  ProcessedGitHubData, 
  ProcessedSkill, 
  ProcessedProfile, 
  ProcessedExperience, 
  ProcessedRepositories, 
  ProcessedContributions 
} from '../services/githubProcessor';

// Import types for use in legacy interfaces
import type { ActivityBreakdown, ContributionDay } from '../services/githubClient';

// Legacy aliases for backward compatibility
export interface Repository {
  name: string;
  url: string;
  stars: number;
  language: string | null;
}

export interface ContributionData {
  total_contributions: number;
  activity_breakdown: ActivityBreakdown;
  contribution_calendar: ContributionDay[];
  monthly_contributions?: { month: string; year: string; count: number }[];
  contributed_repositories?: Repository[];
}
