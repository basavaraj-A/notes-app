import { useState, useEffect } from "react";

const API_URL = "https://notes-backend-tana.onrender.com";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Fetch notes from backend
  useEffect(() => {
    fetch(`${API_URL}/notes`)
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error(err));
  }, []);

  // Add a new note
  const addNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const res = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    const newNote = await res.json();
    setNotes([...notes, newNote]);
    setTitle("");
    setContent("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>📝 Notes App</h1>

      {/* Note Form */}
      <form onSubmit={addNote} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Add Note
        </button>
      </form>

      {/* Notes List */}
      <h2>All Notes</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notes.map((note) => (
          <li
            key={note.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{note.title}</h3>
            <p>{note.content}</p>

            {/* Summarize Button */}
            <button
              onClick={async () => {
                const res = await fetch(`${API_URL}/summarize`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ content: note.content }),
                });
                const data = await res.json();
                alert(`Summary: ${data.summary}`);
              }}
              style={{ marginTop: "8px", padding: "5px 10px" }}
            >
              Summarize Note
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
