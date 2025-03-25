const Quiz = require("../models/Quiz");
const QuizSubmission = require("../models/QuizSubmission");
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    console.log(req.body);
    if (!req.user) {
      return res
        .status(403)
        .json({ error: "Unauthorized. Only teachers can create quizzes." });
    }
    if (!title || !description || !questions || questions.length === 0) {
      return res.status(400).json({
        error: "Title, description, and at least one question are required.",
      });
    }
    const quiz = new Quiz({
      title,
      description,
      questions,
      created_by: req.user.id, // Assuming authentication middleware
    });

    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ is_active: true }).populate(
      "created_by",
      "name email"
    );
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.submitQuiz = async (req, res) => {
  try {
    const { quiz_id, answers } = req.body;
    const quiz = await Quiz.findById(quiz_id);

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (q.correct_answer === answers[index]) {
        score += 1;
      }
    });

    const submission = new QuizSubmission({
      quiz_id,
      student_id: req.student.id, // Assuming authentication middleware
      answers,
      score,
    });

    await submission.save();
    res.json({ message: "Quiz submitted successfully", score });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).populate("created_by", "name email");

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error from fetch quiz by id" });
  }
};
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Only allow the teacher who created the quiz to delete it
    if (quiz.created_by._id.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this quiz" });
    }

    await Quiz.findByIdAndDelete(id);

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.fetchMyQuizzes = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Invalid token. Teacher not found." });
    }
    const quizzes = await Quiz.find({ created_by: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Server error" });
  }
};
