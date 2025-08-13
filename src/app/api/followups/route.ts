import { NextRequest, NextResponse } from "next/server";
import { GenerateFollowupsRequestSchema } from "@/lib/schemas";
import { MockLLMProvider } from "@/lib/mock-provider";

const mockProvider = new MockLLMProvider();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const parseResult = GenerateFollowupsRequestSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid request data", 
          details: parseResult.error.flatten() 
        },
        { status: 400 }
      );
    }

    const { intake } = parseResult.data;

    // Generate follow-up questions using the mock provider
    const followups = await mockProvider.generateFollowups(intake);

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
