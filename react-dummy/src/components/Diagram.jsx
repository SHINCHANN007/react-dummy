import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function Diagram({ model }) {
  const ref = useRef();

  useEffect(() => {
    if (!model) return;

    let text = "graph LR\n";

    model.measurement.forEach(m => {
      text += `${m.observed}[${m.observed}] --> ${m.latent}((${m.latent}))\n`;
    });

    model.structural.forEach(s => {
      text += `${s.latent}((${s.latent})) --> ${s.output}[${s.output}]\n`;
    });

    mermaid.initialize({ startOnLoad: false });
    ref.current.innerHTML = text;
    mermaid.run({ nodes: [ref.current] });
  }, [model]);

  return (
    <div className="box">
      <h2>SEM Diagram</h2>
      <div ref={ref} className="mermaid"></div>
    </div>
  );
}
