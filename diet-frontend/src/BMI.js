import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function BMI() {
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [bmi, setBmi] = useState(null);
    const [bmiCategory, setBmiCategory] = useState("");
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (bmi !== null) {
            if (bmi < 18.5) {
                setBmiCategory("Need to gain some weight ?");
                alert("Need to gain some weight ?");
            } else if (bmi >= 18.5 && bmi < 24.9) {
                setBmiCategory("Your weight is fine. Want to maintain further ?");
                alert("Your weight is fine. Want to maintain further ?")
            } else if (bmi >= 25 && bmi < 29.9) {
                setBmiCategory("Need to lose some weight ?");
                alert("Need to lose some weight ?")
            } else {
                setBmiCategory("Obesity (Consider consulting a professional)");
                alert("Obesity (Consider consulting a professional)")
            }
        }
    }, [bmi]);

    const calculateBMI = async () => {
        if (weight && height) {
            const heightInMeters = height / 100;
            const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
            setBmi(bmiValue);
    
            if (userId) {
                try {
                    const response = await fetch("http://localhost:5000/update-bmi", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId, bmi: bmiValue }),
                    });
    
                    const data = await response.json();
                    if (!data.success) {
                        alert("Failed to update BMI in database.");
                    } else {
                        const name = localStorage.getItem("userName"); // Get name from storage
                        navigate("/recommend", { state: { name } }); // Redirect to Recommend.js
                    }
                } catch (error) {
                    console.error("Error updating BMI:", error);
                    alert("Server error while updating BMI.");
                }
            } else {
                const name = localStorage.getItem("userName"); // Get name from storage
                navigate("/recommend", { state: { name } }); // Redirect to Recommend.js
            }
        } else {
            alert("Please enter both weight and height.");
        }
    };
    
    return (
        <Container
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: `url("./assets/patrick-fore-hoxqcGUheeo-unsplash.jpg")`,            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: "50px",
                    maxWidth: "600px",
                    width: "100%",
                    textAlign: "center",
                    background: "rgba(0, 0, 0, 0.4)", // Semi-transparent background
                    borderRadius: "25px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(10px)", // Apply blur effect
                    WebkitBackdropFilter: "blur(10px)", // Safari support
                    border: "2px solid rgba(138, 138, 138, 0.5)",
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                        color: "white",
                        fontWeight: "300",
                        marginBottom: "20px",
                    }}
                >
                    Calculate Your BMI
                </Typography>
                <TextField
                    label="Weight (kg)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    onChange={(e) => setWeight(e.target.value)}
                    sx={{
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "white" },
                            "&:hover fieldset": { borderColor: "#80e84d" },
                            "&.Mui-focused fieldset": { borderColor: "#80e84d" },
                        },
                    }}
                />
                <TextField
                    label="Height (cm)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    onChange={(e) => setHeight(e.target.value)}
                    sx={{
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "white" },
                            "&:hover fieldset": { borderColor: "#80e84d" },
                            "&.Mui-focused fieldset": { borderColor: "#80e84d" },
                        },
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={calculateBMI}
                    sx={{
                        backgroundColor: "#99ff66",
                        color: "black",
                        "&:hover": {
                            backgroundColor: "#80e84d",
                        },
                        marginTop: "15px",
                    }}
                >
                    Calculate BMI
                </Button>

                {bmi && (
                    <Typography
                        variant="h6"
                        sx={{
                            color: "white",
                            marginTop: "20px",
                        }}
                    >
                       {bmiCategory}
                    </Typography>
                )}

                <Typography
                    className="switch-link"
                    onClick={() => navigate("/")}
                    sx={{
                        marginTop: "20px",
                        cursor: "pointer",
                        color: "#80e84d",
                        textDecoration:"none",
                        "&:hover": { textDecoration: "none" },
                    }}
                >
                    Go back to Login
                </Typography>
            </Paper>
        </Container>
    );
}

export default BMI;
