import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// In-memory notes
let notes = [];

// Get all notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// Add a new note
app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const newNote = { id: Date.now(), title, content };
  notes.push(newNote);
  res.status(201).json(newNote);
});

// Summarize Note using OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/summarize", async (req, res) => {
  const { content } = req.body;
  console.log("📩 Summarize request received with content:", content);

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // lightweight + fast
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes text.",
        },
        { role: "user", content: `Summarize this note: ${content}` },
      ],
    });

    console.log("✅ OpenAI response:", JSON.stringify(response, null, 2));

    const summary =
      response.choices?.[0]?.message?.content ?? "No summary generated";

    res.json({ summary });
  } catch (error) {
    console.error("❌ Error with OpenAI API:", error);

    // ✅ fallback: create a mock summary so app doesn't break
    const fallbackSummary =
      content.length > 30 ? content.slice(0, 30) + "..." : content;

    res.json({
      summary: `[MOCK] ${fallbackSummary}`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
