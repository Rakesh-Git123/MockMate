
import analyzeResumeWithGemini from "../resumeAnalyzerGemini.js";
export const resumeAnalyze=async(req,res)=>{

    try {
        const filePath = req.file.path;
        const result = await analyzeResumeWithGemini(filePath);
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Analysis failed" });
      }
}
