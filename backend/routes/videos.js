const express = require('express');
const fs = require('fs');
const path = require('path');
const { pool } = require('../db');
const { getWithCache } = require('../shikimori');
const authRequired = require('../middleware/auth');

const router = express.Router();

const VIDEOS_DIR = path.join(__dirname, '..', 'videos');
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.m4v'];

if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

function findVideoFile(animeId) {
  if (!/^\d+$/.test(animeId)) {
    return null;
  }
  for (const ext of VIDEO_EXTENSIONS) {
    const filePath = path.join(VIDEOS_DIR, animeId + ext);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

function getAvailableIds() {
  const files = fs.readdirSync(VIDEOS_DIR);
  const ids = [];
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const name = path.basename(file, ext);
    if (VIDEO_EXTENSIONS.includes(ext) && /^\d+$/.test(name)) {
      ids.push(name);
    }
  }
  return ids;
}

router.get('/videos', async (req, res) => {
  try {
    const ids = getAvailableIds();
    if (ids.length === 0) {
      return res.json([]);
    }
    const params = {
      ids: ids.join(','),
      limit: Math.min(ids.length, 50),
      order: 'ranked'
    };
    const result = await getWithCache('/animes', params, 300);
    res.set('X-Cache', result.fromCache ? 'HIT' : 'MISS');
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка видео' });
  }
});

router.get('/videos/:id/available', (req, res) => {
  res.json({ available: findVideoFile(req.params.id) !== null });
});

router.get('/watch/:id', authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = findVideoFile(id);

    if (!filePath) {
      return res.status(404).json({ message: 'Видео для этого аниме не найдено' });
    }

    const stats = fs.statSync(filePath);

    try {
      const anime = await getWithCache(`/animes/${id}`, null, 1800);
      const animeName = anime.data.russian || anime.data.name || '';
      const animeImage = anime.data.image ? anime.data.image.preview : '';
      await pool.query(
        `INSERT INTO watch_history (user_id, anime_id, anime_name, anime_image)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, anime_id)
         DO UPDATE SET watched_at = NOW(), anime_name = $3, anime_image = $4`,
        [req.user.id, id, animeName, animeImage]
      );
    } catch (error) {
      console.error('Не удалось записать историю просмотров:', error.message);
    }

    res.json({
      format: path.extname(filePath).slice(1),
      size: stats.size
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении информации о видео' });
  }
});

router.get('/stream/:id', authRequired, (req, res) => {
  const filePath = findVideoFile(req.params.id);

  if (!filePath) {
    return res.status(404).json({ message: 'Видео не найдено' });
  }

  res.sendFile(filePath);
});

module.exports = router;
