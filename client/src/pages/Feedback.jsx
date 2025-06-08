import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const Feedback = () => {
  const { interviewId } = useParams();
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://mockmate-q1ub.onrender.com/api/interviewResponse/${interviewId}`,
        { withCredentials: true }
      );
      setResponse(res.data);
    } catch (err) {
      console.error("Error fetching feedback:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  if (isLoading) {
    return (
        <>
        <Navbar/>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your feedback...</h2>
          <p className="text-gray-500">We're analyzing your interview responses</p>
        </div>
      </div>
      </>
    );
  }

  if (!response) {
    return (
        <>
        <Navbar/>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Feedback Not Available</h2>
          <p className="text-gray-600 mb-6">We couldn't retrieve your interview feedback. Please try again later.</p>
          <button 
            onClick={fetchFeedback}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
      
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Interview Feedback
          </h1>
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            {response.interview.title}
          </div>
        </div>

        
        {response.overallFeedback && (
          <div className="mb-10 p-6 bg-white rounded-xl shadow-md border-l-4 border-yellow-500 transform transition-all duration-300 hover:shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full mr-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Overall Feedback</h2>
                <p className="text-gray-700 leading-relaxed">{response.overallFeedback}</p>
              </div>
            </div>
          </div>
        )}

    
        <div className="space-y-6">
          {response.responses.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 text-blue-800 font-bold rounded-full h-10 w-10 flex items-center justify-center mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.question}</h3>
                    
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Your Answer</h4>
                      <p className="text-gray-700">{item.answer || "No answer provided"}</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <h4 className="text-sm font-medium text-green-700 mb-1">Feedback</h4>
                      <p className="text-gray-800">{item.feedback || "No specific feedback provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Feedback;