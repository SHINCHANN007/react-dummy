import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid/dist/mermaid.esm.mjs";
import SEMRecommender from "./components/SEMRecommender";
import Summary from "./components/Summary";

/* helpers */
const clean = v => v.trim();
const safeId = v => v.trim().replace(/\s+/g, "_");

export default function App() {
  const [obsCount, setObsCount] = useState(2);
  const [latentCount, setLatentCount] = useState(1);
  const [outputCount, setOutputCount] = useState(1);

  const [observed, setObserved] = useState([]);
  const [latent, setLatent] = useState([]);
  const [outputs, setOutputs] = useState([]);

  const [modelSummary, setModelSummary] = useState(null);

  const diagramRef = useRef(null);

  /* Mermaid init */
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });
  }, []);

  /* AI → inject clean state */
  useEffect(() => {
    window.applySEMFromAI = ({ observed, latent, outputs }) => {
      setObserved(observed);
      setLatent(latent);
      setOutputs(outputs);

      setObsCount(observed.length);
      setLatentCount(latent.length);
      setOutputCount(outputs.length);

      setModelSummary(null);
    };
  }, []);

  /* 🔥 BUILD MODEL FRESH EVERY TIME */
  const generateDiagram = () => {
    const measurement = [];
    const structural = [];

    document
      .querySelectorAll('input[type="checkbox"]:checked')
      .forEach(cb => {
        /* measurement */
        if (cb.dataset.type === "measurement") {
          if (!cb.dataset.observed || !cb.dataset.latent) return;

          measurement.push({
            observed: clean(cb.dataset.observed),
            latent: clean(cb.dataset.latent)
          });
        }

        /* structural */
        if (cb.dataset.type === "structural") {
          if (
            !cb.dataset.latent ||
            !cb.dataset.output ||
            clean(cb.dataset.latent) === clean(cb.dataset.output)
          )
            return;

          structural.push({
            latent: clean(cb.dataset.latent),
            output: clean(cb.dataset.output)
          });
        }
      });

    if (!measurement.length || !structural.length) {
      alert("Invalid or incomplete SEM model.");
      return;
    }

    /* Build Mermaid */
    let graph = "graph LR\n";

    measurement.forEach(m => {
      graph += `${safeId(m.observed)}[${m.observed}] --> ${safeId(
        m.latent
      )}((${m.latent}))\n`;
    });

    structural.forEach(s => {
      graph += `${safeId(s.latent)}((${s.latent})) --> ${safeId(
        s.output
      )}[${s.output}]\n`;
    });

    diagramRef.current.innerHTML = "";
    diagramRef.current.removeAttribute("data-processed");
    diagramRef.current.textContent = graph;

    mermaid.run({ nodes: [diagramRef.current] });

    setModelSummary({ measurement, structural });
  };

  return (
    <>
      <h1>SEM Diagram Generator</h1>

      <p className="subtitle">
        Build your own SEM model step-by-step to understand how observed variables,
        latent constructs, and outcomes are connected.
      </p>

      <SEMRecommender />

      <div className="grid-container">
        {/* STEP 1 */}
        <div className="box">
          <h2>Step 1: Observed Variables</h2>

          <input
            type="number"
            min="1"
            value={obsCount}
            onChange={e => setObsCount(+e.target.value)}
          />
          <button onClick={() => setObserved(Array(obsCount).fill(""))}>
            Create
          </button>

          {observed.map((v, i) => (
            <input
              key={i}
              placeholder={`Observed variable ${i + 1}`}
              value={v}
              onChange={e => {
                const copy = [...observed];
                copy[i] = e.target.value;
                setObserved(copy);
              }}
            />
          ))}
        </div>

        {/* STEP 2 */}
        <div className="box">
          <h2>Step 2: Latent Variables</h2>

          <input
            type="number"
            min="1"
            value={latentCount}
            onChange={e => setLatentCount(+e.target.value)}
          />
          <button onClick={() => setLatent(Array(latentCount).fill(""))}>
            Create
          </button>

          {latent.map((v, i) => (
            <input
              key={i}
              placeholder={`Latent variable ${i + 1}`}
              value={v}
              onChange={e => {
                const copy = [...latent];
                copy[i] = e.target.value;
                setLatent(copy);
              }}
            />
          ))}
        </div>

        {/* STEP 3 */}
        <div className="box">
          <h2>Step 3: Measurement Model</h2>

          {latent
            .map(clean)
            .filter(Boolean)
            .map(lv => (
              <div key={lv} className="latent-card">
                <h4>🟣 {lv}</h4>

                {observed
                  .map(clean)
                  .filter(Boolean)
                  .map(ov => (
                    <label key={ov}>
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

        {/* STEP 4 */}
        <div className="box">
          <h2>Step 4: Output Variables</h2>

          <input
            type="number"
            min="1"
            value={outputCount}
            onChange={e => setOutputCount(+e.target.value)}
          />
          <button onClick={() => setOutputs(Array(outputCount).fill(""))}>
            Create
          </button>

          {outputs.map((v, i) => (
            <input
              key={i}
              placeholder={`Output variable ${i + 1}`}
              value={v}
              onChange={e => {
                const copy = [...outputs];
                copy[i] = e.target.value;
                setOutputs(copy);
              }}
            />
          ))}
        </div>
      </div>

      {/* STEP 5 */}
      <div className="box">
        <h2>Step 5: Structural Model</h2>

        {outputs
          .map(clean)
          .filter(Boolean)
          .map(o => (
            <div key={o} className="latent-card">
              <h4>🎯 {o}</h4>

              {latent
                .map(clean)
                .filter(lv => lv && lv !== o)
                .map(lv => (
                  <label key={lv}>
                    <input
                      type="checkbox"
                      data-type="structural"
                      data-latent={lv}
                      data-output={o}
                    />
                    {lv}
                  </label>
                ))}
            </div>
          ))}
      </div>

      <div className="box center">
        <button id="generateBtn" onClick={generateDiagram}>
          Generate SEM Diagram
        </button>
      </div>

      <div className="box">
        <h2>SEM Diagram</h2>
        <div id="diagram" ref={diagramRef} className="mermaid"></div>
      </div>

      {modelSummary && <Summary model={modelSummary} />}
    </>
  );
}
