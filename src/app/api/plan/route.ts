import { NextRequest, NextResponse } from "next/server";
import { GeneratePlanRequestSchema } from "@/lib/schemas";
import { MockLLMProvider } from "@/lib/mock-provider";

const mockProvider = new MockLLMProvider();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const parseResult = GeneratePlanRequestSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid request data", 
          details: parseResult.error.flatten() 
        },
        { status: 400 }
      );
    }

    const { intake, followupAnswers } = parseResult.data;

    // Generate learning plan using the mock provider
    const plan = await mockProvider.generatePlan(intake, followupAnswers);

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error generating plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Use POST to generate a learning plan" },
    { status: 405 }
  );
}
