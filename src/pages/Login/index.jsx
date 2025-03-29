import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (username == 'admin' && password == 'admin123') {
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/dashboard');
        } else {
            alert("Admin fajuto, saia");
        }
    };

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>
                        Nome de usuário:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Senha:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Entrar</button>
            </form>
        </>
    );
}

export default Login;