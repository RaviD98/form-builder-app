import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import formRoutes from "./routes/form.route.js";
import responseRoutes from "./routes/response.route.js";
import uploadRoutes from "./routes/upload.route.js";

const app = express();

// Resolve current directory (needed for static file serving)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));


// API Routes
app.use("/api/forms", formRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/upload", uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Server Error" });
});

export default app;
