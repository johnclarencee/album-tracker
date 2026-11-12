export default function Stars({ value = 0, onChange }) {
  return (
    <div className="stars" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((number) => (
        <button key={number} className={`star ${number <= value ? "on" : ""}`} aria-label={`${number} star${number > 1 ? "s" : ""}`} onClick={() => onChange(number === value ? 0 : number)}>
          ★
        </button>
      ))}
    </div>
  );
}
