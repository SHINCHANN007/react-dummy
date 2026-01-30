export default function StepMeasurement({ observed, latent }) {
  if (!observed.length || !latent.length) {
    return (
      <div className="box">
        <h2>Step 3: Measurement Model</h2>
        <em>Fill Steps 1 and 2 first.</em>
      </div>
    );
  }

  return (
    <div className="box">
      <h2>Step 3: Measurement Model</h2>

      {latent.map(lv => (
        <div key={lv} className="latent-card">
          <h4>🟣 {lv}</h4>

          {observed.map(ov => (
            <label key={`${ov}-${lv}`}>
              <input
                type="checkbox"
                data-type="measurement"
                data-observed={ov}
                data-latent={lv}
              />
              {ov}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
