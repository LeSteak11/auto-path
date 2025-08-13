"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IntakeSchema } from "@/lib/schemas";
import { IntakeData } from "@/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

function IntakePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IntakeData>({
    resolver: zodResolver(IntakeSchema),
    defaultValues: {
      learningStyle: [],
    },
  });

  const onSubmit = async (data: IntakeData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/followups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ intake: data }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate follow-ups");
      }

      const followups = await response.json();
      
      // Pass data via URL params (simple approach)
      const searchParams = new URLSearchParams({
        intake: JSON.stringify(data),
        followups: JSON.stringify(followups),
      });
      
      router.push(`/followups?${searchParams.toString()}`);
    } catch (error) {
      console.error("Error submitting intake:", error);
      // TODO(error): Add proper error handling UI
      alert("Error generating follow-ups. Please try again.");
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
            <h1 className="text-3xl font-bold mb-2">Learning Intake</h1>
            <p className="text-slate-300">
              Tell us about your learning goals so we can create a personalized curriculum.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Skill */}
            <div>
              <label htmlFor="skill" className="block text-sm font-medium mb-2">
                Skill/Subject *
              </label>
              <input
                {...register("skill")}
                type="text"
                id="skill"
                placeholder="e.g., React, Python, Data Science..."
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                aria-describedby={errors.skill ? "skill-error" : undefined}
              />
              {errors.skill && (
                <p id="skill-error" className="text-red-400 text-sm mt-1">
                  {errors.skill.message}
                </p>
              )}
            </div>

            {/* Goal */}
            <div>
              <label htmlFor="targetGoal" className="block text-sm font-medium mb-2">
                Target Goal/Outcome *
              </label>
              <textarea
                {...register("targetGoal")}
                id="targetGoal"
                rows={3}
                placeholder="Describe what you want to achieve..."
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                aria-describedby={errors.targetGoal ? "targetGoal-error" : undefined}
              />
              {errors.targetGoal && (
                <p id="targetGoal-error" className="text-red-400 text-sm mt-1">
                  {errors.targetGoal.message}
                </p>
              )}
            </div>

            {/* Time Budget and Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="timeBudget" className="block text-sm font-medium mb-2">
                  Time Budget (hours/week) *
                </label>
                <input
                  {...register("timeBudget", { valueAsNumber: true })}
                  type="number"
                  id="timeBudget"
                  min="1"
                  placeholder="5"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  aria-describedby={errors.timeBudget ? "timeBudget-error" : undefined}
                />
                {errors.timeBudget && (
                  <p id="timeBudget-error" className="text-red-400 text-sm mt-1">
                    {errors.timeBudget.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium mb-2">
                  Duration (weeks) *
                </label>
                <input
                  {...register("duration", { valueAsNumber: true })}
                  type="number"
                  id="duration"
                  min="1"
                  placeholder="8"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  aria-describedby={errors.duration ? "duration-error" : undefined}
                />
                {errors.duration && (
                  <p id="duration-error" className="text-red-400 text-sm mt-1">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium mb-2">
                Experience Level *
              </label>
              <select
                {...register("experienceLevel")}
                id="experienceLevel"
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                aria-describedby={errors.experienceLevel ? "experienceLevel-error" : undefined}
              >
                <option value="">Select your level...</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {errors.experienceLevel && (
                <p id="experienceLevel-error" className="text-red-400 text-sm mt-1">
                  {errors.experienceLevel.message}
                </p>
              )}
            </div>

            {/* Tools/Hardware */}
            <div>
              <label htmlFor="tools" className="block text-sm font-medium mb-2">
                Tools/Hardware
              </label>
              <input
                {...register("tools")}
                type="text"
                id="tools"
                placeholder="laptop, IDE, specific software... (comma-separated)"
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Learning Style */}
            <div>
              <div className="block text-sm font-medium mb-3">Learning Style *</div>
              <div className="space-y-2">
                {["Video-first", "Step-by-step", "Project-led"].map((style) => (
                  <label key={style} className="flex items-center">
                    <input
                      {...register("learningStyle")}
                      type="checkbox"
                      value={style}
                      className="bg-slate-900/60 border border-slate-700 rounded text-indigo-500 focus:ring-indigo-500 focus:ring-2 mr-3"
                    />
                    <span className="text-slate-100">{style}</span>
                  </label>
                ))}
              </div>
              {errors.learningStyle && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.learningStyle.message}
                </p>
              )}
            </div>

            {/* Constraints */}
            <div>
              <label htmlFor="constraints" className="block text-sm font-medium mb-2">
                Constraints (optional)
              </label>
              <textarea
                {...register("constraints")}
                id="constraints"
                rows={2}
                placeholder="Any limitations, preferences, or special requirements..."
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <p className="text-slate-400 text-sm mb-4">
                {"We'll ask a few tailored follow-ups next."}
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {isSubmitting ? "Generating Follow-ups..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

IntakePage.displayName = 'IntakePage';

export default IntakePage;
