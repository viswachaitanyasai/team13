import { useState } from "react";
import axios from "axios";

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { question_text: "", options: ["", "", "", ""], correct_answer: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question_text = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correct_answer = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question_text: "", options: ["", "", "", ""], correct_answer: 0 },
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || questions.some(q => !q.question_text.trim())) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Assuming authentication token is stored
      await axios.post(
        "/api/quiz/create",
        { title, description, questions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Quiz created successfully!");
      setTitle("");
      setDescription("");
      setQuestions([{ question_text: "", options: ["", "", "", ""], correct_answer: 0 }]);
    } catch (error) {
      alert("Failed to create quiz.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a New Quiz</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Title</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded-lg mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter quiz title"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">Description</label>
        <textarea
          className="w-full border border-gray-300 p-2 rounded-lg mt-1"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter quiz description"
          rows={3}
        ></textarea>
      </div>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <label className="block text-gray-700 font-semibold">Question {qIndex + 1}</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded-lg mt-1"
            value={q.question_text}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            placeholder="Enter question text"
          />

          <div className="mt-3">
            <label className="block text-gray-700 font-semibold">Options</label>
            {q.options.map((opt, oIndex) => (
              <input
                key={oIndex}
                type="text"
                className="w-full border border-gray-300 p-2 rounded-lg mt-1"
                value={opt}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                placeholder={`Option ${oIndex + 1}`}
              />
            ))}
          </div>

          <div className="mt-3">
            <label className="block text-gray-700 font-semibold">Correct Answer</label>
            <select
              className="w-full border border-gray-300 p-2 rounded-lg mt-1"
              value={q.correct_answer}
              onChange={(e) => handleCorrectAnswerChange(qIndex, parseInt(e.target.value))}
            >
              {q.options.map((_, oIndex) => (
                <option key={oIndex} value={oIndex}>
                  Option {oIndex + 1}
                </option>
              ))}
            </select>
          </div>

          {questions.length > 1 && (
            <button
              onClick={() => removeQuestion(qIndex)}
              className="mt-3 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Remove Question
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Question
      </button>

      <button
        onClick={handleSubmit}
        className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Create Quiz"}
      </button>
    </div>
  );
};

export default CreateQuiz;
