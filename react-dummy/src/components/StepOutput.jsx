export default function StepOutput({ outputs, setOutputs }) {
  const setCount = n => setOutputs(Array(n).fill(""));

  const setValue = (i, v) => {
    const copy = [...outputs];
    copy[i] = v;
    setOutputs(copy);
  };

  return (
    <div className="box">
      <h2>Step 4: Output Variables</h2>

      <input
        type="number"
        min="1"
        defaultValue="1"
        onChange={e => setCount(+e.target.value)}
      />

      {outputs.map((v, i) => (
        <input
          key={i}
          placeholder={`Output variable ${i + 1}`}
          value={v}
          onChange={e => setValue(i, e.target.value)}
        />
      ))}
    </div>
  );
}
