import { z } from "zod";
import {
  IntakeSchema,
  FollowupQuestionSchema,
  FollowupsPayloadSchema,
  PlanSchema,
  GenerateFollowupsRequestSchema,
  GeneratePlanRequestSchema,
} from "./schemas";

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type IntakeData = {
  skill: string;
  targetGoal: string;           // NOTE: use targetGoal (not goal)
  timeBudget: number;           // hours per week
  duration: number;             // weeks
  experienceLevel: ExperienceLevel;
  tools?: string;               // simplified as string
  learningStyle?: Array<'Video-first' | 'Step-by-step' | 'Project-led'>;
  constraints?: string | null;
};

export type FollowupQuestion =
  | { id: string; prompt: string; type: 'single_select'; options: string[] }
  | { id: string; prompt: string; type: 'multi_select'; options: string[] }
  | { id: string; prompt: string; type: 'free_text' };

export type FollowupsPayload = { questions: FollowupQuestion[] };

// Answers keyed by question id; value can be a string or array of strings.
export type FollowupAnswers = Record<string, string | string[]>;

export type Plan = {
  weeks: Array<{
    week: number;
    theme: string;
    hours_planned: number;
    milestones: string[];
    days: Array<{
      day: number;
      time_est: number;
      tasks: Array<{ title: string; resource?: string; deliverable?: string }>;
    }>;
  }>;
  resources: Array<{ label: string; type: 'video' | 'article' | 'docs'; url: string }>;
  assessments: Array<{ when: string; rubric: string }>;
};

// Legacy Zod-derived types for backward compatibility
export type Task = z.infer<typeof IntakeSchema>;
export type GenerateFollowupsRequest = z.infer<typeof GenerateFollowupsRequestSchema>;
export type GeneratePlanRequest = z.infer<typeof GeneratePlanRequestSchema>;

// UI State Types
export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AppState {
  intake: IntakeData | null;
  followups: FollowupsPayload | null;
  followupAnswers: FollowupAnswers | null;
  plan: Plan | null;
  loadingState: LoadingState;
  error: string | null;
}
