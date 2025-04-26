import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {api} from "../../provider/apiProvider";

// css native
import './Login.css'; // Certifique-se de que esta linha está correta

// images
import Logo from '../../assets/icons/hardwaretech-white-logo.svg';

// material ui components
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "HardwareTech | Login";
    }, []);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            navigate('/gerenciamento');
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        api.post('/auth/login', {
            email,
            password
        })
        .then((response) => {
            if (response.status === 200) {
                console.log('Response do login:', response.data);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('token', response.data.data.token);
                navigate('/dashboard');
            }
        })
        .catch((error) => {
            alert("Login inválido! Verifique seu e-mail e senha.");
        });
    };

    return (
        <div className="loginContainer">
            <img src={Logo} alt="Logo" className="logo" />
            <span><b>HardwareTech</b></span>
            <Box
                className="loginBox"
                sx={{
                    width: 300,
                    height: "auto",
                    padding: 2,
                    borderRadius: 1,
                    paddingTop: 1,
                    bgcolor: "white",
                }}
            >   
                <h1>LOGIN</h1>
                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        type="email"
                        fullWidth
                        size="small"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Senha"
                        type="password"
                        variant="outlined"
                        fullWidth
                        size="small"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            marginTop: 2,
                            backgroundColor: "#61131A",
                            "&:hover": {
                                backgroundColor: "#4e0f14",
                            },
                        }}
                    >
                        Entrar
                    </Button>
                </form>
                <Divider sx={{ margin: '15px 0' }} /> 
                <span>
                   @Copyright 2025 - HardwareTech
                </span>
            </Box>
        </div>
    );
}

export default Login;