import React, { useState } from "react";
import Navbar from "../components/Navbar";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
  };

  const handleAnalyze = async () => {
    if (!file) return alert("Please upload your resume!");

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("https://mockmate-ntab.onrender.com/api/resume/analyze", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      setScore(data.atsScore);
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Score color based on value
  const getScoreColor = () => {
    if (!score) return "text-gray-600";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-2xl mx-auto my-10 p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100 transform transition-all hover:shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Resume ATS Analyzer</h2>
        <p className="text-gray-600">Upload your resume to check its compatibility with Applicant Tracking Systems</p>
      </div>

      <div className="mb-6">
        <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="mt-2 text-base font-medium text-gray-700">
            {fileName || "Choose a PDF file"}
          </span>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </label>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading || !file}
        className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all ${loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 shadow-lg hover:shadow-xl'}`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </span>
        ) : "Analyze Resume"}
      </button>

      {score !== null && (
        <div className="mt-8 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">ATS Score:</h3>
            <div className={`text-4xl font-bold mb-4 ${getScoreColor()}`}>
              {score} <span className="text-2xl">/ 100</span>
            </div>
            
            {score >= 80 && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 border border-green-200">
                <strong>Excellent!</strong> Your resume is well optimized for ATS systems.
              </div>
            )}
            {score >= 60 && score < 80 && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-lg mb-4 border border-blue-200">
                <strong>Good!</strong> Your resume is decent but could use some improvements.
              </div>
            )}
            {score >= 40 && score < 60 && (
              <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg mb-4 border border-yellow-200">
                <strong>Needs work.</strong> Your resume might have trouble passing through ATS filters.
              </div>
            )}
            {score < 40 && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 border border-red-200">
                <strong>Poor.</strong> Your resume needs significant improvements to pass ATS screening.
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Recommendations:</h4>
                <ul className="space-y-3">
                  {suggestions.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 mt-1 mr-2">
                        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ResumeAnalyzer;