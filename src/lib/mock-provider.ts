import { IntakeData, FollowupsPayload, FollowupAnswers, Plan } from "./types";

export class MockLLMProvider {
  /**
   * Generate follow-up questions based on intake data
   */
  async generateFollowups(intake: IntakeData): Promise<FollowupsPayload> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate contextual follow-ups based on intake
    const baseQuestions = [
      {
        id: "experience",
        prompt: `You mentioned you're at a ${intake.currentLevel} level. Which of these best describes your experience?`,
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
    
    if (intake.goal.toLowerCase().includes("web") || intake.goal.toLowerCase().includes("frontend")) {
      goalSpecificQuestions.push({
        id: "frontend_focus",
        prompt: "Which frontend technologies are you most interested in?",
        type: "multi_select" as const,
        options: ["React", "Vue", "Angular", "Vanilla JavaScript", "TypeScript"],
      });
    }

    if (intake.goal.toLowerCase().includes("backend") || intake.goal.toLowerCase().includes("api")) {
      goalSpecificQuestions.push({
        id: "backend_focus",
        prompt: "What type of backend development interests you most?",
        type: "single_select" as const,
        options: ["REST APIs", "GraphQL", "Microservices", "Database design", "DevOps"],
      });
    }

    // Add time-specific question if tight deadline
    if (intake.deadline && new Date(intake.deadline) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)) {
      goalSpecificQuestions.push({
        id: "priority",
        prompt: "Given your timeline, what's most important to focus on first?",
        type: "free_text" as const,
      });
    }

    return {
      questions: [...baseQuestions, ...goalSpecificQuestions],
    };
  }

  /**
   * Generate learning plan based on intake and follow-up answers
   */
  async generatePlan(intake: IntakeData, followupAnswers: FollowupAnswers): Promise<Plan> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Calculate plan duration based on time commitment
    const weeksNeeded = Math.max(4, Math.min(12, Math.ceil(40 / intake.timeCommitment)));
    
    const weeks = [];
    for (let weekNum = 1; weekNum <= weeksNeeded; weekNum++) {
      weeks.push({
        week: weekNum,
        theme: this.generateWeekTheme(weekNum, intake.goal),
        hours_planned: intake.timeCommitment,
        milestones: this.generateMilestones(weekNum, intake.goal),
        days: this.generateDaysForWeek(weekNum, intake),
      });
    }

    return {
      weeks,
      resources: this.generateResources(intake),
      assessments: this.generateAssessments(weeksNeeded),
    };
  }

  private generateWeekTheme(weekNum: number, goal: string): string {
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
    
    return themes[Math.min(weekNum - 1, themes.length - 1)] || `Advanced ${goal} Topics`;
  }

  private generateMilestones(weekNum: number, goal: string): string[] {
    const baseMilestones = [
      [`Complete environment setup`, `Understand basic ${goal} concepts`],
      [`Build first simple example`, `Grasp fundamental patterns`],
      [`Complete guided tutorial`, `Implement core features`],
      [`Finish first independent project`, `Apply learned concepts`],
      [`Master advanced techniques`, `Optimize your solutions`],
    ];

    return baseMilestones[Math.min(weekNum - 1, baseMilestones.length - 1)] || 
           [`Advanced ${goal} milestone`, `Portfolio project progress`];
  }

  private generateDaysForWeek(weekNum: number, intake: IntakeData) {
    const daysPerWeek = Math.ceil(intake.timeCommitment / 7) > 1 ? 5 : 3;
    const hoursPerDay = intake.timeCommitment / daysPerWeek;

    return Array.from({ length: daysPerWeek }, (_, i) => ({
      day: i + 1,
      time_est: Math.round(hoursPerDay * 10) / 10,
      tasks: this.generateTasksForDay(weekNum, i + 1, intake),
    }));
  }

  private generateTasksForDay(weekNum: number, dayNum: number, intake: IntakeData) {
    const formats = intake.preferredFormat;
    const tasks = [];

    // Always start with reading/theory
    if (formats.includes("article") || formats.includes("documentation")) {
      tasks.push({
        title: `Read: ${this.getReadingTopic(weekNum, dayNum)}`,
        resource: "Course documentation or recommended articles",
      });
    }

    // Add video if preferred
    if (formats.includes("video")) {
      tasks.push({
        title: `Watch: ${this.getVideoTopic(weekNum, dayNum)}`,
        resource: "Video tutorial series",
      });
    }

    // Always include hands-on practice
    if (formats.includes("hands-on")) {
      tasks.push({
        title: `Practice: ${this.getPracticeTopic(weekNum, dayNum)}`,
        deliverable: "Working code examples",
      });
    }

    return tasks.length > 0 ? tasks : [
      {
        title: `Study: ${intake.goal} fundamentals`,
        deliverable: "Notes and practice exercises",
      },
    ];
  }

  private getReadingTopic(weekNum: number, dayNum: number): string {
    return `Week ${weekNum} concepts - Day ${dayNum} fundamentals`;
  }

  private getVideoTopic(weekNum: number, dayNum: number): string {
    return `Week ${weekNum} tutorial series - Episode ${dayNum}`;
  }

  private getPracticeTopic(weekNum: number, dayNum: number): string {
    return `Week ${weekNum} exercises - Set ${dayNum}`;
  }

  private generateResources(intake: IntakeData) {
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

  private generateAssessments(weeksNeeded: number) {
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
}
