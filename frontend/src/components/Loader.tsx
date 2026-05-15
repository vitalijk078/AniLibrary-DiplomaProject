export function Loader() {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__circle" />
      <p>Загрузка данных...</p>
    </div>
  );
}
