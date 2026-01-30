export default function Summary({ model }) {
  return (
    <div className="box">
      <h2>SEM Model Output</h2>

      <ul>
        <li>
          <strong>Measurement paths:</strong> {model.measurement.length}
        </li>
        <li>
          <strong>Structural paths:</strong> {model.structural.length}
        </li>
      </ul>
    </div>
  );
}
