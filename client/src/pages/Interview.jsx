import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const Interview = () => {
  const { id } = useParams();
  const [loading,setLoading]=useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interview, setInterview] = useState(null);
  const recognitionRef = useRef(null);
  const questionRef = useRef(null);
  const navigate=useNavigate();

  const getInterview = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/interview/${id}`, {
        withCredentials: true
      });
      setInterview(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    getInterview();
  }, []);

  useEffect(() => {
    if (!interview) return;

    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };

      return () => {
        recognition.stop();
      };
    } else {
      alert("Speech recognition not supported in your browser");
    }
  }, [interview]);

  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      setTranscript("");
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
  }, [isRecording]);

  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.classList.remove("animate-fade-in");
      void questionRef.current.offsetWidth; // Trigger reflow
      questionRef.current.classList.add("animate-fade-in");
    }
  }, [currentIndex]);

  const handleNext = async () => {
    const currentQuestion = interview.questions[currentIndex];

    const updatedResponses = [
      ...responses,
      {
        question: currentQuestion,
        answer: transcript.trim()
      }
    ];

    setResponses(updatedResponses);
    setTranscript("");
    setIsRecording(false);

    if (currentIndex + 1 < interview.questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await handleSubmit(updatedResponses);
    }
  };

  const handleSubmit = async (allResponses) => {
    setLoading(true)
    try {
      const res = await axios.post(
        "https://mockmate-ntab.onrender.com/api/interviewResponse",
        {
          interviewId: interview._id,
          responses: allResponses
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/")
      }
      else{
        toast.error(res.data.message)
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while submitting.");
    }
    setLoading(false)
  };

  if (!interview) return (
    <>
    <Navbar/>
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse text-2xl text-blue-600">Loading interview...</div>
    </div>
    </>
  );

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
       
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold">Interview Session</h1>
          <div className="flex justify-between items-center mt-2">
            <span className="text-blue-100">Question {currentIndex + 1} of {interview.questions.length}</span>
            <div className="w-full bg-blue-400 rounded-full h-2.5 ml-4">
              <div 
                className="bg-white h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${((currentIndex + 1) / interview.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div 
            ref={questionRef}
            className="animate-fade-in bg-indigo-50 rounded-lg p-6 mb-8 border-l-4 border-blue-500 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Question:</h2>
            <p className="text-gray-700 text-lg">{interview.questions[currentIndex]}</p>
          </div>

          <div className="mb-8">
            <button
              onClick={() => setIsRecording((prev) => !prev)}
              className={`px-6 py-3 rounded-full text-white font-medium flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 ${
                isRecording 
                  ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 animate-pulse" 
                  : "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
              }`}
            >
              {isRecording ? (
                <>
                  <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                  </svg>
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  <span>Start Speaking</span>
                </>
              )}
            </button>
          </div>

          {transcript && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200 transform transition-all duration-300 hover:shadow-lg">
              <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2">Your Answer:</h3>
              <p className="text-gray-800 text-lg">{transcript}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={isRecording || !transcript}
              className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-105 ${
                isRecording || !transcript
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
              }`}
            >
              {currentIndex + 1 < interview.questions.length ? (
                <>
                  Next Question 
                  <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              ) : (
                <>
                  {loading?"Submitting":"Submit Interview"}
                  <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Interview;