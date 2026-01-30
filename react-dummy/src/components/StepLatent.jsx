export default function StepLatent({ latent, setLatent }) {
  const setCount = n => setLatent(Array(n).fill(""));

  const setValue = (i, v) => {
    const copy = [...latent];
    copy[i] = v;
    setLatent(copy);
  };

  return (
    <div className="box">
      <h2>Step 2: Latent Variables</h2>

      <input
        type="number"
        min="1"
        defaultValue="1"
        onChange={e => setCount(+e.target.value)}
      />

      {latent.map((v, i) => (
        <input
          key={i}
          placeholder={`Latent variable ${i + 1}`}
          value={v}
          onChange={e => setValue(i, e.target.value)}
        />
      ))}
    </div>
  );
}
