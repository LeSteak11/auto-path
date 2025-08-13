import { IntakeData, FollowupsPayload, FollowupAnswers, Plan } from "./types";

export function generateFollowups(intake: IntakeData): FollowupsPayload {
  const baseQuestions = [
    {
      id: "experience",
      prompt: `You mentioned you're at a ${intake.experienceLevel} level. Which of these best describes your experience?`,
      type: "single_select" as const,
      options: [
        "Complete beginner - never touched this topic",
        "Some theoretical knowledge but no hands-on experience",
        "Built small projects or tutorials",
        "Professional experience in related areas",
      ],
    },
    {
      id: "learning_style",
      prompt: "What learning approaches work best for you?",
      type: "multi_select" as const,
      options: [
        "Step-by-step tutorials",
        "Project-based learning",
        "Reading documentation",
        "Video courses",
        "Interactive coding exercises",
        "Group discussions or forums",
      ],
    },
  ];

  // Add goal-specific questions
  const goalSpecificQuestions = [];
  
  if (intake.targetGoal.toLowerCase().includes("web") || intake.targetGoal.toLowerCase().includes("frontend")) {
    goalSpecificQuestions.push({
      id: "frontend_focus",
      prompt: "Which frontend technologies are you most interested in?",
      type: "multi_select" as const,
      options: ["React", "Vue", "Angular", "Vanilla JavaScript", "TypeScript"],
    });
  }

  if (intake.targetGoal.toLowerCase().includes("backend") || intake.targetGoal.toLowerCase().includes("api")) {
    goalSpecificQuestions.push({
      id: "backend_focus",
      prompt: "What type of backend development interests you most?",
      type: "single_select" as const,
      options: ["REST APIs", "GraphQL", "Microservices", "Database design", "DevOps"],
    });
  }

  // Add time-specific question if short duration
  if (intake.duration < 4) {
    goalSpecificQuestions.push({
      id: "priority",
      prompt: "Given your short timeline, what's most important to focus on first?",
      type: "free_text" as const,
    });
  }

  return {
    questions: [...baseQuestions, ...goalSpecificQuestions],
  };
}

export function generatePlan(intake: IntakeData, _followupAnswers: FollowupAnswers): Plan {
  // Calculate plan duration based on time commitment
  const weeksNeeded = Math.max(4, Math.min(12, Math.ceil(40 / intake.timeBudget)));
  
  const weeks = [];
  for (let weekNum = 1; weekNum <= weeksNeeded; weekNum++) {
    weeks.push({
      week: weekNum,
      theme: generateWeekTheme(weekNum, intake.targetGoal),
      hours_planned: intake.timeBudget,
      milestones: generateMilestones(weekNum, intake.targetGoal),
      days: generateDaysForWeek(weekNum, intake),
    });
  }

  return {
    weeks,
    resources: generateResources(),
    assessments: generateAssessments(weeksNeeded),
  };
}

function generateWeekTheme(weekNum: number, targetGoal: string): string {
  const themes = [
    "Foundations and Setup",
    "Core Concepts",
    "Hands-on Practice",
    "Building Your First Project",
    "Advanced Techniques",
    "Best Practices",
    "Performance and Optimization",
    "Testing and Deployment",
    "Real-world Applications",
    "Portfolio and Next Steps",
  ];
  
  return themes[Math.min(weekNum - 1, themes.length - 1)] || `Advanced ${targetGoal} Topics`;
}

function generateMilestones(weekNum: number, targetGoal: string): string[] {
  const baseMilestones = [
    [`Complete environment setup`, `Understand basic ${targetGoal} concepts`],
    [`Build first simple example`, `Grasp fundamental patterns`],
    [`Complete guided tutorial`, `Implement core features`],
    [`Finish first independent project`, `Apply learned concepts`],
    [`Master advanced techniques`, `Optimize your solutions`],
  ];

  return baseMilestones[Math.min(weekNum - 1, baseMilestones.length - 1)] || 
         [`Advanced ${targetGoal} milestone`, `Portfolio project progress`];
}

function generateDaysForWeek(weekNum: number, intake: IntakeData) {
  const daysPerWeek = Math.ceil(intake.timeBudget / 7) > 1 ? 5 : 3;
  const hoursPerDay = intake.timeBudget / daysPerWeek;

  return Array.from({ length: daysPerWeek }, (_, i) => ({
    day: i + 1,
    time_est: Math.round(hoursPerDay * 10) / 10,
    tasks: generateTasksForDay(weekNum, i + 1, intake),
  }));
}

function generateTasksForDay(weekNum: number, dayNum: number, intake: IntakeData) {
  const styles = intake.learningStyle || [];
  const tasks = [];

  // Always start with reading/theory if step-by-step preferred
  if (styles.includes("Step-by-step")) {
    tasks.push({
      title: `Read: ${getReadingTopic(weekNum, dayNum)}`,
      resource: "Course documentation or recommended articles",
    });
  }

  // Add video if preferred
  if (styles.includes("Video-first")) {
    tasks.push({
      title: `Watch: ${getVideoTopic(weekNum, dayNum)}`,
      resource: "Video tutorial series",
    });
  }

  // Always include hands-on practice if project-led
  if (styles.includes("Project-led")) {
    tasks.push({
      title: `Build: ${getPracticeTopic(weekNum, dayNum)}`,
      deliverable: "Working project component",
    });
  }

  return tasks.length > 0 ? tasks : [
    {
      title: `Study: ${intake.skill} fundamentals`,
      deliverable: "Notes and practice exercises",
    },
  ];
}

function getReadingTopic(weekNum: number, dayNum: number): string {
  return `Week ${weekNum} concepts - Day ${dayNum} fundamentals`;
}

function getVideoTopic(weekNum: number, dayNum: number): string {
  return `Week ${weekNum} tutorial series - Episode ${dayNum}`;
}

function getPracticeTopic(weekNum: number, dayNum: number): string {
  return `Week ${weekNum} exercises - Set ${dayNum}`;
}

function generateResources() {
  return [
    {
      label: "Official Documentation",
      type: "docs" as const,
      url: "https://docs.example.com",
    },
    {
      label: "Video Course Series",
      type: "video" as const,
      url: "https://courses.example.com",
    },
    {
      label: "Community Tutorial",
      type: "article" as const,
      url: "https://tutorial.example.com",
    },
  ];
}

function generateAssessments(weeksNeeded: number) {
  const assessments = [
    {
      when: "Week 2",
      rubric: "Complete basic exercises and demonstrate understanding of core concepts",
    },
    {
      when: `Week ${Math.ceil(weeksNeeded / 2)}`,
      rubric: "Build and present a functional project using learned skills",
    },
  ];

  if (weeksNeeded > 6) {
    assessments.push({
      when: `Week ${weeksNeeded}`,
      rubric: "Portfolio project review and demonstration of advanced techniques",
    });
  }

  return assessments;
}
