import OpenAI from 'openai';
import { IntakeData, FollowupAnswers, FollowupsPayload, Plan } from './types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout
});

export async function generateFollowups(intake: IntakeData): Promise<FollowupsPayload> {
  try {
    const prompt = `You are an expert curriculum designer. Based on the user's learning intake, generate 2-4 targeted follow-up questions to better understand their needs and customize their learning plan.

User's Intake:
- Skill/Subject: ${intake.skill}
- Target Goal: ${intake.targetGoal}
- Experience Level: ${intake.experienceLevel}
- Time Budget: ${intake.timeBudget} hours/week for ${intake.duration} weeks
- Learning Style: ${intake.learningStyle?.join(', ') || 'Not specified'}
- Tools Available: ${intake.tools || 'Not specified'}
- Constraints: ${intake.constraints || 'None'}

Generate follow-up questions that will help personalize their curriculum. Include a mix of:
1. Experience validation questions (single_select)
2. Learning preference questions (multi_select) 
3. Specific goal clarification (free_text)

IMPORTANT: Return ONLY valid JSON matching this exact schema:
{
  "questions": [
    {
      "id": "unique_string_id",
      "prompt": "Clear question text",
      "type": "single_select" | "multi_select" | "free_text",
      "options": ["option1", "option2"] // only for select types
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful curriculum design assistant. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content);
    
    // Validate the response structure
    if (!result.questions || !Array.isArray(result.questions)) {
      throw new Error("Invalid response structure from OpenAI");
    }

    return result as FollowupsPayload;
  } catch (error) {
    console.error("Error generating followups with OpenAI:", error);
    
    // Fallback to a basic set of questions if OpenAI fails
    return {
      questions: [
        {
          id: "experience_check",
          prompt: `You mentioned you're at a ${intake.experienceLevel} level with ${intake.skill}. Which best describes your current experience?`,
          type: "single_select",
          options: [
            "Complete beginner - never touched this topic",
            "Some theoretical knowledge but no hands-on experience", 
            "Built small projects or tutorials",
            "Professional experience in related areas"
          ]
        },
        {
          id: "learning_focus",
          prompt: "What aspects of your learning are most important to you?",
          type: "multi_select",
          options: [
            "Practical hands-on projects",
            "Understanding fundamental concepts",
            "Building a portfolio",
            "Preparing for job interviews",
            "Staying current with best practices"
          ]
        }
      ]
    };
  }
}

export async function generatePlan(intake: IntakeData, followupAnswers: FollowupAnswers): Promise<Plan> {
  try {
    const prompt = `You are an expert curriculum designer. Create a detailed, personalized learning plan based on the user's intake and follow-up responses.

User's Profile:
- Skill/Subject: ${intake.skill}
- Target Goal: ${intake.targetGoal}
- Experience Level: ${intake.experienceLevel}
- Time Budget: ${intake.timeBudget} hours/week
- Duration: ${intake.duration} weeks
- Learning Style: ${intake.learningStyle?.join(', ') || 'Not specified'}
- Tools Available: ${intake.tools || 'Not specified'}
- Constraints: ${intake.constraints || 'None'}

Follow-up Answers:
${Object.entries(followupAnswers).map(([key, value]) => 
  `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`
).join('\n')}

Create a comprehensive ${intake.duration}-week learning plan with:
1. Weekly themes and hour allocations
2. Daily learning tasks with time estimates
3. Milestones for each week
4. Relevant learning resources
5. Progress assessments

IMPORTANT: Return ONLY valid JSON matching this exact schema:
{
  "weeks": [
    {
      "week": 1,
      "theme": "Week theme",
      "hours_planned": 5,
      "milestones": ["milestone1", "milestone2"],
      "days": [
        {
          "day": 1,
          "time_est": 1.5,
          "tasks": [
            {
              "title": "Task description",
              "resource": "Resource name (optional)",
              "deliverable": "What to produce (optional)"
            }
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "label": "Resource name",
      "type": "video" | "article" | "docs",
      "url": "https://example.com"
    }
  ],
  "assessments": [
    {
      "when": "End of Week 2",
      "rubric": "Assessment description"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system", 
          content: "You are a helpful curriculum design assistant. Always respond with valid JSON only. Create practical, actionable learning plans."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content);
    
    // Validate the response structure
    if (!result.weeks || !Array.isArray(result.weeks)) {
      throw new Error("Invalid response structure from OpenAI");
    }

    return result as Plan;
  } catch (error) {
    console.error("Error generating plan with OpenAI:", error);
    
    // Fallback to a basic plan structure if OpenAI fails
    return {
      weeks: [
        {
          week: 1,
          theme: `Getting Started with ${intake.skill}`,
          hours_planned: intake.timeBudget,
          milestones: [
            "Set up development environment",
            "Complete first basic exercise"
          ],
          days: [
            {
              day: 1,
              time_est: Math.min(2, intake.timeBudget),
              tasks: [
                {
                  title: `Introduction to ${intake.skill} fundamentals`,
                  resource: "Getting Started Guide",
                  deliverable: "Notes on key concepts"
                }
              ]
            }
          ]
        }
      ],
      resources: [
        {
          label: `${intake.skill} Documentation`,
          type: "docs",
          url: "https://docs.example.com"
        }
      ],
      assessments: [
        {
          when: "End of Week 1", 
          rubric: "Complete basic exercises and demonstrate understanding of core concepts"
        }
      ]
    };
  }
}
