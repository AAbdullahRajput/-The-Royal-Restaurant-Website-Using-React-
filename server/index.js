import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./auth.js"; // your signup/login routes
import userRoutes from "./User.js"; // new user routes for profile image and edit

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors()); // allow requests from frontend
app.use(express.json()); // parse JSON bodies
app.use("/uploads", express.static("uploads")); // serve uploaded images publicly

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
