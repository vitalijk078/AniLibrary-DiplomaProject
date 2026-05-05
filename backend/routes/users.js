const express = require('express');
const { pool } = require('../db');
const authRequired = require('../middleware/auth');

const router = express.Router();

router.get('/favorites', authRequired, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении избранного' });
  }
});

router.get('/favorites/:animeId', authRequired, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND anime_id = $2',
      [req.user.id, req.params.animeId]
    );
    res.json({ isFavorite: result.rows.length > 0 });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при проверке избранного' });
  }
});

router.post('/favorites', authRequired, async (req, res) => {
  try {
    const { anime_id, anime_name, anime_image, anime_score, anime_kind } = req.body;

    if (!anime_id) {
      return res.status(400).json({ message: 'Не указан идентификатор аниме' });
    }

    const result = await pool.query(
      `INSERT INTO favorites (user_id, anime_id, anime_name, anime_image, anime_score, anime_kind)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, anime_id) DO NOTHING
       RETURNING *`,
      [req.user.id, anime_id, anime_name || '', anime_image || '', anime_score || '', anime_kind || '']
    );

    if (result.rows.length === 0) {
      return res.status(409).json({ message: 'Аниме уже в избранном' });
    }
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при добавлении в избранное' });
  }
});

router.delete('/favorites/:animeId', authRequired, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND anime_id = $2',
      [req.user.id, req.params.animeId]
    );
    res.json({ message: 'Удалено из избранного' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении из избранного' });
  }
});

router.get('/history', authRequired, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM watch_history WHERE user_id = $1 ORDER BY watched_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении истории просмотров' });
  }
});

module.exports = router;
