require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth.routes");
const rezepteRoutes = require("./routes/rezepte.routes");
const kunstRoutes = require("./routes/kunst.routes");
const musikRoutes = require("./routes/musik.routes");
const filmeRoutes = require("./routes/filme.routes");
const serienRoutes = require("./routes/serien.routes");
const dokusRoutes = require("./routes/dokus.routes");
const bingoRoutes = require("./routes/bingo.routes");
const errorHandling = require("./error-handling");

const corsOptions = {
  origin: ["http://localhost:5173", "https://crexcrex.netlify.app"], // Allow both development and production origins
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Other middleware and routes

// Apply CORS middleware to your application
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI; // Use environment variable for MongoDB URI
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mount routes
app.use("/auth", authRoutes);
app.use("/api/rezepte", rezepteRoutes);
app.use("/api/kunst", kunstRoutes);
app.use("/api/musik", musikRoutes);
app.use("/api/filme", filmeRoutes);
app.use("/api/serien", serienRoutes);
app.use("/api/dokus", dokusRoutes);
app.use("/api/bingo", bingoRoutes);

// Use error-handling middleware
errorHandling(app);

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
