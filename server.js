require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors
const app = express();
const authRoutes = require("./routes/auth.routes");
const rezepteRoutes = require("./routes/rezepte.routes"); // Ensure this matches your file path
const kunstRoutes = require("./routes/kunst.routes");
const musikRoutes = require("./routes/musik.routes");
const filmeRoutes = require("./routes/filme.routes");
const serienRoutes = require("./routes/serien.routes");
const dokusRoutes = require("./routes/dokus.routes");
const bingoRoutes = require("./routes/bingo.routes");
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
app.use("/api/rezepte", rezepteRoutes); // Ensure this matches your desired route path
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
