// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors
const app = express();
const authRoutes = require("./routes/auth.routes");
const errorHandling = require("./error-handling");

// Middleware to parse JSON bodies
app.use(express.json());

// Configure CORS
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your front-end URL
  methods: "GET,POST,PUT,DELETE", // Specify allowed methods
  allowedHeaders: "Content-Type,Authorization", // Specify allowed headers
};

app.use(cors(corsOptions)); // Use cors middleware

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/restAPI";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mount routes
app.use("/auth", authRoutes);

// Use error-handling middleware
errorHandling(app);

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
