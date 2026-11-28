
const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({
      success: true,
      response: response.text,
    });
  } catch (error) {
    console.error("Gemini API Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Gemini API request failed",
    });
  }
});

module.exports = router;
