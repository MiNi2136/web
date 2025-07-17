import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// Import your routes
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import qrCodeRoutes from "./routes/QRCodeRoutes.js";
import courseRoutes from "./routes/CourseRoutes.js";  // <--- add this

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Register routes
app.use("/users", userRoutes);
app.use("/sessions", sessionRoutes);
app.use("/qrcode", qrCodeRoutes);
app.use("/courses", courseRoutes);  // <--- add this

// Optional: root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Connect to MongoDB (removed deprecated options)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server only after DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
