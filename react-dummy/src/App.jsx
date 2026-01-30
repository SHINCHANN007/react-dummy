import { useState } from "react";
import StepObserved from "./components/StepObserved";
import StepLatent from "./components/StepLatent";
import StepMeasurement from "./components/StepMeasurement";
import StepOutput from "./components/StepOutput";
import StepStructural from "./components/StepStructural";
import Diagram from "./components/Diagram";
import Summary from "./components/Summary";

export default function App() {
  const [observed, setObserved] = useState([]);
  const [latent, setLatent] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [model, setModel] = useState(null);

  return (
    <div className="app">
      <h1>SEM Diagram Generator</h1>
      <p className="subtitle">
        Build SEM models step-by-step with clean structure.
      </p>

      <div className="grid-container">
        <StepObserved observed={observed} setObserved={setObserved} />
        <StepLatent latent={latent} setLatent={setLatent} />
        <StepMeasurement observed={observed} latent={latent} />
        <StepOutput outputs={outputs} setOutputs={setOutputs} />
      </div>

      <StepStructural
        latent={latent}
        outputs={outputs}
        setModel={setModel}
      />

      {model && (
        <>
          <Diagram model={model} />
          <Summary model={model} />
        </>
      )}
    </div>
  );
}
