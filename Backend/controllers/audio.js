import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const API_KEY =
  process.env.API_KEY || "AIzaSyB0jG3go2sH-XVWWyKdYfipUJUZs9nuxdQ";
const fileManager = new GoogleAIFileManager(
  "AIzaSyB0jG3go2sH-XVWWyKdYfipUJUZs9nuxdQ"
);
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function evaluateSubmission(
  problemStatement,
  parameters,
  filePath,
  additionalInstructions = ""
) {
  const gradingBasis = "Low (0-0.5), Medium (1), High (2)";
  try {
    console.log(`Uploading file: ${filePath}`);
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: "audio/mp3", // Modify based on file type
      displayName: "Submission Audio",
    });

    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === FileState.PROCESSING) {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(uploadResult.file.name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error("Audio processing failed.");
    }

    console.log(`Uploaded file as: ${uploadResult.file.uri}`);

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
    
    **Submission Data (converted from PPT/audio given to you):

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

    const result = await model.generateContent([
      fullPrompt,
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    console.log("Evaluation Result:", result.response.text());
    return result.response.text();
  } catch (error) {
    console.error("Error in evaluation:", error);
    return null;
  }
}

// Example usage
const problemStatement =
  "Develop innovative and sustainable technological solutions to address urban environmental challenges.";
const parameters = ["Relevance", "Impact", "Explanation", "Narrative"];
const filePath =
  "/Users/adwayL/Desktop/projects/pijam/team13/Backend/uploads/telugu.mp3";

evaluateSubmission(problemStatement, parameters, filePath, "");
