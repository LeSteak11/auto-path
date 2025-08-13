"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import { FollowupQuestion, FollowupAnswers } from "@/lib/types";

function FollowupsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [answers, setAnswers] = useState<FollowupAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultiSelectChange = (questionId: string, option: string, checked: boolean) => {
    const currentAnswers = (answers[questionId] as string[]) || [];
    if (checked) {
      handleAnswerChange(questionId, [...currentAnswers, option]);
    } else {
      handleAnswerChange(questionId, currentAnswers.filter(a => a !== option));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intake: intake,
          followupAnswers: answers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const plan = await response.json();
      
      // Navigate to plan page (we'll create this placeholder)
      const searchParams = new URLSearchParams({
        intake: JSON.stringify(intake),
        answers: JSON.stringify(answers),
        plan: JSON.stringify(plan),
      });
      
      router.push(`/plan?${searchParams.toString()}`);
    } catch (error) {
      console.error("Error generating plan:", error);
      alert("Error generating learning plan. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Questions */}
            {followups.questions?.map((question: FollowupQuestion, index: number) => (
              <div key={question.id} className="bg-slate-900/30 border border-slate-600 rounded-lg p-6">
                <h3 className="font-medium mb-4 text-slate-100">
                  {index + 1}. {question.prompt}
                </h3>
                
                {question.type === "single_select" && question.options && (
                  <div className="space-y-3">
                    {question.options.map((option: string) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-4 h-4 text-indigo-500 bg-slate-900 border-slate-600 focus:ring-indigo-500 focus:ring-2 mr-3"
                        />
                        <span className="text-slate-300">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {question.type === "multi_select" && question.options && (
                  <div className="space-y-3">
                    {question.options.map((option: string) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value={option}
                          onChange={(e) => handleMultiSelectChange(question.id, option, e.target.checked)}
                          className="w-4 h-4 text-indigo-500 bg-slate-900 border-slate-600 rounded focus:ring-indigo-500 focus:ring-2 mr-3"
                        />
                        <span className="text-slate-300">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {question.type === "free_text" && (
                  <textarea
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Type your answer here..."
                    rows={3}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                )}
              </div>
            ))}

            {/* Submit Section */}
            <div className="border-t border-slate-700 pt-6">
              <div className="flex justify-between items-center">
                <p className="text-slate-400 text-sm">
                  {"We'll generate your personalized learning plan next."}
                </p>
                <div className="space-x-4">
                  <Link
                    href="/intake"
                    className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    ← Back
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating Plan...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Generate Plan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
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
