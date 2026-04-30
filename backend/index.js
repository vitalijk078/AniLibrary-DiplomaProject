require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { initDb } = require('./db');
const cache = require('./cache');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const animeRoutes = require('./routes/animes');
const videoRoutes = require('./routes/videos');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', videoRoutes);
app.use('/api', animeRoutes);

app.get('/api/cache/stats', (req, res) => {
  res.json({ entries: cache.size() });
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
      console.log(`Swagger доступен по адресу http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Не удалось подключиться к базе данных:', error.message);
    process.exit(1);
  });
