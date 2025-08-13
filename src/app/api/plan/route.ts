import { NextRequest, NextResponse } from "next/server";
import { generatePlan } from "@/lib/mock-provider";
import { IntakeData, FollowupAnswers } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation for request data
    if (!body.intake || typeof body.intake !== 'object') {
      return NextResponse.json(
        { error: "Invalid request: missing intake data" },
        { status: 400 }
      );
    }

    const intake: IntakeData = body.intake;
    const followupAnswers: FollowupAnswers = body.followupAnswers || {};

    // Generate learning plan using the mock provider
    const plan = generatePlan(intake, followupAnswers);

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
