export default function Summary({ model }) {
  if (!model || (!model.measurement.length && !model.structural.length)) {
    return (
      <div className="box">
        <h2>SEM Model Output</h2>
        <em>No model generated yet.</em>
      </div>
    );
  }

  return (
    <div className="box">
      <h2>SEM Model Output</h2>

      <div style={{ marginBottom: "10px" }}>
        <strong>Measurement paths</strong>
        <ul>
          {model.measurement.map((m, i) => (
            <li key={i}>
              {m.observed} → {m.latent}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <strong>Structural paths</strong>
        <ul>
          {model.structural.map((s, i) => (
            <li key={i}>
              {s.latent} → {s.output}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
