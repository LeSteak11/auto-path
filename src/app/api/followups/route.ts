import { NextRequest, NextResponse } from "next/server";
import { generateFollowups } from "@/lib/openai-provider";
import { IntakeData } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation for intake data
    if (!body.intake || typeof body.intake !== 'object') {
      return NextResponse.json(
        { error: "Invalid request: missing intake data" },
        { status: 400 }
      );
    }

    const intake: IntakeData = body.intake;

    // Generate follow-up questions using the OpenAI provider
    const followups = await generateFollowups(intake);

    return NextResponse.json(followups);
  } catch (error) {
    console.error("Error generating follow-ups:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Use POST to generate follow-up questions" },
    { status: 405 }
  );
}
