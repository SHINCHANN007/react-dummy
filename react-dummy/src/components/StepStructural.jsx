export default function StepStructural({
  latent,
  outputs,
  measurement,
  setModel
}) {
  if (!latent.length || !outputs.length) {
    return <div className="box"><em>Define latent and outputs first.</em></div>;
  }

  const generate = () => {
    const structural = [];

    document
      .querySelectorAll('input[data-output]:checked')
      .forEach(cb => {
        structural.push({
          latent: cb.value,
          output: cb.dataset.output
        });
      });

    if (!structural.length) {
      alert("Define at least one structural path");
      return;
    }

    setModel({
      measurement,
      structural
    });
  };

  return (
    <div className="box">
      <h2>Step 5: Structural Model</h2>

      {outputs.map(o => (
        <div key={o} className="latent-card">
          <h4>🎯 {o}</h4>

          {latent.map(lv => (
            <label key={lv} className="checkbox">
              <input
                type="checkbox"
                data-output={o}
                value={lv}
              />
              {lv}
            </label>
          ))}
        </div>
      ))}

      <button onClick={generate}>Generate SEM Diagram</button>
    </div>
  );
}
