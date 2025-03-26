const axios = require("axios");
require("dotenv").config();

async function analyzeStringsWithGemini(
  stringsArray,
  prompt,
  problemStatement
) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
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

    if (
      !response.data ||
      !response.data.candidates ||
      response.data.candidates.length === 0 ||
      !response.data.candidates[0].content ||
      !response.data.candidates[0].content.parts ||
      response.data.candidates[0].content.parts.length === 0
    ) {
      throw new Error("Invalid or empty response from Gemini API");
    }
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error(
      "Error analyzing data with Gemini:",
      error.response?.data || error.message
    );
    return null;
  }
}

// Function to summarize solution keywords
async function summarizeSolutionKeywords(solutionArray, problemStatement) {
  const prompt =
    "This is a set of keywords taken from student solutions in a hackathon. Each keyword is followed by its frequency. Provide a detailed summary highlighting the most used solutions in brief.Send it in a string format and less than 120 words. DOnt speak anything else. dont try to send bold letters";
  return await analyzeStringsWithGemini(
    solutionArray,
    prompt,
    problemStatement
  );
}

// Function to summarize skill gaps
async function summarizeSkillGaps(skillGapArray, problemStatement) {
  const prompt =
    "This is a set of keywords for skill gaps found by analyzing student submissions in a hackathon. Each keyword is accompanied by its frequency. Give us insights about skill gap from the data. Send it in a string format it should strictly be less than 120 words. Dont send bold letters. Dont give answers in points. Answer in a very small paragraph. DOnt speak anything else";
  console.log(skillGapArray);

  return await analyzeStringsWithGemini(
    skillGapArray,
    prompt,
    problemStatement
  );
}

module.exports = { summarizeSkillGaps, summarizeSolutionKeywords };
