const axios = require("axios");
require("dotenv").config();

async function analyzeStringsWithGemini(
  stringsArray,
  prompt,
  problemStatement
) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Missing Gemini API key");
    }

    const formattedInput = `Problem Statement: ${problemStatement}\n\nPrompt: ${prompt}\n\nData:\n${stringsArray
      .map(([keyword, frequency]) => `${keyword}: ${frequency}`)
      .join("\n")}`;

    const data = {
      contents: [{ parts: [{ text: formattedInput }] }],
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      data
    );
    let contentText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return contentText;
  } catch (error) {
    console.log(
      "Error analyzing data with Gemini:",
      error.response?.data || error.message
    );
    return null;
  }
}

// Function to summarize solution keywords
async function summarizeSolutionKeywords(solutionSet, problemStatement) {
  const prompt =
    "This is a set of keywords which were taken from solutions that the  students submitted in a hackathon. Each keyword is followed by its frequency. Provide a detailed summary highlighting about the solutions ang give summary in brief";
  return await analyzeStringsWithGemini(solutionSet, prompt, problemStatement);
}

// Function to summarize skill gaps
async function summarizeSkillGaps(skillGapSet, problemStatement) {
  const prompt =
    "This is a set of keywords for skill gaps which was found by analysing student submissions in a hackathon. Each keyword is accompanied by its frequency of occurrence. Provide a summary of what the students lack in skill with required steps";
  return await analyzeStringsWithGemini(skillGapSet, prompt, problemStatement);
}

// Example usage
(async () => {
  const problemStatement =
    "Many students participating in the hackathon have demonstrated skill gaps in emerging technologies such as AI and machine learning. The challenge is to identify these gaps and propose effective solutions that can be implemented through education and training. Tell me about what type of solutions the students preffered the most. Keep it short and only send around 100 words and nothing else unrelated";

  const skillGapSet = [
    ["AI", 2],
    ["Machine learning", 87],
    ["Deep learning", 21],
  ];

  const solutionSet = [
    ["Online Courses", 45],
    ["Internships", 30],
    ["Mentorship", 18],
  ];

  const skillGapSummary = await summarizeSkillGaps(
    skillGapSet,
    problemStatement
  );
  console.log("Skill Gap Summary:", skillGapSummary);

  const solutionSummary = await summarizeSolutionKeywords(
    solutionSet,
    problemStatement
  );
  console.log("Solution Summary:", solutionSummary);
})();
