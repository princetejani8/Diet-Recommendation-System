import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [foodPreference, setFoodPreference] = useState("veg");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password, food_preference: foodPreference }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem("userName", name); // Store user name
      localStorage.setItem("userId", data.userId); // Store user ID
      alert("Registration Successful!");
      navigate("/bmi"); // Redirect to BMI calculation page
    } else {
      alert("Error registering");
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
        <Typography variant="h4" fontWeight="bold" sx={{
          color: "white", fontWeight: '300', // Thick font weight
        }}>
          Create your account
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
        <TextField label="Password" type="password" variant="outlined"
          fullWidth margin="normal" onChange={(e) => setPassword(e.target.value)}
          sx={{
            input: { color: "white" },
            margin: "20px 0 20px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" }, // Default border color
              "&:hover fieldset": { borderColor: "#80e84d" }, // Change border color to blue on hover
              "&.Mui-focused fieldset": { borderColor: "#80e84d" } // Change border color to blue when focused
            }
          }}

        />
        <label style={{ color: "white" }}>Select your food food preference</label>
        <FormControl fullWidth margin="normal">
          <InputLabel></InputLabel>
          <Select value={foodPreference} onChange={(e) => setFoodPreference(e.target.value)}>
            <MenuItem value="veg">Veg</MenuItem>
            <MenuItem value="non-veg">Non-Veg</MenuItem>
            <MenuItem value="both">Both</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" fullWidth
          sx={{
            backgroundColor: '#99ff66',  // Set the desired light green background color
            color: 'black',  // Ensure text is readable
            '&:hover': {
              backgroundColor: '#80e84d',  // Slightly darker green for hover effect
            }
          }}
          onClick={handleRegister} className="auth-button"
        >
          Register
        </Button>
        <Typography className="switch-link"
          sx={{ textDecoration: "none", margin: "10px 0 10px 0", color: "#80e84d" }}
          onClick={() => navigate("/")}>
          Already have an account? Login
        </Typography>
      </Paper>
    </Container>
  );
}

export default Register;
