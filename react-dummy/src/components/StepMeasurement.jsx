export default function StepMeasurement({ observed, latent, setMeasurement }) {
  if (!observed.length || !latent.length) {
    return <div className="box"><em>Fill steps 1 and 2 first.</em></div>;
  }

  return (
    <div className="box">
      <h2>Step 3: Measurement Model</h2>

      {latent.map(lv => (
        <div key={lv} className="latent-card">
          <h4>🟣 {lv}</h4>

          {observed.map(ov => (
            <label key={ov} className="checkbox">
              <input
                type="checkbox"
                onChange={e => setMeasurement(lv, ov, e.target.checked)}
              />
              {ov}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
