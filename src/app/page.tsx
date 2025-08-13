import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow p-8">
          <div className="text-sm font-medium text-indigo-400 mb-2">AUTOPATH</div>
          <h1 className="text-4xl font-bold mb-4">
            AI-Powered Learning Curriculum Generator
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Create personalized learning paths with dynamic follow-ups and structured plans tailored to your goals.
          </p>
          <Link
            href="/intake"
            className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-8 py-3 rounded-lg transition-colors"
          >
            Start Your Path
          </Link>
        </div>
      </div>
    </div>
  );
}
