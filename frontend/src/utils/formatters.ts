import type { AnimeStatus } from "../types/anime";

export function formatStatus(status: AnimeStatus | string | null) {
  const statuses: Record<string, string> = {
    anons: "Анонсировано",
    ongoing: "Выходит",
    released: "Вышло",
  };

  if (!status) {
    return "не указан";
  }

  return statuses[status] || status;
}

export function formatKind(kind: string | null) {
  const kinds: Record<string, string> = {
    tv: "TV-сериал",
    movie: "Фильм",
    ova: "OVA",
    ona: "ONA",
    special: "Спецвыпуск",
    music: "Музыкальное видео",
    tv_special: "TV-спецвыпуск",
    pv: "Проморолик",
    cm: "Рекламный ролик",
  };

  if (!kind) {
    return "не указан";
  }

  return kinds[kind] || kind;
}

export function formatDate(date: string | null) {
  if (!date) {
    return "не указана";
  }

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}.${month}.${year}`;
}

export function formatScore(score: number | null) {
  if (!score || score <= 0) {
    return "без рейтинга";
  }

  return `${score.toFixed(2)}/10`;
}

export function cleanDescription(description: string | null | undefined) {
  if (!description) {
    return "Описание для данного тайтла пока отсутствует в источнике данных.";
  }

  return description
    .replace(/\[.*?\]/g, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&quot;/g, "\"")
    .replace(/&amp;/g, "&")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
