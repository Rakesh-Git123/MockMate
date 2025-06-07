import { useContext, useEffect, useState } from 'react';
import { FiPlus, FiX, FiTrash2, FiEdit2, FiClock, FiChevronRight } from 'react-icons/fi';
import { InterviewContext } from '../Context/InterviewContext';

const Admin = () => {
    const { createInterview, getAllInterviews, interviews, deleteInterview, loading } = useContext(InterviewContext);
    const [isOpen, setIsOpen] = useState(false);
    const [interview, setInterview] = useState({
        title: '',
        questions: [''],
        difficulty: ''
    });

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setTimeout(() => {
            setInterview({
                title: '',
                questions: [''],
                difficulty: 'medium'
            });
        }, 300);
    };

    const handleTitleChange = (e) => {
        setInterview({ ...interview, title: e.target.value });
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...interview.questions];
        newQuestions[index] = value;
        setInterview({ ...interview, questions: newQuestions });
    };

    const handleDifficultyChange = (e) => {
        setInterview({ ...interview, difficulty: e.target.value });
    };

    const addQuestion = () => {
        setInterview({
            ...interview,
            questions: [...interview.questions, '']
        });
    };

    const removeQuestion = (index) => {
        const newQuestions = interview.questions.filter((_, i) => i !== index);
        setInterview({ ...interview, questions: newQuestions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createInterview(interview.title, interview.questions, interview.difficulty);
        closeModal();
    };

    useEffect( () => {

        getAllInterviews()

    }, [])

    return (
        <div className="relative p-4 sm:p-6 max-w-full sm:max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        Create and manage your interview templates
                    </p>
                </div>
                <button
                    onClick={openModal}
                    className="flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow hover:shadow-md"
                >
                    <FiPlus className="mr-2" />
                    Create New Interview
                </button>
            </div>

            {/* Interview List */}
            <div className="mt-6 sm:mt-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 border-b border-gray-100">
                    Your Interviews
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                        <span className="ml-3 text-blue-600 font-medium">Loading interviews...</span>
                    </div>
                ) : interviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {interviews.map((item, index) => (
                            <div
                                key={index}
                                className="p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-blue-100 group"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center mt-2 text-sm text-gray-500">
                                            <FiClock className="mr-1" />
                                            <span>
                                                {new Date(item.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                        <div className="mt-3 text-sm text-gray-600">
                                            <span className="font-medium">{item.questions.length}</span> questions
                                        </div>
                                        <div className="mt-2">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${item.difficulty === "easy"
                                                    ? "bg-green-100 text-green-800"
                                                    : item.difficulty === "medium"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {item.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteInterview(item._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete interview"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <FiPlus className="text-blue-500 text-2xl" />
                        </div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-700">No interviews yet</h3>
                        <p className="text-gray-500 mt-1 mb-4 text-sm">Create your first interview template</p>
                        <button
                            onClick={openModal}
                            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow"
                        >
                            Create Interview
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal}></div>

                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-gray-100 p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Create New Interview</h3>
                            <button
                                onClick={closeModal}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                            >
                                <FiX size={22} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                            <div className="mb-5 sm:mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Interview Title</label>
                                <input
                                    type="text"
                                    value={interview.title}
                                    onChange={handleTitleChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Senior Frontend Developer Interview"
                                    required
                                />
                            </div>

                            <div className="mb-5 sm:mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {["easy", "medium", "hard"].map((level) => (
                                        <label key={level} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="difficulty"
                                                value={level}
                                                checked={interview.difficulty === level}
                                                onChange={handleDifficultyChange}
                                                className="sr-only peer"
                                            />
                                            <div
                                                className={`w-full text-center px-3 py-2 rounded-lg border cursor-pointer transition-all ${interview.difficulty === level
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <span className="capitalize">{level}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-5 sm:mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Questions</label>
                                    <span className="text-xs text-gray-500">{interview.questions.length} question(s)</span>
                                </div>
                                <div className="space-y-3 mb-4">
                                    {interview.questions.map((question, index) => (
                                        <div key={index} className="flex items-center group">
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    value={question}
                                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder={`Question ${index + 1}`}
                                                    required
                                                />
                                                <span className="absolute right-3 top-2.5 text-xs text-gray-400">{index + 1}</span>
                                            </div>
                                            {interview.questions.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuestion(index)}
                                                    className="ml-3 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="flex items-center text-blue-500 hover:text-blue-600 font-medium text-sm"
                                >
                                    <FiPlus className="mr-2" />
                                    Add another question
                                </button>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center justify-center"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-dashed rounded-full animate-spin"></div>
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        "Save Interview"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;