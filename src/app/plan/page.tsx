"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import { IntakeData, Plan } from "@/lib/types";

function PlanContent() {
  const searchParams = useSearchParams();
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1])); // Week 1 expanded by default
  const [isPrinting, setIsPrinting] = useState(false);
  
  const intakeData = searchParams.get("intake");
  const planData = searchParams.get("plan");
  
  let intake: IntakeData | null = null;
  let plan: Plan | null = null;
  
  try {
    if (intakeData) intake = JSON.parse(intakeData);
    if (planData) plan = JSON.parse(planData);
  } catch (error) {
    console.error("Error parsing URL params:", error);
  }

  const handleCopyJSON = async () => {
    try {
      const exportData = {
        intake,
        plan,
        generatedAt: new Date().toISOString(),
        exportedBy: "AutoPath"
      };
      
      await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      setExportSuccess("JSON copied to clipboard!");
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (error) {
      console.error("Failed to copy JSON:", error);
      setExportSuccess("Failed to copy JSON");
      setTimeout(() => setExportSuccess(null), 3000);
    }
  };

  const handlePrintPDF = () => {
    // Store current expanded state
    const currentExpandedWeeks = new Set(expandedWeeks);
    
    // Temporarily expand all weeks for printing
    setIsPrinting(true);
    if (plan?.weeks) {
      setExpandedWeeks(new Set(plan.weeks.map(week => week.week)));
    }
    
    // Small delay to ensure state updates, then print
    setTimeout(() => {
      window.print();
      
      // Restore previous expanded state after print dialog
      setTimeout(() => {
        setExpandedWeeks(currentExpandedWeeks);
        setIsPrinting(false);
      }, 500);
    }, 100);
  };

  const toggleWeek = (weekNumber: number) => {
    if (isPrinting) return; // Don't allow toggling during print
    
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);
    }
    setExpandedWeeks(newExpanded);
  };

  if (!intake || !plan) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
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
    <div className="min-h-screen p-4 print:p-0">
      <div className="max-w-4xl mx-auto">
        {/* Header with Export Controls */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow p-6 mb-6 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-indigo-400 mb-1">AUTOPATH</div>
              <h1 className="text-2xl font-bold">Your Learning Plan</h1>
              <p className="text-slate-300 text-sm mt-1">
                Personalized curriculum for: &ldquo;{intake.targetGoal}&rdquo;
              </p>
              <p className="text-slate-400 text-xs mt-2 max-w-md">
                This is your personalized learning plan. Click a week to expand and see your goals, schedule, and resources. You can check off tasks as you complete them.
              </p>
            </div>
            
            {/* Export Buttons */}
            <div className="flex items-center space-x-3">
              {exportSuccess && (
                <div className="text-green-400 text-sm font-medium">
                  {exportSuccess}
                </div>
              )}
              <button
                onClick={handleCopyJSON}
                className="bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy JSON</span>
              </button>
              <button
                onClick={handlePrintPDF}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Print Header (only visible when printing) */}
        <div className="hidden print:block mb-8">
          <div className="text-center border-b border-gray-300 pb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AutoPath Learning Plan</h1>
            <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
            <p className="text-gray-800 font-medium mt-2">Goal: {intake.targetGoal}</p>
          </div>
        </div>

        {/* Main Plan Content */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow p-8 print:bg-white print:border-0 print:shadow-none">
          {/* Plan Overview */}
          <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-6 mb-8 print:bg-gray-50 print:border-gray-200">
            <h2 className="text-xl font-semibold mb-4 print:text-gray-900">Plan Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-400 print:text-indigo-600">{plan.weeks?.length || 0}</div>
                <div className="text-sm text-slate-400 print:text-gray-600">Weeks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-400 print:text-indigo-600">
                  {plan.weeks?.reduce((total, week) => total + week.hours_planned, 0) || 0}
                </div>
                <div className="text-sm text-slate-400 print:text-gray-600">Total Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-400 print:text-indigo-600">{plan.resources?.length || 0}</div>
                <div className="text-sm text-slate-400 print:text-gray-600">Resources</div>
              </div>
            </div>
          </div>

          {/* Learning Weeks */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold print:text-gray-900">Weekly Learning Plan</h2>
            
            {plan.weeks?.map((week, index) => {
              const isExpanded = expandedWeeks.has(week.week) || isPrinting;
              
              return (
                <div key={index} className="bg-slate-900/30 border border-slate-600 rounded-lg print:bg-white print:border print:border-gray-300 print:rounded-none break-inside-avoid">
                  {/* Week Header - Always Visible */}
                  <div 
                    className={`p-6 cursor-pointer hover:bg-slate-900/50 transition-colors print:cursor-auto print:hover:bg-transparent ${isExpanded ? 'border-b border-slate-600 print:border-gray-300' : ''}`}
                    onClick={() => toggleWeek(week.week)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium print:text-gray-900 flex items-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-500 text-white text-sm font-bold rounded-full mr-3 print:bg-indigo-600">
                          {week.week}
                        </span>
                        {week.theme}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full print:text-gray-600 print:bg-gray-100">
                          {week.hours_planned} hours
                        </span>
                        <div className="print:hidden">
                          <svg 
                            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Week Content - Collapsible */}
                  <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 print:max-h-none print:opacity-100'}`}>
                    <div className="p-6 pt-0 print:pt-6">
                      {week.milestones && week.milestones.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-medium mb-3 text-indigo-300 print:text-indigo-700">🎯 Week Goals:</h4>
                          <div className="grid gap-2">
                            {week.milestones.map((milestone, milestoneIndex) => (
                              <div key={milestoneIndex} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0 print:bg-indigo-600"></div>
                                <span className="text-slate-300 text-sm print:text-gray-700">{milestone}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {week.days && week.days.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3 text-indigo-300 print:text-indigo-700">📅 Daily Schedule:</h4>
                          <div className="grid gap-3">
                            {week.days.map((day, dayIndex) => (
                              <div key={dayIndex} className="bg-slate-900/50 rounded-lg p-4 print:bg-gray-50 print:border print:border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-medium text-sm text-indigo-200 print:text-indigo-800">
                                    Day {day.day}
                                  </span>
                                  <span className="text-xs text-slate-400 print:text-gray-500">
                                    {day.time_est} hours
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  {day.tasks.map((task, taskIndex) => (
                                    <div key={taskIndex} className="flex items-start space-x-3">
                                      <input 
                                        type="checkbox" 
                                        className="mt-1 w-4 h-4 text-indigo-500 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500 print:border-gray-400"
                                      />
                                      <div className="flex-1">
                                        <span className="text-slate-300 text-sm print:text-gray-700">{task.title}</span>
                                        {task.resource && (
                                          <div className="text-indigo-300 text-xs mt-1 print:text-indigo-600">
                                            📖 {task.resource}
                                          </div>
                                        )}
                                        {task.deliverable && (
                                          <div className="text-emerald-400 text-xs mt-1 print:text-emerald-600">
                                            ✅ Deliverable: {task.deliverable}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resources */}
          {plan.resources && plan.resources.length > 0 && (
            <div className="mt-8 break-inside-avoid">
              <h2 className="text-xl font-semibold mb-4 print:text-gray-900">📚 Learning Resources</h2>
              <div className="bg-slate-900/30 border border-slate-600 rounded-lg p-6 print:bg-white print:border print:border-gray-300">
                <div className="grid gap-4">
                  {plan.resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg print:bg-gray-50 print:border print:border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {resource.type === 'video' && (
                            <div className="w-8 h-8 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center print:text-red-600">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          )}
                          {resource.type === 'article' && (
                            <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center print:text-blue-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                          {resource.type === 'docs' && (
                            <div className="w-8 h-8 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center print:text-green-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-200 print:text-gray-900">{resource.label}</div>
                          <div className="text-sm text-slate-400 capitalize print:text-gray-600">{resource.type}</div>
                        </div>
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium print:text-indigo-600 print:no-underline"
                      >
                        View →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Assessments */}
          {plan.assessments && plan.assessments.length > 0 && (
            <div className="mt-8 break-inside-avoid">
              <h2 className="text-xl font-semibold mb-4 print:text-gray-900">🎯 Progress Assessments</h2>
              <div className="bg-slate-900/30 border border-slate-600 rounded-lg p-6 print:bg-white print:border print:border-gray-300">
                <div className="space-y-4">
                  {plan.assessments.map((assessment, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-slate-900/50 rounded-lg print:bg-gray-50 print:border print:border-gray-200">
                      <div className="w-8 h-8 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center flex-shrink-0 print:text-amber-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-slate-200 print:text-gray-900">{assessment.when}</div>
                        <div className="text-sm text-slate-400 mt-1 print:text-gray-600">{assessment.rubric}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="mt-6 print:hidden">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">
                  Your personalized learning plan is ready! Export it or refine your preferences.
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Generated by AutoPath • {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/followups"
                  className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  ← Refine Plan
                </Link>
                <Link
                  href="/intake"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Create New Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-slate-400">Generating your plan...</div>
      </div>
    }>
      <PlanContent />
    </Suspense>
  );
}

PlanPage.displayName = 'PlanPage';

export default PlanPage;
