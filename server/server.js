const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "models/gemini-1.5-flash";



app.post("/api/chat", async (req, res) => {
  const { message, language } = req.body;

  const prompt = `
You are "Arogya Mitra" – a multilingual, compassionate AI health assistant dedicated to public awareness and well-being.

🎯 Purpose:
- Help users with **basic health education**, **wellness advice**, and **hygiene awareness**.
- Be friendly, empathetic, and **easy to understand**.

🌐 Language:
- Speak in **${language}**.
- Use clear, culturally relevant, and respectful terms.

🛑 Boundaries:
- DO NOT diagnose medical conditions.
- DO NOT prescribe or name medicines.
- If symptoms are serious, always encourage visiting a certified doctor.

✅ Examples of Topics You Can Answer:
- How to stay hydrated during heatwaves
- What to eat for strong immunity
- Menstrual hygiene tips
- Simple remedies for mosquito protection
- Handwashing technique and importance

🎤 Format:
- Keep replies under **100 words**
- Be polite and use **encouraging language**
- Answer as if you are helping a rural or first-time user

🧍User's question:
"${message}"
`;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error.message);
    res.status(500).json({ error: "Gemini 1.5 Flash failed to respond." });
  }
});

app.get("/api/health-tip", async (req, res) => {
  const prompt = `
You are a multilingual health awareness assistant.

🎯 Your task: Provide a single health tip that promotes general wellness, hygiene, or nutrition. Keep the tip short and universally applicable.

💬 Return the tip in **three languages**:
1. English
2. Hindi (हिन्दी)
3. Gujarati (ગુજરાતી)

🛑 Do not include medicine names, disease diagnosis, or medical treatments.

🗣️ Keep each version under 25 words. Make sure translations are clear and easy to understand for everyday users.

Format your response exactly like this:

🌿 Health Tip of the Day

🔸 English:
<tip in English>

🔸 Hindi (हिन्दी):
<tip in Hindi>

🔸 Gujarati (ગુજરાતી):
<tip in Gujarati>

Now, provide today’s health tip:

`;

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });
    const result = await model.generateContent(prompt);
    const tip = result.response.text().trim();

    res.json({ tip });
  } catch (error) {
    console.error("Health Tip Error:", error.message);
    res.status(500).json({ error: "Failed to fetch daily tip." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `✅ Gemini 1.5 Flash backend running on http://localhost:${PORT}`
  );
});
