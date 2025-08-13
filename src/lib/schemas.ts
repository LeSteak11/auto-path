import { z } from "zod";

// Intake Form Schema
export const IntakeSchema = z.object({
  skill: z.string().min(1, "Skill is required"),
  targetGoal: z.string().min(10, "Please describe your target goal in at least 10 characters"),
  timeBudget: z.number().min(1, "Time budget must be at least 1 hour per week"),
  duration: z.number().min(1, "Duration must be at least 1 week"),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  tools: z.string().optional(),
  learningStyle: z.array(z.enum(["Video-first", "Step-by-step", "Project-led"])).optional(),
  constraints: z.string().nullable().optional(),
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
