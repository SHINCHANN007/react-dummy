import { useState } from "react";

export default function GuessSirCircle({ images, correctId, onSuccess }) {
  const [error, setError] = useState("");

  function handleClick(id) {
    if (id === correctId) {
      setError("");
      onSuccess();
    } else {
      setError("wrong choice. look carefully.");
    }
  }

  return (
    <div className="mcq-overlay">
      <div className="mcq-popup">
        <h3>guess the sir</h3>

        <div className="circle-wrap">
          {images.map(img => (
            <button
              key={img.id}
              className="circle-item"
              onClick={() => handleClick(img.id)}
            >
              <img src={img.src} alt="option" />
            </button>
          ))}
        </div>

        {error && <p className="mcq-error">{error}</p>}
      </div>
    </div>
  );
}
