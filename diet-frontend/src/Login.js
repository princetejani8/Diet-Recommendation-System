import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password }),
        });
    
        const data = await response.json();
        if (data.success) {
            localStorage.setItem("userName", data.user.name); // Store user name
            localStorage.setItem("userId", data.user.id); // Store user ID
            alert("Login Successful!");
            navigate("/recommend"); // Redirect to recommend page
        } else {
            alert("Incorrect Name or password");
        }
    };
    

    return (
        <Container className="auth-container">
            <Paper
                elevation={3}
                sx={{
                    padding: "70px",
                    maxWidth: "600px",
                    width: "100%",
                    textAlign: "center",
                    background: "rgba(0, 0, 0, 0.4)", // Semi-transparent background
                    borderRadius: "25px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(10px)", // Apply blur effect
                    WebkitBackdropFilter: "blur(10px)", // Safari support
                    border: '2px solid  rgba(138, 138, 138, 0.5)'
                }}
            >
                <Typography variant="h4" fontWeight="bold"

                    sx={{
                        color: 'white',
                        fontWeight: '300', // Thick font weight
                        marginBottom: '20px',
                    }}>
                    Welcome Back
                </Typography>
                <TextField label="Name" variant="outlined" fullWidth margin="normal" onChange={(e) => setName(e.target.value)}
                    sx={{
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "white" }, // Default border color
                            "&:hover fieldset": { borderColor: "#80e84d" }, // Change border color to blue on hover
                            "&.Mui-focused fieldset": { borderColor: "#80e84d" } // Change border color to blue when focused
                        }
                    }}

                />
                <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "white" }, // Default border color
                            "&:hover fieldset": { borderColor: "#80e84d" }, // Change border color to blue on hover
                            "&.Mui-focused fieldset": { borderColor: "" } // Change border color to blue when focused
                        }
                    }}

                />
                <Button variant="contained" color="primary" fullWidth onClick={handleLogin} className="auth-button"
                    sx={{
                        backgroundColor: '#99ff66',
                        color: 'black',
                        margin: "10px 0 10px",
                        borderRadius: "7px",
                        '&:hover': {
                            backgroundColor: '#80e84d' // Lighter shade when hovered
                        }
                    }}
                >
                    Login
                </Button>
                <Typography className="switch-link"
                    sx={{ textDecoration: "none", marginTop: "15px", color: "#80e84d" }}
                    onClick={() => navigate("/register")}>
                    Don't have an account? Register
                </Typography>
            </Paper>
        </Container>
    );
}

export default Login;
