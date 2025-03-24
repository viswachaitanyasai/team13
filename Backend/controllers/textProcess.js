const axios = require("axios");

async function evaluateSubmission({
  apiKey,
  problemStatement,
  parameters,
  gradingBasis,
  submissionText,
  additionalInstructions = "",
}) {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Constructing the prompt dynamically
  const fullPrompt = `
    You are an AI agent evaluating hackathon submissions. STRICTLY follow these rules:
    
    - **Be extremely strict in evaluation** as we receive over **200,000 submissions and select only 1,000.**
    - **Low-effort or very short or unclear submissions must get a score of ZERO in all parameters.**
    - **Total score must always be the sum of all parameter scores.**
    - **If a submission lacks a clear explanation, effort, or relation to the problem statement, give a total score of 0.**
    - **If it only states a vague idea without detailed steps or implementation, give 0.**
    - **Do NOT provide confirmations or explanations outside of the JSON format.**
    - Be very very harsh
    **Evaluation Guidelines:**
    - **Check if the solution is related to the problem statement**. If not, score = **0**.
    - **Check if the solution is detailed and actually proposes a valid solution**. If it is just an idea without implementation, score = **0**.
    - **Check clarity**: If unclear, missing key points, or overly generic, score = **0**.
    - **Low-effort responses (short, generic, or superficial)** = **0 marks in all parameters**.
    - **A good solution should clearly describe the methodology, tools, and real-world applicability.**

    **Problem Statement:** ${problemStatement}
    
    **Parameters:** ${parameters.join(", ")}
    
    **Grading Basis:** ${gradingBasis}
    
    ${additionalInstructions}
    
    **Submission Data (converted from PPT/audio):** ${submissionText}

    **Return Structure (strictly JSON):**
    {
      "score": "",   // Total score (must be sum of all parameter scores)
      "reason": "",  // Detailed reasoning for the total score
      "parameter": [
        { "name": "", "score": "", "reason": "" }  // Breakdown of parameter scores
      ],
      "improvement": ["", ""], // Suggested improvements
      "actionable_steps":["",],
      "strengths":["",],
      "solutionSummary": ["", ""] // Key takeaway from submission
    }
    
    **Ensure the response is in pure JSON format with no extra formatting.**
  `;

  const data = {
    contents: [{ parts: [{ text: fullPrompt }] }],
  };

  try {
    const response = await axios.post(URL, data);
    let contentText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Clean up the response in case it's wrapped in code blocks
    contentText = contentText.replace(/```json|```/g, "").trim();

    // Parse and return the cleaned JSON response
    return JSON.parse(contentText);
  } catch (error) {
    console.error(
      "Error evaluating submission:",
      error.response?.data || error.message
    );
    return null;
  }
}

// Example usage
evaluateSubmission({
  apiKey: "AIzaSyB0jG3go2sH-XVWWyKdYfipUJUZs9nuxdQ",
  problemStatement:
    "Develop sustainable solutions for urban environmental challenges.",
  parameters: ["Relevance", "Impact", "Clarity"],
  gradingBasis: "Low (0-0.5), Medium (1), High (2)",
  submissionText:
    "This project focuses on AI-powered smart city solutions integrating IoT for air quality and waste management.",
  additionalInstructions:
    "Make sure to consider feasibility and scalability of the solution.",
}).then((result) => console.log("Evaluation Result:", result));
