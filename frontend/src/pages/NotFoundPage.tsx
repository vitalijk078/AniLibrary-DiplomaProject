import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="page">
      <section className="not-found">
        <h1>404</h1>
        <p>Страница не найдена или была перемещена.</p>
        <Link to="/" className="button-link">
          Вернуться на главную
        </Link>
      </section>
    </main>
  );
}
