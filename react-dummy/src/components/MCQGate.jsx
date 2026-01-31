import { useState } from "react";

export default function MCQGate({ onSuccess }) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  function validate() {
    const normalized = answer.toLowerCase();

    if (
      normalized.includes("adarsh") ||
      normalized.includes("adharsh")
    ) {
      setAnswer("");
      setError("");
      onSuccess(); // 🔓 tell parent to unlock
    } else {
      setError("wrong answer. hint: name matters.");
    }
  }

  return (
    <div className="mcq-overlay">
      <div className="mcq-popup">
        <h3>who is your fav sir?</h3>

        <input
          className="mcq-input"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="type your answer"
        />

        {error && <p className="mcq-error">{error}</p>}

        <button className="mcq-btn" onClick={validate}>
          submit answer
        </button>
      </div>
    </div>
  );
}
