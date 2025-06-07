import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route } from "react-router"
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard';
import { InterviewProvider } from './Context/InterviewContext';
import Interview from './pages/Interview';
import Feedback from './pages/FeedBack';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
const App = () => {
    return (
        <div>
            <ToastContainer />
            <BrowserRouter>
                <AuthProvider>
                    <InterviewProvider>
                    <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/interview/:id" element={
                        <ProtectedRoute>
                            <Interview/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/feedback/:interviewId" element={
                        <ProtectedRoute>
                            <Feedback/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/analyze-resume" element={
                        <ProtectedRoute>
                            <ResumeAnalyzer/>
                        </ProtectedRoute>
                    }/>
                    
                    </Routes>
                    </InterviewProvider>
                </AuthProvider>
            </BrowserRouter>
        </div>
    )
}

export default App;