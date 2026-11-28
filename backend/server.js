
require("dotenv").config();

const express = require("express");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");
const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
const cors = require("cors");
const helmet = require("helmet");

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
const groqRoutes = require("./routes/groqRoutes");
const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
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
app.use("/api/gemini", geminiRoutes);
app.use("/api/groq", groqRoutes);
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
app.listen
    (PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to PostgreSQL:", error.message);
    process.exit(1);
  }
}

startServer();
