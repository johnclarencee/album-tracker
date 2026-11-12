import { STATUSES } from "./statuses.js";

export default function StatusSelect({ value, onChange }) {
  return (
    <div className="chips" role="group" aria-label="Listening status">
      {STATUSES.map((status) => (
        <button key={status.id} className={`chip ${value === status.id ? "on" : ""}`} onClick={() => onChange(status.id)}>
          {status.label}
        </button>
      ))}
    </div>
  );
}
