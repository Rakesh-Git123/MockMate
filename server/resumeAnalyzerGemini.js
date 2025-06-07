import { readFileSync } from "fs";
import pdfParse from "pdf-parse";


async function analyzeResumeWithGemini(filePath) {
  const pdfBuffer = readFileSync(filePath);
  const pdfData = await pdfParse(pdfBuffer);
  const resumeText = pdfData.text;

  const prompt = `
You are an advanced AI-powered ATS system. Analyze the following resume and return a score and 3 improvement suggestions in this exact format:

ATS Score: <score>/100

Improvement Suggestions:
1. <suggestion>
2. <suggestion>
3. <suggestion>

Resume:
${resumeText}
`;



  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";


    const atsScoreMatch = output.match(/(\d{1,3})\s*(\/|out of)?\s*100/i);

    const atsScore = atsScoreMatch ? parseInt(atsScoreMatch[1]) : 60;

    const suggestionsStart = output.toLowerCase().indexOf("suggestions");
    let suggestions = ["Improve formatting", "Add more action verbs", "Use keywords from job description"];

    if (suggestionsStart !== -1) {
      const suggestionsText = output.slice(suggestionsStart);
      suggestions = suggestionsText
        .split("\n")
        .map(line => line.trim().replace(/^\d+[\.\)]\s*/, ""))
        .filter(line => line && !line.toLowerCase().includes("suggestions"));
    }

    return {
      atsScore,
      suggestions
    };

  } catch (error) {
    console.error("Failed to fetch Gemini API:", error);
    return {
      atsScore: 0,
      suggestions: ["Could not analyze resume at this time. Please try again later."]
    };
  }
}

export default analyzeResumeWithGemini;
