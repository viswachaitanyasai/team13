import { useState } from "react";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    feedback: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4">
      <div className="w-full max-w-4xl bg-white bg-opacity-10 backdrop-blur-lg border border-gray-700 rounded-3xl shadow-xl p-8 text-white">
        <h2 className="text-3xl font-bold text-indigo-400 text-center mb-4">
          Provide Feedback
        </h2>
        <p className="text-gray-300 text-center mb-6">
          Help us improve the Delhi Smart Traffic & Pollution Management System.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-900 bg-opacity-40 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-900 bg-opacity-40 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Feedback Category */}
          <div>
            <label className="block text-sm mb-2">Feedback Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-900 bg-opacity-40 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="">Select a category</option>
              <option value="traffic">Traffic</option>
              <option value="pollution">Pollution</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* Feedback Textarea */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-2">Your Feedback</label>
            <textarea
              name="feedback"
              placeholder="Please provide your feedback here"
              value={formData.feedback}
              onChange={handleChange}
              className="w-full h-28 px-4 py-3 rounded-lg bg-gray-900 bg-opacity-40 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="w-full md:w-1/2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition shadow-lg"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
