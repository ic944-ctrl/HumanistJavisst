export interface QuizOption {
  id: 'A' | 'B';
  title: string;
  description: string;
  image: string | null;
  isHumanist: boolean;
}

export interface QuizQuestion {
  id: number;
  questionNumber: number;
  questionText: string;
  options: QuizOption[];
}

export interface AppSettings {
  websiteUrl: string;
  instagramUrl: string;
  humanistThresholdPct: number;
}

export interface QuizStats {
  totalCompleted: number;
  humanistCount: number;
  nonHumanistCount: number;
  lastCompletedAt: string | null;
}

export interface AppStoreData {
  settings: AppSettings;
  stats: QuizStats;
  questions: QuizQuestion[];
  updatedAt?: number;
}
