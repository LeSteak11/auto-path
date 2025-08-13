import { z } from "zod";
import {
  IntakeSchema,
  FollowupQuestionSchema,
  FollowupsPayloadSchema,
  FollowupAnswerSchema,
  FollowupAnswersSchema,
  PlanSchema,
  WeekSchema,
  DaySchema,
  TaskSchema,
  ResourceSchema,
  AssessmentSchema,
  GenerateFollowupsRequestSchema,
  GeneratePlanRequestSchema,
} from "./schemas";

// Intake Types
export type IntakeData = z.infer<typeof IntakeSchema>;

// Follow-up Types
export type FollowupQuestion = z.infer<typeof FollowupQuestionSchema>;
export type FollowupsPayload = z.infer<typeof FollowupsPayloadSchema>;
export type FollowupAnswer = z.infer<typeof FollowupAnswerSchema>;
export type FollowupAnswers = z.infer<typeof FollowupAnswersSchema>;

// Plan Types
export type Task = z.infer<typeof TaskSchema>;
export type Day = z.infer<typeof DaySchema>;
export type Week = z.infer<typeof WeekSchema>;
export type Resource = z.infer<typeof ResourceSchema>;
export type Assessment = z.infer<typeof AssessmentSchema>;
export type Plan = z.infer<typeof PlanSchema>;

// API Types
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
