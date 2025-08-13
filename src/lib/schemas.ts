import { z } from "zod";

// Intake Form Schema
export const IntakeSchema = z.object({
  goal: z.string().min(10, "Please describe your learning goal in at least 10 characters"),
  currentLevel: z.enum(["beginner", "intermediate", "advanced"]).refine((val) => val, {
    message: "Please select your current level",
  }),
  timeCommitment: z.number().min(1).max(40, "Time commitment must be between 1-40 hours per week"),
  preferredFormat: z.array(z.enum(["video", "article", "hands-on", "documentation"])).min(1, "Select at least one format"),
  deadline: z.string().optional(),
  specificTopics: z.string().optional(),
});

// Follow-up Question Schemas
export const SingleSelectQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  type: z.literal("single_select"),
  options: z.array(z.string()),
});

export const MultiSelectQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  type: z.literal("multi_select"),
  options: z.array(z.string()),
});

export const FreeTextQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  type: z.literal("free_text"),
});

export const FollowupQuestionSchema = z.discriminatedUnion("type", [
  SingleSelectQuestionSchema,
  MultiSelectQuestionSchema,
  FreeTextQuestionSchema,
]);

export const FollowupsPayloadSchema = z.object({
  questions: z.array(FollowupQuestionSchema),
});

// Follow-up Answers Schema
export const FollowupAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.union([z.string(), z.array(z.string())]),
});

export const FollowupAnswersSchema = z.object({
  answers: z.array(FollowupAnswerSchema),
});

// Learning Plan Schemas
export const TaskSchema = z.object({
  title: z.string(),
  resource: z.string().optional(),
  deliverable: z.string().optional(),
});

export const DaySchema = z.object({
  day: z.number(),
  time_est: z.number(),
  tasks: z.array(TaskSchema),
});

export const WeekSchema = z.object({
  week: z.number(),
  theme: z.string(),
  hours_planned: z.number(),
  milestones: z.array(z.string()),
  days: z.array(DaySchema),
});

export const ResourceSchema = z.object({
  label: z.string(),
  type: z.enum(["video", "article", "docs"]),
  url: z.string().url(),
});

export const AssessmentSchema = z.object({
  when: z.string(),
  rubric: z.string(),
});

export const PlanSchema = z.object({
  weeks: z.array(WeekSchema),
  resources: z.array(ResourceSchema),
  assessments: z.array(AssessmentSchema),
});

// API Request/Response Schemas
export const GenerateFollowupsRequestSchema = z.object({
  intake: IntakeSchema,
});

export const GeneratePlanRequestSchema = z.object({
  intake: IntakeSchema,
  followupAnswers: FollowupAnswersSchema,
});
