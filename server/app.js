import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import formRoutes from "./routes/form.route.js";
import responseRoutes from "./routes/response.route.js"; // Import the new responses route

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Cookie parsing
app.use(cookieParser());

// Static files
app.use(express.static("public"));

// Routes
app.use("/api/forms", formRoutes);
app.use('/api/responses', responseRoutes); // Use the new responses route


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Server Error" });
});

export default app;
