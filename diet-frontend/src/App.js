import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import Login from "./Login";
import Register from "./Register";
import BMI from "./BMI";
import Recommend from "./Recommend";
import CalculateCalories from "./CalculateCalories"; // Import the component
import Profile from "./Profile";
import "./styles.css";

// Create a theme with custom font
const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, Arial, sans-serif",
  },
});

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="sticky" sx={{ background: "linear-gradient(to right, #66bb6a, #338a3e)", height: '60px' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <img
                src={require('./assets/logo.png')}
                alt="Logo"
                style={{
                  height: '90px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Typography>

            <IconButton color="inherit" onClick={() => window.location.href = '/profile'} sx={{ marginRight: 2 }}>
              <PersonIcon />
            </IconButton>

            <IconButton color="inherit" onClick={handleLogout} sx={{ marginRight: 2 }}>
              <LogoutIcon />
            </IconButton>

            <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Sidebar (Drawer) */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Box sx={{ width: 250, padding: 2, backgroundColor: "#1E1E1E", height: "100%", color: "white" }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Menu
            </Typography>

            {/* Add Sidebar Option for Calculate Calories */}
            <List>
              <ListItem
                button
                onClick={() => window.location.href = "/calculate-calories"}
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "#66bb6a" } // Same green as the navbar
                }}
              >
                <ListItemText primary="Calculate Calories" />
              </ListItem>
            </List>


          </Box>
        </Drawer>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bmi" element={<BMI />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calculate-calories" element={<CalculateCalories />} /> {/* New Route */}
        </Routes>

      </Router>
    </ThemeProvider>
  );
}

export default App;
