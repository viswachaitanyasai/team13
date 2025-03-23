import React from "react";

function StudentVoice() {
  return (
    <section className="pb-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-amber-400 mb-6 relative inline-block">
          Personalized Feedback for Every Student’s Growth
          <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-28 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></span>
        </h2>

        <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
          No student should feel ignored. Our platform ensures that{" "}
          <a className="font-semibold text-white no-underline">every student</a>{" "}
          gets personalized{" "}
          <a className="font-semibold text-white no-underline">feedback</a> to
          understand their strengths and improve their skills effectively.
        </p>

        {/* Feature Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Side - Image/Illustration */}
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/vector-1741524477929-851d14f33eda?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdyb3d0aCUyMGFuZCUyMGltcHJvdmVtZW50fGVufDB8fDB8fHww"
              alt="Student Feedback"
              className="rounded-lg shadow-lg border border-gray-700 w-[400px] h-[400px]"
            />
          </div>

          {/* Right Side - Text Content */}
          <div className="text-left space-y-6">
            <div className="p-6 bg-gray-900 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl hover:shadow-amber-500/30 transition duration-300">
              <h3 className="text-xl font-bold text-amber-400">
                Personalized Feedback
              </h3>
              <p className="text-gray-400 mt-2">
                Every student receives{" "}
                <a className="font-semibold text-white no-underline">
                  detailed feedback
                </a>{" "}
                on their work, helping them recognize both their strengths and
                areas for improvement.
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl hover:shadow-amber-500/30 transition duration-300">
              <h3 className="text-xl font-bold text-amber-400">
                Actionable Insights
              </h3>
              <p className="text-gray-400 mt-2">
                Feedback is not just about scores—it’s about growth. We offer{" "}
                <a className="font-semibold text-white no-underline">
                  actionable steps
                </a>{" "}
                for students to enhance their understanding.
              </p>
            </div>
          </div>
        </div>

        {/* Closing Line */}
      </div>
      <div className="flex justify-center">
        <p className="text-white text-md mt-24 border-t border-white pt-8 w-[80%]"></p>
      </div>
    </section>
  );
}

export default StudentVoice;
