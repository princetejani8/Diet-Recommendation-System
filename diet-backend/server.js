require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MariaDB");
});

app.get("/", (req, res) => {
  res.json({ message: "Diet Recommendation Backend is running..." });
});

app.post("/register", (req, res) => {
  const { name, password, food_preference } = req.body;
  if (!name || !password || !food_preference) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const query =
    "INSERT INTO users_info (name, BMI, food_preference, password) VALUES (?, 0, ?, ?)";

  db.query(query, [name, food_preference, password], (err, result) => {
    if (err) {
      console.error("Registration Error:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, userId: result.insertId });
  });
});

app.post("/login", (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const query = "SELECT * FROM users_info WHERE name = ? AND password = ?";
  db.query(query, [name, password], (err, result) => {
    if (err) {
      console.error("Error querying database: ", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.length > 0) {
      const user = result[0];
      res.json({
        success: true,
        message: `${user.name}, welcome to the recommend diet`,
        user: { id: user.id, name: user.name, BMI: user.BMI, food_preference: user.food_preference },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

app.put("/update-bmi", (req, res) => {
  const { userId, bmi } = req.body;
  if (!userId || bmi === undefined) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  let dailyCalories = 0;
  if (bmi < 18.5) {
    dailyCalories = 2000; // Underweight
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    dailyCalories = 2500; // Normal weight
  } else if (bmi >= 25 && bmi <= 29.9) {
    dailyCalories = 2200; // Overweight
  } else {
    dailyCalories = 1800; // Obese
  }

  const query = "UPDATE users_info SET BMI = ?, calories = ? WHERE id = ?";
  db.query(query, [bmi, dailyCalories, userId], (err, result) => {
    if (err) {
      console.error("Error updating BMI and calories:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, dailyCalories });
  });
});

app.get("/get-bmi/:userId", (req, res) => {
  const { userId } = req.params;
  console.log(`Fetching BMI for User ID: ${userId}`);

  const userQuery = "SELECT BMI, food_preference, calories FROM users_info WHERE id = ?";
  db.query(userQuery, [userId], (err, userResult) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (userResult.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { BMI, food_preference, calories } = userResult[0];

    if (BMI <= 0) {
      return res.status(400).json({ success: false, message: "BMI not set for this user" });
    }

    // Calculate daily calories based on BMI, with a fallback formula
    const dailyCalories = calories || Math.round(BMI * 25 * 1.2);
    const mealCalories = Math.round(dailyCalories / 4);

    let foodQuery = "SELECT * FROM food_items";
    if (food_preference !== "both") {
      foodQuery += " WHERE food_type = ?";
    }

    db.query(foodQuery, [food_preference !== "both" ? food_preference : undefined], (err, foodItems) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (foodItems.length === 0) {
        return res.status(404).json({ success: false, message: "No food items found for the selected preference" });
      }

      const generateMeal = (mealType) => {
        let mealItems = [];
        let totalCalories = 0;
        let remainingItems = [...foodItems];  // Make a copy of all food items

        while (totalCalories < mealCalories && remainingItems.length > 0) {
          const randomIndex = Math.floor(Math.random() * remainingItems.length);
          const item = remainingItems.splice(randomIndex, 1)[0];  // Remove the item from the list
          
          if (totalCalories + item.calories <= mealCalories) {
            mealItems.push(item);
            totalCalories += item.calories;
          }
        }

        return { mealType, items: mealItems };
      };

      const mealTypes = ["Breakfast", "Lunch", "Snacks", "Dinner"];
      let mealRecommendations = mealTypes.map((mealType) => generateMeal(mealType));

      const mealRecommendationsObj = mealRecommendations.reduce((acc, meal) => {
        acc[meal.mealType] = meal.items;
        return acc;
      }, {});

      res.json({
        success: true,
        dailyCalories,
        mealCalories,
        foodRecommendations: mealRecommendationsObj,
      });
    });
  });
});

app.post("/add-manual-items", (req, res) => {
  const { userId, mealType, items } = req.body;

  if (!userId || !mealType || !items || !Array.isArray(items)) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  const query = "SELECT manual_food_items FROM users_info WHERE id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching manual items:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch manual items" });
    }

    let manualItems = result[0].manual_food_items ? JSON.parse(result[0].manual_food_items) : {};

    if (!manualItems[mealType]) {
      manualItems[mealType] = [];
    }
    manualItems[mealType].push(...items);

    const updateQuery = "UPDATE users_info SET manual_food_items = ? WHERE id = ?";
    db.query(updateQuery, [JSON.stringify(manualItems), userId], (err, updateResult) => {
      if (err) {
        console.error("Error updating manual items:", err);
        return res.status(500).json({ success: false, message: "Failed to update manual items" });
      }

      res.json({ success: true, message: "Manual items added successfully" });
    });
  });
});

app.get("/get-manual-items/:userId", (req, res) => {
  const { userId } = req.params;

  const query = "SELECT manual_food_items FROM users_info WHERE id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      cons
      ole.error("Error fetching manual items:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch manual items" });
    }

    const manualItems = result[0].manual_food_items ? JSON.parse(result[0].manual_food_items) : {};

    res.json({ success: true, manualItems });
  });
});
// GET /get-profile/:userId - Get user profile information
app.get("/get-profile/:userId", (req, res) => {
  const { userId } = req.params;

  const query = "SELECT name, BMI, food_preference, calories, manual_food_items FROM users_info WHERE id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, BMI, food_preference, calories, manual_food_items } = result[0];
    const manualItems = manual_food_items ? JSON.parse(manual_food_items) : {};

    res.json({
      success: true,
      profile: {
        name,
        BMI,
        food_preference,
        calories,
        manualItems,
      },
    });
  });
});

app.put('/update-profile/:userId', (req, res) => {
  const { name, BMI, food_preference, calories, password } = req.body;
  const { userId } = req.params;

  let updateFields = [];
  let updateValues = [];

  // Always update name, BMI, food_preference, and calories
  updateFields.push('name', 'BMI', 'food_preference', 'calories');
  updateValues.push(name, BMI, food_preference, calories);

  // If password is provided, include it in the update
  if (password) {
    updateFields.push('password');
    updateValues.push(password);
  }

  // Create the SQL query with dynamic fields
  const query = `
    UPDATE users_info
    SET ${updateFields.map(field => `${field} = ?`).join(', ')}
    WHERE id = ?
  `;

  // Add userId at the end of updateValues array
  updateValues.push(userId);

  db.query(query, updateValues, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  });
});

app.get("/search-food", (req, res) => {
  const query = req.query.query;

  if (!query) {
      return res.status(400).json({ success: false, message: "Query parameter missing" });
  }

  const searchQuery = "SELECT * FROM food_items WHERE name LIKE ?";
  db.query(searchQuery, [`%${query}%`], (err, results) => {
      if (err) {
          console.error("Error fetching food items:", err);
          return res.status(500).json({ success: false, message: "Database error" });
      }

      if (results.length === 0) {
          return res.json({ success: false, message: "No food items found" });
      }

      res.json({ success: true, foodItems: results });
  });
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
