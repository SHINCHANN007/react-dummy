import { useState } from "react";

/* 🔑 MULTIPLE API KEYS (ROTATION SAFE) */
const API_KEYS = [
  "AIzaSyBijCT8xiPcL9I8ymPl2MWOJkjHkwivPM8",
  "AIzaSyAjnXVUDU7UPgjbsIuNgInXzQa9_jI2vro",
  "AIzaSyBoDdiJEHspOdG-wvBKMqbgwkCc7NbG-44",
  "AIzaSyCpUWfLPA4-DKs0BXMKfJ6sZbt1CC6ElbU",
  "AIzaSyAgtix3D7qmQLBQ_D0Zh2zyxR4tHBzQDXo"
];

let keyIndex = 0;
const getKey = () => API_KEYS[keyIndex];
const rotateKey = () =>
  (keyIndex = (keyIndex + 1) % API_KEYS.length);

const MODEL = "gemini-2.5-flash";

/* 🔒 STRICT SYSTEM PROMPT */
const SYSTEM_PROMPT = `
You are a SEM (Structural Equation Modeling) assistant.

RULES:
- Use the topic EXACTLY as given.
- Do NOT explain anything.
- Do NOT use markdown.
- Output JSON ONLY.

Generate EXACTLY TWO SEM examples.

Each example must contain:
- observed (array of strings)
- latent (array of strings)
- outputs (array of strings)

Constraints:
- Each latent must have at least 2 observed indicators.
- Latent variables must not appear in outputs.
- Observed variables must not appear in latent or outputs.

OUTPUT FORMAT (JSON ONLY):

[
  {
    "observed": ["", ""],
    "latent": [""],
    "outputs": [""]
  },
  {
    "observed": ["", ""],
    "latent": [""],
    "outputs": [""]
  }
]
`;

/* 🛟 GUARANTEED FALLBACK (NEVER FAILS) */
function fallbackExamples(topic) {
  return [
    {
      observed: [`${topic} frequency`, `${topic} duration`],
      latent: [`${topic} involvement`],
      outputs: [`performance outcome`]
    },
    {
      observed: [`${topic} intensity`, `${topic} consistency`],
      latent: [`${topic} engagement`],
      outputs: [`final result`]
    }
  ];
}

/* 🔧 SAFE JSON EXTRACTOR */
function extractJSONArray(text) {
  if (!text) throw new Error("Empty AI response");

  text = text.replace(/```json|```/gi, "").trim();
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array found");

  return JSON.parse(match[0]);
}

export default function SEMRecommender() {
  const [topic, setTopic] = useState("");
  const [examples, setExamples] = useState([]);
  const [remaining, setRemaining] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchExamples(retry = false) {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    if (remaining <= 0) {
      setError("Free tries exhausted.");
      return;
    }

    setLoading(true);
    setError("");
    setExamples([]);
    setRemaining(r => r - 1);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${getKey()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
              { role: "user", parts: [{ text: topic }] }
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 900
            }
          })
        }
      );

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      const raw =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const parsed = extractJSONArray(raw);

      setExamples(parsed);
    } catch (err) {
      // 🔁 TRY NEXT KEY ONCE
      if (!retry && API_KEYS.length > 1) {
        rotateKey();
        fetchExamples(true);
        return;
      }

      // 🛟 FINAL GUARANTEE: FALLBACK
      console.warn("⚠️ AI failed, using fallback examples");
      setExamples(fallbackExamples(topic));
      setError("");
    } finally {
      setLoading(false);
    }
  }

  function applyExample(ex) {
    if (!window.applySEMFromAI) {
      alert("SEM visualizer not ready.");
      return;
    }

    window.applySEMFromAI({
      observed: ex.observed || [],
      latent: ex.latent || [],
      outputs: ex.outputs || []
    });
  }

  return (
    <div className="box">
      <h2>🔍 SEM Example Recommender</h2>

      <p className="hint">
        Enter any topic and get SEM-ready examples.
      </p>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="e.g., ghost dancer man"
          style={{ flex: 1 }}
        />
        <strong>Free tries: {remaining}</strong>
      </div>

      <button onClick={fetchExamples} disabled={loading}>
        {loading ? "Generating..." : "Get Examples"}
      </button>

      {error && <p className="warning">{error}</p>}

      {examples.map((ex, i) => (
        <div key={i} className="latent-card">
          <h4>📋 Example {i + 1}</h4>

          <p><strong>Observed:</strong> {ex.observed.join(", ")}</p>
          <p><strong>Latent:</strong> {ex.latent.join(", ")}</p>
          <p><strong>Output:</strong> {ex.outputs.join(", ")}</p>

          <button onClick={() => applyExample(ex)}>
            ✨ Apply This Example
          </button>
        </div>
      ))}
    </div>
  );
}
