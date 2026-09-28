const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SkillBridge AI is working with Ollama!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:3b",
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
    });

    const data = await response.json();

    res.json({
      answer: data.message.content,
    });
  } catch (error) {
    console.error("OLLAMA ERROR:", error);

    res.status(500).json({
      error: "Could not connect to local SkillBridge AI.",
    });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SkillBridge AI running on http://localhost:${PORT}`);
});