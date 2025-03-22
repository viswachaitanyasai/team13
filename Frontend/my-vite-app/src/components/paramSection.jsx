import React from "react";

function CustomizableEvaluation() {
  return (
    <section className="pb-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-cyan-400 mb-6">
          Advanced Evaluation Customization
        </h2>
        <p className="text-gray-200 text-md max-w-3xl mx-auto mb-12">
          Personalize the evaluation process with detailed feedback, improvement
          suggestions, and AI-driven reasoning. Gain deeper insights into
          student performance.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="p-6 bg-gray-900 rounded-lg shadow-lg hover:bg-gray-700 transition">
              <h3 className="text-xl font-bold text-cyan-400">
                Detailed Feedback
              </h3>
              <p className="text-gray-400 mt-2">
                Get AI-generated feedback on each solution, highlighting areas
                of improvement.
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-lg shadow-lg hover:bg-gray-700 transition">
              <h3 className="text-xl font-bold text-cyan-400">
                Improvement Suggestions
              </h3>
              <p className="text-gray-400 mt-2">
                Provide targeted suggestions to help students refine their
                submissions.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="p-6 bg-gray-900 rounded-lg shadow-lg hover:bg-gray-700 transition">
              <h3 className="text-xl font-bold text-cyan-400">
                Score Reasoning
              </h3>
              <p className="text-gray-400 mt-2">
                Understand why scores were assigned with clear explanations from
                the system.
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-lg shadow-lg hover:bg-gray-700 transition">
              <h3 className="text-xl font-bold text-cyan-400">
                Custom Instructions
              </h3>
              <p className="text-gray-400 mt-2">
                Define specific rules and guidelines for how the evaluation
                model assesses solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomizableEvaluation;
