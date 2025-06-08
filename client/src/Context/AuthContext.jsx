import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const login = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);

            const { name, email, picture } = decoded;

            const res = await axios.post(
                'https://mockmate-ntab.onrender.com/api/auth/login',
                { name, email, picture },
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success(res.data.message)
                await checkAuth();
                navigate("/")
                // console.log("Backend Response:", res.data);

            }
            else{
                toast.error(res.data.message);
            }


        } catch (error) {
            toast.error(error.eessage)
            console.error("Error sending to backend:", error.message);
        }
    };

    const logout = async () => {
        try {
            let res = await axios.post("https://mockmate-ntab.onrender.com/api/auth/logout",
                {},
                {
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                await checkAuth();
                navigate("/login");
            }
            else {
                toast.error(res.data.message);
            }
        }
        catch (err) {
            console.log(err);
        }
    };

    const checkAuth = async () => {
        try {
            const res = await axios.get("https://mockmate-ntab.onrender.com/api/auth/check", {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = res.data;
            if (data.success) {
                setUser(data.user)
                return true;
            } else {
                setUser(null)
                return false;
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, checkAuth, login,logout }}>
            {children}
        </AuthContext.Provider>
    );
};
