
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        process.env.CORS_ORIGIN,
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://localhost:3000",
      ].filter(Boolean);

      callback(null, allowedOrigins.includes(origin));
    },
  })
);

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "To-Do App Authentication API is running.",
  });
});

app.get("/api/health/db", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      message: "PostgreSQL connection successful.",
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);

    res.status(503).json({
      message: "Database connection unavailable.",
    });
  }
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found.",
  });
});

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected successfully.");
  } catch (error) {
    console.warn(
      "PostgreSQL unavailable; authentication will use local file storage:",
      error.message
    );
  }

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

startServer();
