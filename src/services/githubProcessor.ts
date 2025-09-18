/**
 * GitHub Profile Processor - TypeScript implementation
 * Processes GitHub API data to extract useful information for portfolio display
 */

import { GitHubRepo, GitHubProfile, ContributionStats } from './githubClient';

export interface ProcessedSkill {
  name: string;
  level: number;
}

export interface ProcessedProfile {
  name: string;
  bio: string;
  location: string;
  company: string;
  blog: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface ProcessedExperience {
  top_languages: string[];
  years_active: number;
  contribution_streak: number;
  recommendations: string[];
}

export interface ProcessedRepositories {
  top_repos: GitHubRepo[];
  language_distribution: Record<string, number>;
  stars_count: number;
  forks_count: number;
}

export interface ProcessedContributions {
  total: number;
  by_month: any[];
  activity_breakdown: any;
}

export interface ProcessedGitHubData {
  skills: ProcessedSkill[];
  profile: ProcessedProfile;
  experience: ProcessedExperience;
  repositories: ProcessedRepositories;
  contributions: ProcessedContributions;
}

export class GitHubProfileProcessor {
  // Common programming languages and technologies
  private static readonly LANGUAGES: Record<string, string[]> = {
    python: ["python", "django", "flask", "fastapi", "pandas", "numpy", "pytorch", "tensorflow", "scikit-learn"],
    javascript: ["javascript", "js", "typescript", "ts", "react", "vue", "angular", "node", "express", "next.js"],
    java: ["java", "spring", "hibernate", "maven", "gradle"],
    "c#": ["c#", "csharp", ".net", "asp.net", "dotnet"],
    php: ["php", "laravel", "symfony", "wordpress"],
    ruby: ["ruby", "rails", "sinatra"],
    go: ["go", "golang"],
    rust: ["rust", "cargo"],
    "c++": ["c++", "cpp"],
    c: ["c"],
    swift: ["swift", "ios"],
    kotlin: ["kotlin", "android"],
    r: ["r", "rstudio", "shiny"],
    scala: ["scala", "akka", "spark"],
    perl: ["perl"],
    haskell: ["haskell"],
    lua: ["lua"],
    shell: ["shell", "bash", "zsh", "powershell"],
    sql: ["sql", "mysql", "postgresql", "sqlite", "oracle", "sql server"],
    nosql: ["mongodb", "cassandra", "couchdb", "redis", "dynamodb"],
    html: ["html", "html5"],
    css: ["css", "scss", "sass", "less", "tailwind", "bootstrap"],
    mobile: ["react native", "flutter", "xamarin", "ionic"],
    devops: ["docker", "kubernetes", "jenkins", "gitlab ci", "github actions", "aws", "azure", "gcp", "terraform"],
    data: ["data science", "machine learning", "ml", "ai", "artificial intelligence", "data analysis", "data visualization", "big data"],
    blockchain: ["blockchain", "ethereum", "solidity", "web3", "smart contract"]
  };

  private skillsCounter: Map<string, number> = new Map();

  preprocessGitHubData(githubData: {
    repositories?: GitHubRepo[];
    contributions?: ContributionStats;
    profile?: GitHubProfile;
  }): ProcessedGitHubData {
    const result: ProcessedGitHubData = {
      skills: [],
      profile: {
        name: "",
        bio: "",
        location: "",
        company: "",
        blog: "",
        avatar_url: "",
        public_repos: 0,
        followers: 0,
        following: 0
      },
      experience: {
        top_languages: [],
        years_active: 0,
        contribution_streak: 0,
        recommendations: []
      },
      repositories: {
        top_repos: [],
        language_distribution: {},
        stars_count: 0,
        forks_count: 0
      },
      contributions: {
        total: 0,
        by_month: [],
        activity_breakdown: {}
      }
    };

    // Process repositories data
    if (githubData.repositories) {
      this.processRepositories(githubData.repositories, result);
    }

    // Process contributions data
    if (githubData.contributions) {
      this.processContributions(githubData.contributions, result);
    }

    // Process user profile data
    if (githubData.profile) {
      this.processProfile(githubData.profile, result);
    }

    // Extract skills from all available data
    result.skills = this.extractSkills(githubData, result.repositories.language_distribution);

    // Generate recommendations based on the processed data
    result.experience.recommendations = this.generateRecommendations(result);

    return result;
  }

  private processRepositories(reposData: GitHubRepo[], result: ProcessedGitHubData): void {
    if (!reposData || reposData.length === 0) {
      return;
    }

    // Count languages across all repositories
    const languageCounter: Map<string, number> = new Map();
    let starsCount = 0;
    let forksCount = 0;

    // Process each repository
    for (const repo of reposData) {
      // Count languages
      let lang = repo.language || "";
      if (lang) {
        lang = lang.toLowerCase();
        languageCounter.set(lang, (languageCounter.get(lang) || 0) + 1);
      }

      // Count stars and forks
      starsCount += repo.stars || 0;
      forksCount += repo.forks || 0;

      // Extract skills from repository name, description and topics
      this.extractRepoSkills(repo);
    }

    // Sort repositories by stars
    const topRepos = [...reposData]
      .sort((a, b) => (b.stars || 0) - (a.stars || 0))
      .slice(0, 5);

    // Update result
    result.repositories.top_repos = topRepos;
    result.repositories.language_distribution = Object.fromEntries(
      Array.from(languageCounter.entries()).sort(([,a], [,b]) => b - a)
    );
    result.repositories.stars_count = starsCount;
    result.repositories.forks_count = forksCount;

    // Extract top languages
    result.experience.top_languages = Array.from(languageCounter.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([lang]) => lang);
  }

