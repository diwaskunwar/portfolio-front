
import { ContributionDay } from '@/types/github';

export const getWeeksArray = (contributions?: ContributionDay[]) => {
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];

  // Guard against undefined or empty input
  if (!contributions || contributions.length === 0) {
    return weeks;
  }

  const firstDate = new Date(contributions[0].date);
  const firstDayOfWeek = firstDate.getDay();

  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({
      date: "",
      count: 0,
      level: -1
    });
  }

  contributions.forEach((day) => {
    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
};

export const getLevelColor = (level: number, isDarkMode: boolean) => {
  if (level === -1) return "bg-transparent";

  if (isDarkMode) {
    switch (level) {
      case 0: return "bg-gray-800 border border-gray-700";
      case 1: return "bg-green-900 border border-green-800";
      case 2: return "bg-green-700 border border-green-600";
      case 3: return "bg-green-600 border border-green-500";
      case 4: return "bg-green-500 border border-green-400";
      default: return "bg-gray-800 border border-gray-700";
    }
  } else {
    switch (level) {
      case 0: return "bg-gray-100 border border-gray-200";
      case 1: return "bg-green-100 border border-green-200";
      case 2: return "bg-green-300 border border-green-400";
      case 3: return "bg-green-500 border border-green-600";
      case 4: return "bg-green-700 border border-green-800";
      default: return "bg-gray-100 border border-gray-200";
    }
  }
};

export const formatDate = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
