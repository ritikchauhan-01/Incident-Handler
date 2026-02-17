export default function Pagination({ page, total, onChange }) {
  return (
    <div className="pagination">
      {[...Array(total).keys()].map(p => (
        <button
          key={p}
          className={p === page ? "active" : ""}
          onClick={() => onChange(p)}
        >
          {p + 1}
        </button>
      ))}
    </div>
  );
}
