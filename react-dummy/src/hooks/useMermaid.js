import { useEffect } from "react";
import mermaid from "mermaid";

export default function useMermaid(ref, diagram) {
  useEffect(() => {
    if (!diagram || !ref.current) return;

    mermaid.initialize({ startOnLoad: false });
    ref.current.innerHTML = diagram;
    mermaid.run({ nodes: [ref.current] });
  }, [diagram]);
}
