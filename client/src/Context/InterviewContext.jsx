import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
    const navigate = useNavigate();
    const [interviews,setInterviews]=useState([]);
    const [loading,setLoading]=useState(false)
    const createInterview = async( title, questions,difficulty) => {
        try {
            let res = await axios.post("http://localhost:4000/api/interview",
                { title, questions,difficulty },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success(res.data.message)
                getAllInterviews()
            }
            else {
                toast.error(res.data.message)
            }
        }
        catch(err){
            toast.error(err)
        }
        
    }

    const getAllInterviews = async () => {
        setLoading(true)
        try {
            const res = await axios.get("http://localhost:4000/api/interview", {
                withCredentials: true
            });
    
            setInterviews(res.data);
            // console.log(res.data);
        } catch (error) {
            console.error("Error fetching interviews:", error);
        }
        setLoading(false)
    };

    const deleteInterview = async (id) => {
        try {
          const res = await axios.delete(`http://localhost:4000/api/interview/${id}`, {
            withCredentials: true,
          });
      
          if (res.data.success) {
            toast.success(res.data.message);
            getAllInterviews()
          } else {
            toast.error(res.data.message);
          }
        } catch (error) {
          console.error("Error deleting interview:", error);
          toast.error("Failed to delete the interview. Please try again.");
        }
      };
      

    return (
        <InterviewContext.Provider value={{createInterview,getAllInterviews,interviews,deleteInterview,loading}}>
            {children}
        </InterviewContext.Provider>
    );
};
