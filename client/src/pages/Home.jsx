import { useContext, useEffect, useState } from "react";
import { InterviewContext } from "../Context/InterviewContext";
import { FiClock, FiBarChart2, FiCheckCircle, FiPlay } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading"
import axios from "axios";

const Home = () => {
  const { interviews, getAllInterviews } = useContext(InterviewContext);
  const [myresponses, setMyResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleStartInterview = (id) => {
    navigate(`/interview/${id}`);
  };

  const getMyResponses = async () => {
    try {
      const res = await axios.get(`https://mockmate-ntab.onrender.com/api/interviewResponse/my-responses`, {
        withCredentials: true
      });
      setMyResponses(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getAllInterviews();
    getMyResponses();
  }, []);

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Interview Dashboard</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Practice with our curated interviews and get detailed feedback on your performance
          </p>
          <button
            onClick={() => navigate("/analyze-resume")}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-all duration-300"
          >
            <FiBarChart2 className="text-lg" />
            Analyze Resume
          </button>
        </div>

        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FiBarChart2 className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Total Interviews</h3>
                  <p className="text-2xl font-bold text-gray-800">{interviews?.length || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FiCheckCircle className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Completed</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {myresponses?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            Available Interviews
            <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {interviews?.length || 0}
            </span>
          </h2>

          {interviews && interviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((item) => {
                const hasResponse = myresponses.some(i => i?.interview?._id === item._id);
                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            item.difficulty === "easy"
                              ? "bg-green-100 text-green-800"
                              : item.difficulty === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.difficulty || "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <FiClock className="mr-1.5" />
                        <span>
                          Created:{" "}
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="mb-6">
                        <div className=" text-sm text-gray-600 mb-1">
                          <span>Questions: </span>
                          <span className="font-medium">{item.questions.length}</span>
                        </div>
                      </div>

                      {hasResponse ? (
                        <button
                          onClick={() => navigate(`/feedback/${item._id}`)}
                          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 hover:shadow-md"
                        >
                          <FiCheckCircle className="text-lg" />
                          View Feedback
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartInterview(item._id)}
                          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 hover:shadow-md"
                        >
                          <FiPlay className="text-lg" />
                          Start Interview
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No interviews available</h3>
              <p className="text-gray-500">Check back later for new interview opportunities</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
