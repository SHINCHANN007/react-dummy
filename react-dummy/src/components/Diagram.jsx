const generateDiagram = () => {
  const validMeasurement = measurement.filter(
    m => m.observed && m.latent
  );
  const validStructural = structural.filter(
    s => s.latent && s.output
  );

  if (!validMeasurement.length || !validStructural.length) {
    alert("Invalid or incomplete SEM model.");
    return;
  }

  let graph = "graph LR\n";

  validMeasurement.forEach(m => {
    graph += `${safeId(m.observed)}[${m.observed}] --> ${safeId(m.latent)}((${m.latent}))\n`;
  });

  validStructural.forEach(s => {
    graph += `${safeId(s.latent)}((${s.latent})) --> ${safeId(s.output)}[${s.output}]\n`;
  });

  diagramRef.current.innerHTML = graph;
  mermaid.run({ nodes: [diagramRef.current] });
};