  private processContributions(contributionsData: ContributionStats, result: ProcessedGitHubData): void {
    if (!contributionsData) {
      return;
    }

    // Extract total contributions
    result.contributions.total = contributionsData.total_contributions || 0;

    // Extract activity breakdown
    if (contributionsData.activity_breakdown) {
      result.contributions.activity_breakdown = contributionsData.activity_breakdown;
    }

    // Extract monthly contributions
    if (contributionsData.monthly_contributions) {
      result.contributions.by_month = contributionsData.monthly_contributions;
    }

    // Calculate contribution streak (consecutive days with contributions)
    if (contributionsData.contribution_calendar) {
      const calendar = contributionsData.contribution_calendar;
      let currentStreak = 0;
      let maxStreak = 0;

      // Sort calendar by date
      const sortedCalendar = [...calendar].sort((a, b) => a.date.localeCompare(b.date));

      for (const day of sortedCalendar) {
        if ((day.count || 0) > 0) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }

      result.experience.contribution_streak = maxStreak;
    }
  }

  private processProfile(profileData: GitHubProfile, result: ProcessedGitHubData): void {
    if (!profileData) {
      return;
    }

    // Extract basic profile information
    result.profile.name = profileData.name || "";
    result.profile.bio = profileData.bio || "";
    result.profile.location = profileData.location || "";
    result.profile.company = profileData.company || "";
    result.profile.blog = profileData.blog || "";
    result.profile.avatar_url = profileData.avatar_url || "";
    result.profile.public_repos = profileData.public_repos || 0;
    result.profile.followers = profileData.followers || 0;
    result.profile.following = profileData.following || 0;

    // Estimate years active from profile creation date
    if (profileData.created_at) {
      const createdAt = new Date(profileData.created_at);
      const now = new Date();
      const yearsActive = (now.getTime() - createdAt.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      result.experience.years_active = Math.round(yearsActive * 10) / 10; // Round to 1 decimal place
    }
  }

  private extractRepoSkills(repo: GitHubRepo): void {
    // Extract from repository name
    const repoName = (repo.name || "").toLowerCase();
    this.updateSkillsFromText(repoName);

    // Extract from description
    const description = (repo.description || "").toLowerCase();
    this.updateSkillsFromText(description);

    // Extract from topics
    const topics = repo.topics || [];
    for (const topic of topics) {
      this.updateSkillsFromText(topic.toLowerCase());
    }

    // Add the main language as a skill
    const language = (repo.language || "").toLowerCase();
    if (language) {
      this.skillsCounter.set(language, (this.skillsCounter.get(language) || 0) + 3); // Give more weight to the main language
    }
  }

  private updateSkillsFromText(text: string): void {
    if (!text) {
      return;
    }

    // Check for each language and its related technologies
    for (const [lang, keywords] of Object.entries(GitHubProfileProcessor.LANGUAGES)) {
      for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(text)) {
          this.skillsCounter.set(keyword, (this.skillsCounter.get(keyword) || 0) + 1);
        }
      }
    }
  }

  private extractSkills(githubData: any, languageDistribution: Record<string, number>): ProcessedSkill[] {
    // Add languages from distribution with higher weight
    for (const [lang, count] of Object.entries(languageDistribution)) {
      this.skillsCounter.set(lang.toLowerCase(), (this.skillsCounter.get(lang.toLowerCase()) || 0) + count * 2);
    }

    // Get the top skills
    const topSkills = Array.from(this.skillsCounter.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20);

    // Convert to list of objects with skill name and level
    const skillsList: ProcessedSkill[] = [];
    const maxCount = topSkills[0]?.[1] || 1;

    for (const [skill, count] of topSkills) {
      // Normalize skill level to 0-100 range
      const level = Math.min(100, Math.floor((count / maxCount) * 100));
      skillsList.push({
        name: skill,
        level: level
      });
    }

    return skillsList;
  }

  private generateRecommendations(processedData: ProcessedGitHubData): string[] {
    const recommendations: string[] = [];

    // Recommendation based on top languages
    const topLanguages = processedData.experience.top_languages;
    if (topLanguages.length > 0) {
      recommendations.push(`Proficient in ${topLanguages.slice(0, 3).join(', ')}`);
    }

    // Recommendation based on contribution activity
    const totalContributions = processedData.contributions.total;
    if (totalContributions > 500) {
      recommendations.push(`Active open-source contributor with ${totalContributions} contributions`);
    } else if (totalContributions > 100) {
      recommendations.push("Regular open-source contributor");
    }

    // Recommendation based on stars
    const starsCount = processedData.repositories.stars_count;
    if (starsCount > 100) {
      recommendations.push(`Created popular repositories with ${starsCount} total stars`);
    } else if (starsCount > 10) {
      recommendations.push("Developed well-received open-source projects");
    }

    // Recommendation based on contribution streak
    const streak = processedData.experience.contribution_streak;
    if (streak > 30) {
      recommendations.push(`Consistent developer with a ${streak}-day contribution streak`);
    } else if (streak > 7) {
      recommendations.push("Regular code contributor");
    }

    // Recommendation based on years active
    const yearsActive = processedData.experience.years_active;
    if (yearsActive > 5) {
      recommendations.push(`Experienced developer with ${Math.floor(yearsActive)}+ years on GitHub`);
    } else if (yearsActive > 2) {
      recommendations.push(`Established developer with ${Math.floor(yearsActive)}+ years of coding experience`);
    }

    return recommendations;
  }
}

// Export a function for easy use
export function preprocessGitHubData(githubData: {
  repositories?: GitHubRepo[];
  contributions?: ContributionStats;
  profile?: GitHubProfile;
}): ProcessedGitHubData {
  const processor = new GitHubProfileProcessor();
  return processor.preprocessGitHubData(githubData);
}
