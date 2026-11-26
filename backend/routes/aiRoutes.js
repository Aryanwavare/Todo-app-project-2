const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const PROMPT = (task) =>
  `Break this task into 4 to 6 short, actionable subtasks: "${task}". ` +
  `Reply ONLY with a JSON array of strings, nothing else.`;

function parseSubtasks(text) {
  try {
    const data = JSON.parse(text);
    if (Array.isArray(data)) return data.map(String);
    const list = Object.values(data).find(Array.isArray);
    if (list) return list.map(String);
  } catch (e) {}
  const match = text.match(/\[[\s\S]*\]/);
  if (match) return JSON.parse(match[0]).map(String);
  console.error("Could not parse AI reply:", text.slice(0, 200));
  throw new Error("AI did not return a list");
}

async function askGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.trim() });

  const models = [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3.8-flash",
  ];

  let lastError;
  for (const model of models) {
    try {
      console.log("Trying Gemini model:", model);
      const response = await Promise.race([
        ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: "application/json" },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout after 8s")), 8000)
        ),
      ]);
      console.log("Gemini OK with:", model);
      return response.text;
    } catch (err) {
      console.error(`Gemini ${model} failed:`, err.message.slice(0, 100));
      lastError = err;
    }
  }
  throw lastError;
}

async function askGroq(prompt) {
  const apiKey = (process.env.GROQ_API_KEY || "").trim();
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Groq request failed");
  return data.choices[0].message.content;
}

router.post("/", async (req, res) => {
  const { task, provider } = req.body;

  if (!task || !task.trim()) {
    return res.status(400).json({ message: "Task is required." });
  }

  try {
    const start = Date.now();
    const prompt = PROMPT(task.trim());
    const text =
      provider === "groq" ? await askGroq(prompt) : await askGemini(prompt);
    console.log(`${provider} took ${((Date.now() - start) / 1000).toFixed(2)} seconds`);
    res.status(200).json({ provider, subtasks: parseSubtasks(text) });
  } catch (error) {
    console.error("AI error:", error.message);
    res.status(500).json({ message: "AI request failed. Try again." });
  }
});

module.exports = router;