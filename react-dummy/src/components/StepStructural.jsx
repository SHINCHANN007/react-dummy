export default function StepStructural({ latent, outputs }) {
  if (!latent.length || !outputs.length) {
    return (
      <div className="box">
        <h2>Step 5: Structural Model</h2>
        <em>Define latent and output variables first.</em>
      </div>
    );
  }

  return (
    <div className="box">
      <h2>Step 5: Structural Model</h2>

      {outputs.map(out => (
        <div key={out} className="latent-card">
          <h4>🎯 {out}</h4>

          {latent
            .filter(lv => lv !== out) // ❌ block self-loops
            .map(lv => (
              <label key={`${lv}-${out}`}>
                <input
                  type="checkbox"
                  data-type="structural"
                  data-latent={lv}
                  data-output={out}
                />
                {lv}
              </label>
            ))}
        </div>
      ))}
    </div>
  );
}
