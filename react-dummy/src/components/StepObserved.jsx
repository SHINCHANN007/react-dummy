export default function StepObserved({ observed, setObserved }) {
  const setCount = n => setObserved(Array(n).fill(""));

  const setValue = (i, v) => {
    const copy = [...observed];
    copy[i] = v;
    setObserved(copy);
  };

  return (
    <div className="box">
      <h2>Step 1: Observed Variables</h2>

      <input
        type="number"
        min="1"
        defaultValue="2"
        onChange={e => setCount(+e.target.value)}
      />

      {observed.map((v, i) => (
        <input
          key={i}
          placeholder={`Observed variable ${i + 1}`}
          value={v}
          onChange={e => setValue(i, e.target.value)}
        />
      ))}
    </div>
  );
}
