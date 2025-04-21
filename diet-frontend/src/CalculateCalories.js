import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, List, ListItem, ListItemText, Typography, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CalculateCalories = () => {
    const [userCalories, setUserCalories] = useState(null);
    const [remainingCalories, setRemainingCalories] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [foodItems, setFoodItems] = useState([]);
    const [selectedFoods, setSelectedFoods] = useState([]);

    const userId = 1; // Replace with actual logged-in user's ID

    // Load data from localStorage when the component mounts
    useEffect(() => {
        const storedRemainingCalories = localStorage.getItem("remainingCalories");
        const storedSelectedFoods = localStorage.getItem("selectedFoods");

        axios.get(`http://localhost:5000/get-profile/${userId}`)
            .then(response => {
                const { calories } = response.data.profile;
                setUserCalories(calories);

                // Restore state from localStorage if available, otherwise use the user's total calories
                setRemainingCalories(storedRemainingCalories ? JSON.parse(storedRemainingCalories) : calories);
                setSelectedFoods(storedSelectedFoods ? JSON.parse(storedSelectedFoods) : []);
            })
            .catch(error => console.error("Error fetching user calories:", error));
    }, []);

    // Save remaining calories and selected foods to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("remainingCalories", JSON.stringify(remainingCalories));
        localStorage.setItem("selectedFoods", JSON.stringify(selectedFoods));
    }, [remainingCalories, selectedFoods]);

    // Handle search query change
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);

        if (event.target.value.trim() === "") {
            setFoodItems([]);
            return;
        }

        axios.get(`http://localhost:5000/search-food?query=${event.target.value}`)
            .then(response => {
                if (response.data.success) {
                    setFoodItems(response.data.foodItems);
                } else {
                    setFoodItems([]);
                }
            })
            .catch(error => console.error("Error fetching food items:", error));
    };

    // Handle item selection (subtract calories and store selected foods)
    const handleSelectFood = (item) => {
        if (remainingCalories - item.calories >= 0) {
            setRemainingCalories(prev => prev - item.calories);
            setSelectedFoods(prev => [...prev, item]);
            setSearchQuery(""); // Clear search bar
            setFoodItems([]);   // Clear suggestions
        } else {
            alert("Not enough remaining calories!");
        }
    };

    // Handle item removal (add back calories and remove food)
    const handleRemoveFood = (id) => {
        const foodToRemove = selectedFoods.find(food => food.id === id);
        if (foodToRemove) {
            setRemainingCalories(prev => prev + foodToRemove.calories); // Add back calories
            setSelectedFoods(prev => prev.filter(food => food.id !== id)); // Remove item from state
        }
    };

    return (
        <Box sx={{
            padding: 3,
            border: "1px solid white",
            borderRadius: "10px",
            backgroundColor: "rgba(26, 26, 26, 0.83)",
            color: "white",
            maxWidth: "600px",
            margin: "auto",
            marginTop: "80px",
            textAlign: "center"
        }}>
            <Typography variant="h4" gutterBottom sx={{ color: "#66bb6a" }}>
                Calculate Calories
            </Typography>

            <Typography variant="h6" sx={{ color: "white", fontWeight: "100" }}>
                Total Calories: {userCalories || "Loading..."} | Remaining Calories: {remainingCalories}
            </Typography>

            <TextField
                label="Search Food Items"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={handleSearch}
                sx={{
                    input: { color: "white" },
                    label: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "#338a3e" },
                        "&.Mui-focused fieldset": { borderColor: "#338a3e" }
                    }
                }}
            />

            <List>
                {foodItems.map((item) => (
                    <ListItem
                        button
                        key={item.id}
                        onClick={() => handleSelectFood(item)}
                        sx={{
                            color: "white",
                            border: "1px solid white",
                            borderRadius: "5px",
                            marginBottom: "5px",
                            "&:hover": { backgroundColor: "#338a3e" }
                        }}
                    >
                        <ListItemText primary={`${item.name} - ${item.calories} kcal`} sx={{ color: "white" }} />
                    </ListItem>
                ))}
            </List>

            {/* Display Selected Food Items Inside the Calculate Section */}
            <Box sx={{ marginTop: "20px" }}>
                <Typography variant="h6" sx={{ color: "#66bb6a" }}>Selected Foods</Typography>
                {selectedFoods.length > 0 ? (
                    <List>
                        {selectedFoods.map((food) => (
                            <ListItem key={food.id} sx={{ color: "white", borderBottom: "1px solid gray", display: 'flex', justifyContent: 'space-between' }}>
                                <ListItemText primary={`${food.name} - ${food.calories} kcal`} />
                                <IconButton onClick={() => handleRemoveFood(food.id)} sx={{ color: "#ff5252" }}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No items selected.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default CalculateCalories;
