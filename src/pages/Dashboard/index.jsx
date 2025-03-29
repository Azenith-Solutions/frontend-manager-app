import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () =>{
        const wantsToLogout = window.confirm("Você realmente deseja sair?");
        if(wantsToLogout){
            localStorage.removeItem('isLoggedIn');
            navigate('/');
        }
    }

    return(
        <>
            <button className="w-20 h-10  bg-red-400" onClick={handleLogout}>Logout</button>
        </>
    )
}

export default Dashboard;