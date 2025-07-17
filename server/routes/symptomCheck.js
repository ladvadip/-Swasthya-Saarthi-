const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");

router.post('/', async (req, res) => {
  const { symptoms, language } = req.body;

  const prompt = `
You are a helpful health assistant. A user reports the following symptoms: ${symptoms}.
Suggest 2-3 possible health conditions and whether they should see a doctor.
Respond in ${language}. Give general advice only.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    res.json({ reply });
  } catch (error) {
    console.error("Symptom Checker Error:", error.message);
    res.status(500).json({ reply: "Sorry, I couldn't process that. Try again later." });
  }
});

module.exports = router;
