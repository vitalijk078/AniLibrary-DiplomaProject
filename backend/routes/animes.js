const express = require('express');
const { getWithCache } = require('../shikimori');

const router = express.Router();

function sendCached(res, result) {
  res.set('X-Cache', result.fromCache ? 'HIT' : 'MISS');
  res.json(result.data);
}

router.get('/animes', async (req, res) => {
  try {
    const { page = 1, limit = 20, order = 'ranked', search = '', kind, status, season, genre } = req.query;
    const params = { page, limit, order };

    if (search) params.search = search;
    if (kind) params.kind = kind;
    if (status) params.status = status;
    if (season) params.season = season;
    if (genre) params.genre = genre;

    const result = await getWithCache('/animes', params, 300);
    sendCached(res, result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка аниме' });
  }
});

router.get('/animes/:id', async (req, res) => {
  try {
    const result = await getWithCache(`/animes/${req.params.id}`, null, 1800);
    sendCached(res, result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении информации об аниме' });
  }
});

router.get('/animes/:id/screenshots', async (req, res) => {
  try {
    const result = await getWithCache(`/animes/${req.params.id}/screenshots`, null, 1800);
    sendCached(res, result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении скриншотов' });
  }
});

router.get('/animes/:id/roles', async (req, res) => {
  try {
    const result = await getWithCache(`/animes/${req.params.id}/roles`, null, 1800);
    sendCached(res, result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении персонажей' });
  }
});

router.get('/animes/:id/similar', async (req, res) => {
  try {
    const result = await getWithCache(`/animes/${req.params.id}/similar`, null, 1800);
    sendCached(res, result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении похожих аниме' });
  }
});

router.get('/animes/:id/related', async (req, res) => {
  try {
    const result = await getWithCache(`/animes/${req.params.id}/related`, null, 1800);
    sendCached(res, result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении связанных аниме' });
  }
});

router.get('/animes/:id/franchise', async (req, res) => {
  try {
    const result = await getWithCache(`/animes/${req.params.id}/franchise`, null, 1800);
    sendCached(res, result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении франшизы' });
  }
});

router.get('/characters/:id', async (req, res) => {
  try {
    const result = await getWithCache(`/characters/${req.params.id}`, null, 1800);
    sendCached(res, result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении информации о персонаже' });
  }
});

router.get('/top-weekly', async (req, res) => {
  try {
    const params = { limit: 1, order: 'popularity', status: 'ongoing', season: 'spring_2026' };
    const result = await getWithCache('/animes', params, 600);
    res.set('X-Cache', result.fromCache ? 'HIT' : 'MISS');
    res.json(result.data[0] || null);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении топ тайтла недели' });
  }
});

router.get('/genres', async (req, res) => {
  try {
    const result = await getWithCache('/genres', null, 86400);
    sendCached(res, result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении жанров' });
  }
});

module.exports = router;
