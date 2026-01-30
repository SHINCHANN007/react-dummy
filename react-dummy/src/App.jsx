import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid/dist/mermaid.esm.mjs";
import SEMRecommender from "./components/SEMRecommender";

const clean = v => v.trim();
const safeId = v => v.trim().replace(/\s+/g, "_");

export default function App() {
  const [obsCount, setObsCount] = useState(2);
  const [latentCount, setLatentCount] = useState(1);
  const [outputCount, setOutputCount] = useState(1);

  const [observed, setObserved] = useState([]);
  const [latent, setLatent] = useState([]);
  const [outputs, setOutputs] = useState([]);

  const [measurement, setMeasurement] = useState([]);
  const [structural, setStructural] = useState([]);

  const diagramRef = useRef(null);

  /* 🔧 Mermaid init */
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });
  }, []);

  /* 🔒 Remove invalid self-loops automatically */
  useEffect(() => {
    setStructural(prev => prev.filter(s => s.latent !== s.output));
  }, [latent, outputs]);

  /* 🌉 BRIDGE: allow SEMRecommender to inject data safely */
  useEffect(() => {
    window.applySEMFromAI = ({ observed, latent, outputs }) => {
      setObserved(observed);
      setLatent(latent);
      setOutputs(outputs);

      setObsCount(observed.length);
      setLatentCount(latent.length);
      setOutputCount(outputs.length);

      setMeasurement([]);
      setStructural([]);

      setTimeout(() => {
        document
          .querySelector(".grid-container")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    };
  }, []);

  /* 📊 Generate Mermaid diagram */
  const generateDiagram = () => {
    const mValid = measurement.filter(m => m.observed && m.latent);
    const sValid = structural.filter(
      s => s.latent && s.output && s.latent !== s.output
    );

    if (!mValid.length || !sValid.length) {
      alert("Invalid or incomplete SEM model.");
      return;
    }

    let graph = "graph LR\n";

    mValid.forEach(m => {
      graph += `${safeId(m.observed)}[${m.observed}] --> ${safeId(
        m.latent
      )}((${m.latent}))\n`;
    });

    sValid.forEach(s => {
      graph += `${safeId(s.latent)}((${s.latent})) --> ${safeId(
        s.output
      )}[${s.output}]\n`;
    });

    diagramRef.current.innerHTML = "";
    diagramRef.current.removeAttribute("data-processed");
    diagramRef.current.textContent = graph;

    mermaid.run({ nodes: [diagramRef.current] });
  };

  return (
    <>
      <h1>SEM Diagram Generator</h1>

      <p className="subtitle">
        Build your own SEM model step-by-step to understand how observed variables,
        latent constructs, and outcomes are connected.
      </p>

      {/* 🔍 AI SEM EXAMPLE RECOMMENDER */}
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

          <div id="observedInputs">
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

          <div id="latentInputs">
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
        </div>

        {/* STEP 3 */}
        <div className="box">
          <h2>Step 3: Measurement Model</h2>

          <div id="measurementInputs">
            {!observed.length || !latent.length ? (
              <em>Fill Steps 1 and 2 first.</em>
            ) : (
              latent.map(lv => (
                <div key={lv} className="latent-card">
                  <h4>🟣 {lv}</h4>

                  {observed.map(ov => (
                    <label key={ov}>
                      <input
                        type="checkbox"
                        onChange={e => {
                          setMeasurement(prev => {
                            const exists = prev.find(
                              x => x.observed === ov && x.latent === lv
                            );

                            if (e.target.checked && !exists) {
                              return [
                                ...prev,
                                { observed: clean(ov), latent: clean(lv) }
                              ];
                            }

                            if (!e.target.checked && exists) {
                              return prev.filter(
                                x =>
                                  !(
                                    x.observed === ov && x.latent === lv
                                  )
                              );
                            }

                            return prev;
                          });
                        }}
                      />
                      {ov}
                    </label>
                  ))}
                </div>
              ))
            )}
          </div>
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

          <div id="outputInputs">
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
      </div>

      {/* STEP 5 */}
      <div className="box">
        <h2>Step 5: Structural Model</h2>

        <div id="structuralInputs">
          {outputs.map(o => (
            <div key={o} className="latent-card">
              <h4>🎯 {o}</h4>

              {latent.filter(lv => lv !== o).map(lv => (
                <label key={lv}>
                  <input
                    type="checkbox"
                    onChange={e => {
                      setStructural(prev => {
                        const exists = prev.find(
                          x => x.latent === lv && x.output === o
                        );

                        if (e.target.checked && !exists) {
                          return [
                            ...prev,
                            { latent: clean(lv), output: clean(o) }
                          ];
                        }

                        if (!e.target.checked && exists) {
                          return prev.filter(
                            x =>
                              !(
                                x.latent === lv && x.output === o
                              )
                          );
                        }

                        return prev;
                      });
                    }}
                  />
                  {lv}
                </label>
              ))}
            </div>
          ))}
        </div>
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

      <div className="box">
        <h2>SEM Model Output</h2>
        <div id="modelSummary"></div>
      </div>
    </>
  );
}
