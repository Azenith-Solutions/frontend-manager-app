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
            <button onClick={handleLogout}>Logout</button>
        </>
    )
}

export default Dashboard;