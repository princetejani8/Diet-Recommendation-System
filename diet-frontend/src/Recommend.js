import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Recommend = () => {
  const [name, setName] = useState("");
  const [bmi, setBmi] = useState(null);
  const [calories, setCalories] = useState(null);
  const [error, setError] = useState("");
  const [foodRecommendations, setFoodRecommendations] = useState({
    Breakfast: [],
    Lunch: [],
    Snacks: [],
    Dinner: [],
  });
  const [newItem, setNewItem] = useState({ name: "", calories: "" });
  const [addingItemFor, setAddingItemFor] = useState(null);
  const [foodPreference, setFoodPreference] = useState("");
  const [deletedItems, setDeletedItems] = useState({});
  const [addedItems, setAddedItems] = useState({});

  const storedShowFoodRecommendation =
    localStorage.getItem("showFoodRecommendation") === "true";
  const [showFoodRecommendation, setShowFoodRecommendation] = useState(
    storedShowFoodRecommendation
  );

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      // Load stored recommendations
      const storedRecommendations =
        JSON.parse(localStorage.getItem(`foodRecommendations_${storedUserId}`)) || {
          Breakfast: [],
          Lunch: [],
          Snacks: [],
          Dinner: [],
        };

      // Load deleted items
      const storedDeletedItems =
        JSON.parse(localStorage.getItem(`deletedItems_${storedUserId}`)) || {};
      setDeletedItems(storedDeletedItems);

      // Load added items
      const storedAddedItems =
        JSON.parse(localStorage.getItem(`addedItems_${storedUserId}`)) || {
          Breakfast: [],
          Lunch: [],
          Snacks: [],
          Dinner: [],
        };
      setAddedItems(storedAddedItems);

      setFoodRecommendations(storedRecommendations);

      // Fetch user details (name, BMI, calories)
      fetch(`http://localhost:5000/get-bmi/${storedUserId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setName(data.name);
            setBmi(data.BMI);
            setFoodPreference(data.food_preference);
            setCalories(data.dailyCalories);

            if (!localStorage.getItem(`foodRecommendations_${storedUserId}`)) {
              localStorage.setItem(
                `foodRecommendations_${storedUserId}`,
                JSON.stringify(data.foodRecommendations)
              );
              setFoodRecommendations(data.foodRecommendations);
            }
          } else {
            setError("Failed to fetch profile data.");
          }
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      setError("User ID not found.");
    }
  }, []);

  const handleAddItem = (mealType) => {
    if (!newItem.name || !newItem.calories) {
      alert("Please enter both food item and calories.");
      return;
    }

    const itemToAdd = { name: newItem.name, calories: parseInt(newItem.calories) };

    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      const updatedAddedItems = { ...addedItems };
      updatedAddedItems[mealType] = [...(updatedAddedItems[mealType] || []), itemToAdd];

      localStorage.setItem(`addedItems_${storedUserId}`, JSON.stringify(updatedAddedItems));
      setAddedItems(updatedAddedItems);
    }

    setNewItem({ name: "", calories: "" });
    setAddingItemFor(null);
  };

  const handleDeleteItem = (item, mealType) => {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      const updatedDeletedItems = { ...deletedItems };
      updatedDeletedItems[mealType] = [...(updatedDeletedItems[mealType] || []), item.name];

      localStorage.setItem(`deletedItems_${storedUserId}`, JSON.stringify(updatedDeletedItems));
      setDeletedItems(updatedDeletedItems);
    }
  };

  const renderMealRecommendations = (mealType) => {
    // Filter out deleted items
    const filteredItems = [...foodRecommendations[mealType], ...(addedItems[mealType] || [])].filter(
      (item) => !deletedItems[mealType]?.includes(item.name)
    );

    return (
      <>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#66bb6a" }}>
          {mealType} Recommendations:
          <Button
            variant="outlined"
            sx={{ marginLeft: 2, color: "#66bb6a", borderColor: "#66bb6a" }}
            onClick={() => setAddingItemFor(mealType)}
          >
            Add Item Manually
          </Button>
        </Typography>

        {addingItemFor === mealType && (
          <Box sx={{ marginTop: 2 }}>
            <TextField
              label="Food Item"
              variant="outlined"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              sx={{ marginRight: 2 }}
            />
            <TextField
              label="Calories"
              type="number"
              variant="outlined"
              value={newItem.calories}
              onChange={(e) => setNewItem({ ...newItem, calories: e.target.value })}
            />
            <Button
              variant="contained"
              sx={{ marginTop: 2, marginLeft: 2, backgroundColor: "#66bb6a", color: "#fff" }}
              onClick={() => handleAddItem(mealType)}
            >
              Add
            </Button>
          </Box>
        )}

        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {filteredItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: "#2e2e2e", color: "#ffffff" }}>
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2">{item.calories} kcal</Typography>
                </CardContent>
                <IconButton sx={{ color: "#f26161" }} onClick={() => handleDeleteItem(item, mealType)}>
                  <DeleteIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "transparent",
        color: "#E0E0E0",
        padding: 3,
      }}
    >
      {error && <Typography variant="h6" color="error">{error}</Typography>}

      {showFoodRecommendation ? (
        <>
          {renderMealRecommendations("Breakfast")}
          {renderMealRecommendations("Lunch")}
          {renderMealRecommendations("Snacks")}
          {renderMealRecommendations("Dinner")}
        </>
      ) : (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#66bb6a" }}>
            Hello, {name}!
          </Typography>
          <Typography variant="h6">
            Your BMI is {bmi}. Based on your BMI, we recommend a daily intake of {calories} kcal.
          </Typography>
          <Button
            variant="contained"
            sx={{ marginTop: 3, backgroundColor: "#66bb6a", color: "#fff" }}
            onClick={() => {
              setShowFoodRecommendation(true);
              localStorage.setItem("showFoodRecommendation", "true");
            }}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Recommend;
