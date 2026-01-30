const generateDiagram = () => {
  const measurement = [];
  const structural = [];

  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach(cb => {
      if (cb.dataset.type === "measurement") {
        measurement.push({
          observed: clean(cb.dataset.observed),
          latent: clean(cb.dataset.latent)
        });
      }

      if (cb.dataset.type === "structural") {
        if (cb.dataset.latent !== cb.dataset.output) {
          structural.push({
            latent: clean(cb.dataset.latent),
            output: clean(cb.dataset.output)
          });
        }
      }
    });

  if (!measurement.length || !structural.length) {
    alert("Invalid or incomplete SEM model.");
    return;
  }

  let graph = "graph LR\n";

  measurement.forEach(m => {
    graph += `${safeId(m.observed)}[${m.observed}] --> ${safeId(m.latent)}((${m.latent}))\n`;
  });

  structural.forEach(s => {
    graph += `${safeId(s.latent)}((${s.latent})) --> ${safeId(s.output)}[${s.output}]\n`;
  });

  diagramRef.current.innerHTML = "";
  diagramRef.current.removeAttribute("data-processed");
  diagramRef.current.textContent = graph;

  mermaid.run({ nodes: [diagramRef.current] });
};
