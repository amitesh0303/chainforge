export type Difficulty = 'easy' | 'medium' | 'hard';
export type Chain = 'evm' | 'solana' | 'move';
export type Language = 'solidity' | 'rust' | 'move';
export type SubmissionStatus = 'pending' | 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'compilation_error' | 'runtime_error';
export type ContestStatus = 'upcoming' | 'active' | 'completed';
export type BadgeType = 'first_solve' | 'streak_7' | 'streak_30' | 'contest_winner' | 'evm_master' | 'solana_master' | 'move_master';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  chain: Chain;
  language: Language;
  initialCode: string;
  testCases: TestCase[];
  hints: string[];
  xpReward: number;
  tags: string[];
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  walletAddress?: string;
  googleId?: string;
  username?: string;
  avatarUrl?: string;
  eloRating: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: Date;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  status: SubmissionStatus;
  executionTimeMs?: number;
  gasUsed?: number;
  earnedXp?: number;
  submittedAt: Date;
}

export interface Contest {
  id: string;
  title: string;
  startTime: Date;
  durationMinutes: number;
  problemIds: string[];
  status: ContestStatus;
}

export interface ContestParticipant {
  id: string;
  contestId: string;
  userId: string;
  score: number;
  problemsSolved: number;
  ratingChange?: number;
  user?: User;
}

export interface Badge {
  id: string;
  userId: string;
  badgeType: BadgeType;
  mintedAt: Date;
  tokenId?: string;
}

export interface Quiz {
  id: string;
  title: string;
  chain: Chain;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
