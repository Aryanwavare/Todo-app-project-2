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
        ai.models.generateContent({ model, contents: prompt, config: {responseMimeType: "application/json"} }),
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
async function askGrok(prompt) {
  const apiKey = process.env.XAI_API_KEY?.trim();
  const model = process.env.GROK_MODEL?.trim();

  if (!apiKey) {
    throw new Error("Missing XAI_API_KEY");
  }

  if (!model) {
    throw new Error("Missing GROK_MODEL");
  }

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "user", content: prompt }
      ],
    }),
  });

  const responseText = await res.text();

  console.log("GROK STATUS:", res.status);
  console.log("GROK RESPONSE:", responseText);

  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error("Grok returned an invalid response");
  }

  if (!res.ok) {
    throw new Error(
      data.error?.message || "Grok request failed"
    );
  }

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Grok returned an empty response");
  }

  return content;
}

router.post("/", async (req, res) => {
  const { task, provider } = req.body;

  if (!task || !task.trim()) {
    return res.status(400).json({ message: "Task is required." });
  }

  try {
    const prompt = PROMPT(task.trim());
    const text =
      provider === "grok" ? await askGrok(prompt) : await askGemini(prompt);
    res.status(200).json({ provider, subtasks: parseSubtasks(text) });
  } catch (error) {
    console.error("AI error:", error.message);
    res.status(500).json({ message: "AI request failed. Try again." });
  }
});

module.exports = router;