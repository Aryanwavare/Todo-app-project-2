
const express = require("express");
const Groq = require("groq-sdk");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    const startTime = Date.now();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseTime = Date.now() - startTime;

    res.status(200).json({
      success: true,
      response:
        completion.choices[0]?.message?.content || "",
      responseTime: responseTime,
    });
  } catch (error) {
    console.error("Groq API Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Groq API request failed",
    });
  }
});

module.exports = router;
