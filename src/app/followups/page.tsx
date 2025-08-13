"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function FollowupsContent() {
  const searchParams = useSearchParams();
  
  const intakeData = searchParams.get("intake");
  const followupsData = searchParams.get("followups");
  
  let intake = null;
  let followups = null;
  
  try {
    if (intakeData) intake = JSON.parse(intakeData);
    if (followupsData) followups = JSON.parse(followupsData);
  } catch (error) {
    console.error("Error parsing URL params:", error);
  }

  if (!intake || !followups) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">No Data Found</h1>
            <p className="text-slate-300 mb-6">
              It looks like you navigated here directly. Please start from the intake form.
            </p>
            <Link
              href="/intake"
              className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Go to Intake
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="text-sm font-medium text-indigo-400 mb-2">AUTOPATH</div>
            <h1 className="text-3xl font-bold mb-2">Follow-up Questions</h1>
            <p className="text-slate-300">
              {"Based on your goal: "}&ldquo;{intake.targetGoal}&rdquo;
            </p>
          </div>

          {/* Intake Summary */}
          <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Your Intake Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-400">Skill:</span> {intake.skill}</div>
              <div><span className="text-slate-400">Experience:</span> {intake.experienceLevel}</div>
              <div><span className="text-slate-400">Time Budget:</span> {intake.timeBudget} hrs/week</div>
              <div><span className="text-slate-400">Duration:</span> {intake.duration} weeks</div>
              <div className="sm:col-span-2">
                <span className="text-slate-400">Learning Style:</span> {intake.learningStyle?.join(", ") || "Not specified"}
              </div>
            </div>
          </div>

          {/* Generated Questions */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Generated Follow-up Questions</h2>
            
            {followups.questions?.map((question: { id: string; prompt: string; type: string; options?: string[] }, index: number) => (
              <div key={question.id} className="bg-slate-900/30 border border-slate-600 rounded-lg p-4">
                <h3 className="font-medium mb-2">
                  {index + 1}. {question.prompt}
                </h3>
                <div className="text-sm text-slate-400 mb-2">
                  Type: {question.type.replace("_", " ")}
                </div>
                
                {question.type === "single_select" && question.options && (
                  <ul className="list-disc list-inside text-slate-300 ml-4">
                    {question.options.map((option: string, optIndex: number) => (
                      <li key={optIndex}>{option}</li>
                    ))}
                  </ul>
                )}
                
                {question.type === "multi_select" && question.options && (
                  <ul className="list-disc list-inside text-slate-300 ml-4">
                    {question.options.map((option: string, optIndex: number) => (
                      <li key={optIndex}>{option}</li>
                    ))}
                  </ul>
                )}
                
                {question.type === "free_text" && (
                  <p className="text-slate-300 italic ml-4">Free text response expected</p>
                )}
              </div>
            ))}
          </div>

          {/* Placeholder for future functionality */}
          <div className="mt-8 p-4 bg-slate-900/50 border border-slate-600 rounded-lg">
            <h3 className="font-medium mb-2">🚧 Next Steps (Coming in Step 4)</h3>
            <p className="text-slate-400 text-sm">
              The follow-up form interface will be implemented next, allowing you to answer these questions and generate your personalized learning plan.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Link
              href="/intake"
              className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              ← Back to Intake
            </Link>
            <button
              disabled
              className="bg-slate-600 text-slate-400 font-medium px-6 py-3 rounded-lg cursor-not-allowed"
            >
              Answer Questions → (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FollowupsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-slate-400">Loading follow-ups...</div>
      </div>
    }>
      <FollowupsContent />
    </Suspense>
  );
}

FollowupsPage.displayName = 'FollowupsPage';

export default FollowupsPage;
