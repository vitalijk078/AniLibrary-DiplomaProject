import { FormEvent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { getPopularAnime, getSeasonAnime } from "../api/shikimoriApi";
import { AnimeGrid } from "../components/AnimeGrid";
import { AnimeStrip } from "../components/AnimeStrip";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loader } from "../components/Loader";
import { formatKind, formatScore } from "../utils/formatters";

const heroSlides = [
  {
    label: "AnimeHub",
    title: "Найди аниме для вечера",
    text: "Подборки, жанры, быстрый поиск и русские описания помогают выбрать тайтл без долгого листания.",
  },
  {
    label: "Подборки",
    title: "Выбери тайтл под настроение",
    text: "Романтика, экшен, фэнтези, школа или комедия — переходи к нужному жанру и сохраняй интересное в избранное.",
  },
  {
    label: "Список просмотра",
    title: "Собери свою полку аниме",
    text: "Добавляй понравившиеся тайтлы в избранное и возвращайся к ним, когда захочется продолжить просмотр.",
  },
  {
    label: "Новинки",
    title: "Открой хиты и новые сезоны",
    text: "Смотри популярные аниме, проверяй новинки сезона и переходи к подробной карточке тайтла в один клик.",
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const popularQuery = useQuery({
    queryKey: ["popular-anime"],
    queryFn: getPopularAnime,
  });

  const seasonQuery = useQuery({
    queryKey: ["season-anime"],
    queryFn: getSeasonAnime,
  });

  const featuredAnime = popularQuery.data?.[0];

  const activeSlide = heroSlides[activeSlideIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlideIndex((currentIndex) => (currentIndex + 1) % heroSlides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) {
      navigate("/catalog");
      return;
    }

    navigate(`/catalog?search=${encodeURIComponent(query)}`);
  }

  return (
    <main className="page">
        <section className="hero hero--anime">
          <div className="hero__content">
            <div className="hero-copy" key={activeSlide.title}>
              <p className="hero__label">{activeSlide.label}</p>
              <h1>{activeSlide.title}</h1>
              <p>{activeSlide.text}</p>
            </div>

            <div className="hero-dots" aria-label="Слайды главного экрана">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  className={index === activeSlideIndex ? "hero-dots__item is-active" : "hero-dots__item"}
                  aria-label={`Показать слайд ${index + 1}`}
                  onClick={() => setActiveSlideIndex(index)}
                />
              ))}
            </div>

            <form className="hero-search" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Введите название аниме..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                aria-label="Поиск аниме на главной странице"
              />
              <button type="submit">Найти</button>
            </form>

            <div className="hero-tags" aria-label="Популярные запросы">
              <Link to="/catalog?search=Наруто">Наруто</Link>
              <Link to="/catalog?search=Атака титанов">Атака титанов</Link>
              <Link to="/catalog?search=Магическая битва">Магическая битва</Link>
              <Link to="/catalog?search=Ван-Пис">Ван-Пис</Link>
            </div>
          </div>

          {featuredAnime && (
            <Link to={`/anime/${featuredAnime.id}`} className="featured-card">
              <div className="featured-card__poster-wrap">
                <img
                  src={featuredAnime.image}
                  alt={featuredAnime.title}
                  className="featured-card__poster"
                />
              </div>

              <div className="featured-card__content">
                <span className="featured-card__badge">Сейчас популярно</span>
                <h2>{featuredAnime.title}</h2>
                <p>{featuredAnime.originalTitle}</p>

                <div className="featured-card__meta">
                  <span>{formatKind(featuredAnime.kind)}</span>
                  <span>{formatScore(featuredAnime.score)}</span>
                  <span>{featuredAnime.airedOn?.slice(0, 4) || "год не указан"}</span>
                </div>
              </div>
            </Link>
          )}
        </section>

        {popularQuery.data && (
          <AnimeStrip
            title="Сейчас смотрят"
            description="Популярные тайтлы, которые чаще всего открывают пользователи."
            items={popularQuery.data}
          />
        )}

        <section className="genre-shortcuts" aria-label="Быстрые разделы">
          <Link to="/catalog?search=romance">Романтика</Link>
          <Link to="/catalog?search=action">Экшен</Link>
          <Link to="/catalog?search=fantasy">Фэнтези</Link>
          <Link to="/catalog?search=school">Школа</Link>
          <Link to="/catalog?search=sport">Спорт</Link>
          <Link to="/catalog?search=comedy">Комедия</Link>
        </section>

        <section className="section">
          <div className="section__header">
            <h2>Топ популярных</h2>
            <p>Самые заметные тайтлы каталога в удобном формате карточек.</p>
          </div>

          {popularQuery.isLoading && <Loader />}
          {popularQuery.isError && <ErrorMessage text="Не удалось загрузить популярные аниме." />}
          {popularQuery.data && <AnimeGrid items={popularQuery.data} />}
        </section>

        <section className="section">
          <div className="section__header">
            <h2>Новинки сезона</h2>
            <p>Свежие тайтлы, которые можно добавить в список просмотра.</p>
          </div>

          {seasonQuery.isLoading && <Loader />}
          {seasonQuery.isError && <ErrorMessage text="Не удалось загрузить актуальные аниме." />}
          {seasonQuery.data && <AnimeGrid items={seasonQuery.data} />}
        </section>
      </main>
  );
}
