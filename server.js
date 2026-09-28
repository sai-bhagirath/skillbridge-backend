const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SkillBridge AI is working with Hugging Face!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b:fastest",
          messages: [
            {
              role: "system",
              content:
                "You are SkillBridge AI. Help students learn programming, DSA, web development, mathematics, science, engineering, technology, projects and career topics. Explain difficult concepts simply and provide working code when asked.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          stream: false,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("HUGGING FACE ERROR:", data);
      return res.status(response.status).json({
        error: "Hugging Face AI request failed.",
      });
    }

    res.json({
      answer: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);

    res.status(500).json({
      error: "Could not connect to SkillBridge AI.",
    });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SkillBridge AI running on port ${PORT}`);
});