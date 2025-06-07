import { useContext } from "react";
import Admin from "./Admin";
import Home from "./Home";
import { AuthContext } from "../Context/AuthContext";
import Navbar from "../components/Navbar";

const Dashboard=()=>{
    const {user}=useContext(AuthContext)
    return(
        <>
            <Navbar/>
        <div>
            {
                user?.role==="admin"?<Admin/>:<Home/>
            }
        </div>
        </>
    )
}

export default Dashboard;