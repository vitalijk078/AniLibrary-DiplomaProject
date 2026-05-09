const swaggerServerUrl = process.env.SWAGGER_SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'AniLibrary API',
    version: '1.0.0',
    description: 'REST API сайта для просмотра аниме. Данные о тайтлах берутся из Shikimori API и кэшируются на сервере. Авторизация выполняется через JWT токен.'
  },
  servers: [
    { url: swaggerServerUrl, description: 'Адрес API' }
  ],
  tags: [
    { name: 'Авторизация', description: 'Регистрация и вход пользователей' },
    { name: 'Пользователь', description: 'Избранное и история просмотров (требуется токен)' },
    { name: 'Аниме', description: 'Данные из Shikimori API с серверным кэшированием' },
    { name: 'Просмотр', description: 'Просмотр видео с сервера (только для авторизованных)' },
    { name: 'Сервис', description: 'Служебные эндпоинты' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Введите токен, полученный при входе или регистрации'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          username: { type: 'string', example: 'HexletUser' },
          email: { type: 'string', example: 'user@mail.ru' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
          user: { $ref: '#/components/schemas/User' }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', example: 'HexletUser' },
          email: { type: 'string', example: 'user@mail.ru' },
          password: { type: 'string', example: 'qwerty123' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['login', 'password'],
        properties: {
          login: { type: 'string', description: 'Email или имя пользователя', example: 'user@mail.ru' },
          password: { type: 'string', example: 'qwerty123' }
        }
      },
      Favorite: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 1 },
          anime_id: { type: 'integer', example: 21 },
          anime_name: { type: 'string', example: 'Ван-Пис' },
          anime_image: { type: 'string', example: '/system/animes/preview/21.jpg' },
          anime_score: { type: 'string', example: '8.69' },
          anime_kind: { type: 'string', example: 'tv' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      FavoriteRequest: {
        type: 'object',
        required: ['anime_id'],
        properties: {
          anime_id: { type: 'integer', example: 21 },
          anime_name: { type: 'string', example: 'Ван-Пис' },
          anime_image: { type: 'string', example: '/system/animes/preview/21.jpg' },
          anime_score: { type: 'string', example: '8.69' },
          anime_kind: { type: 'string', example: 'tv' }
        }
      },
      HistoryItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 1 },
          anime_id: { type: 'integer', example: 21 },
          anime_name: { type: 'string', example: 'Ван-Пис' },
          anime_image: { type: 'string', example: '/system/animes/preview/21.jpg' },
          watched_at: { type: 'string', format: 'date-time' }
        }
      },
      VideoInfo: {
        type: 'object',
        properties: {
          format: { type: 'string', example: 'mp4' },
          size: { type: 'integer', description: 'Размер файла в байтах', example: 524288000 }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Описание ошибки' }
        }
      }
    },
    parameters: {
      AnimeId: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer' },
        description: 'ID аниме в Shikimori',
        example: 21
      }
    },
    headers: {
      XCache: {
        description: 'HIT - ответ взят из кэша сервера, MISS - выполнен запрос к внешнему API',
        schema: { type: 'string', enum: ['HIT', 'MISS'] }
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Авторизация'],
        summary: 'Регистрация нового пользователя',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } }
        },
        responses: {
          201: {
            description: 'Пользователь создан',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } }
          },
          400: { description: 'Некорректные данные', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          409: { description: 'Пользователь уже существует', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Авторизация'],
        summary: 'Вход по email или имени пользователя',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } }
        },
        responses: {
          200: {
            description: 'Успешный вход',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } }
          },
          401: { description: 'Неверный логин или пароль', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/api/auth/me': {
      get: {
        tags: ['Авторизация'],
        summary: 'Данные текущего пользователя',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Информация о пользователе',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } }
          },
          401: { description: 'Требуется авторизация', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/api/users/favorites': {
      get: {
        tags: ['Пользователь'],
        summary: 'Список избранного',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Массив избранных аниме',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Favorite' } } } }
          },
          401: { description: 'Требуется авторизация' }
        }
      },
      post: {
        tags: ['Пользователь'],
        summary: 'Добавить аниме в избранное',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/FavoriteRequest' } } }
        },
        responses: {
          201: { description: 'Добавлено', content: { 'application/json': { schema: { $ref: '#/components/schemas/Favorite' } } } },
          401: { description: 'Требуется авторизация' },
          409: { description: 'Уже в избранном' }
        }
      }
    },
    '/api/users/favorites/{animeId}': {
      get: {
        tags: ['Пользователь'],
        summary: 'Проверить, есть ли аниме в избранном',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'animeId', in: 'path', required: true, schema: { type: 'integer' }, example: 21 }
        ],
        responses: {
          200: {
            description: 'Результат проверки',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { isFavorite: { type: 'boolean' } } }
              }
            }
          },
          401: { description: 'Требуется авторизация' }
        }
      },
      delete: {
        tags: ['Пользователь'],
        summary: 'Удалить аниме из избранного',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'animeId', in: 'path', required: true, schema: { type: 'integer' }, example: 21 }
        ],
        responses: {
          200: { description: 'Удалено' },
          401: { description: 'Требуется авторизация' }
        }
      }
    },
    '/api/users/history': {
      get: {
        tags: ['Пользователь'],
        summary: 'История просмотров',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Массив просмотренных аниме',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/HistoryItem' } } } }
          },
          401: { description: 'Требуется авторизация' }
        }
      }
    },
    '/api/animes': {
      get: {
        tags: ['Аниме'],
        summary: 'Список аниме с фильтрами и поиском',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'order', in: 'query', schema: { type: 'string', default: 'ranked', enum: ['ranked', 'popularity', 'name', 'aired_on'] } },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Поиск по названию' },
          { name: 'kind', in: 'query', schema: { type: 'string', enum: ['tv', 'movie', 'ova', 'ona', 'special'] } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['anons', 'ongoing', 'released'] } },
          { name: 'season', in: 'query', schema: { type: 'string' }, example: 'spring_2026' },
          { name: 'genre', in: 'query', schema: { type: 'string' }, description: 'ID жанра' }
        ],
        responses: {
          200: {
            description: 'Массив аниме',
            headers: { 'X-Cache': { $ref: '#/components/headers/XCache' } }
          }
        }
      }
    },
    '/api/animes/{id}': {
      get: {
        tags: ['Аниме'],
        summary: 'Подробная информация об аниме',
        parameters: [{ $ref: '#/components/parameters/AnimeId' }],
        responses: {
          200: {
            description: 'Объект аниме',
            headers: { 'X-Cache': { $ref: '#/components/headers/XCache' } }
          }
        }
      }
    },
    '/api/animes/{id}/screenshots': {
      get: {
        tags: ['Аниме'],
        summary: 'Скриншоты аниме',
        parameters: [{ $ref: '#/components/parameters/AnimeId' }],
        responses: {
          200: { description: 'Массив скриншотов', headers: { 'X-Cache': { $ref: '#/components/headers/XCache' } } }
        }
      }
    },
    '/api/animes/{id}/roles': {
      get: {
        tags: ['Аниме'],
        summary: 'Персонажи и роли',
        parameters: [{ $ref: '#/components/parameters/AnimeId' }],
        responses: {
          200: { description: 'Массив ролей', headers: { 'X-Cache': { $ref: '#/components/headers/XCache' } } }
        }
      }
    },
    '/api/animes/{id}/similar': {
      get: {
        tags: ['Аниме'],
        summary: 'Похожие аниме',
        parameters: [{ $ref: '#/components/parameters/AnimeId' }],
        responses: {
          200: { description: 'Массив аниме', headers: { 'X-Cache': { $ref: '#/components/headers/XCache' } } }
        }
      }
    },
    '/api/animes/{id}/related': {
      get: {
        tags: ['Аниме'],
        summary: 'Связанные аниме и манга',
        parameters: [{ $ref: '#/components/parameters/AnimeId' }],
        responses: {
          200: { description: 'Массив связанных тайтлов', headers: { 'X-Cache': { $ref: '#/components/headers/XCache' } } }
        }
      }
    },
    '/api/animes/{id}/franchise': {
      get: {
        tags: ['Аниме'],
        summary: 'Франшиза аниме',
        parameters: [{ $ref: '#/components/parameters/AnimeId' }],
        responses: {
          200: { description: 'Граф франшизы', headers: { 'X-Cache': { $ref: '#/components/headers/XCache' } } }
        }
      }
    },
    '/api/characters/{id}': {
      get: {
        tags: ['Аниме'],
        summary: 'Информация о персонаже',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID персонажа' }
        ],
        responses: {
          200: { description: 'Объект персонажа', headers: { 'X-Cache': { $ref: '#/components/headers/XCache' } } }
        }
      }
    },
    '/api/top-weekly': {
      get: {
        tags: ['Аниме'],
        summary: 'Топ тайтл недели',
        responses: {
          200: { description: 'Самый популярный онгоинг сезона', headers: { 'X-Cache': { $ref: '#/components/headers/XCache' } } }
        }
      }
    },
    '/api/genres': {
      get: {
        tags: ['Аниме'],
        summary: 'Список жанров',
        responses: {
          200: { description: 'Массив жанров', headers: { 'X-Cache': { $ref: '#/components/headers/XCache' } } }
        }
      }
    },
    '/api/videos': {
      get: {
        tags: ['Просмотр'],
        summary: 'Список аниме, доступных для просмотра',
        description: 'Возвращает тайтлы, для которых на сервере есть видеофайлы в папке backend/videos. Информация о тайтлах берётся из Shikimori одним запросом и кэшируется.',
        responses: {
          200: {
            description: 'Массив аниме',
            headers: { 'X-Cache': { $ref: '#/components/headers/XCache' } }
          }
        }
      }
    },
    '/api/videos/{id}/available': {
      get: {
        tags: ['Просмотр'],
        summary: 'Проверить, есть ли видео для аниме',
        parameters: [{ $ref: '#/components/parameters/AnimeId' }],
        responses: {
          200: {
            description: 'Результат проверки',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { available: { type: 'boolean' } } }
              }
            }
          }
        }
      }
    },
    '/api/watch/{id}': {
      get: {
        tags: ['Просмотр'],
        summary: 'Информация о видео перед просмотром',
        description: 'Доступно только авторизованным пользователям. Просмотр автоматически добавляется в историю.',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/AnimeId' }],
        responses: {
          200: {
            description: 'Формат и размер видеофайла',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VideoInfo' } } }
          },
          401: { description: 'Требуется авторизация', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Видео не найдено', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/api/stream/{id}': {
      get: {
        tags: ['Просмотр'],
        summary: 'Поток видеофайла',
        description: 'Отдаёт сам видеофайл с поддержкой перемотки (HTTP Range). Токен можно передать в заголовке Authorization или параметром ?token= — это нужно для HTML-тега video, который не умеет отправлять заголовки.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/AnimeId' },
          { name: 'token', in: 'query', required: false, schema: { type: 'string' }, description: 'JWT-токен (альтернатива заголовку Authorization)' }
        ],
        responses: {
          200: { description: 'Видеофайл целиком', content: { 'video/mp4': { schema: { type: 'string', format: 'binary' } } } },
          206: { description: 'Часть файла по заголовку Range' },
          401: { description: 'Требуется авторизация' },
          404: { description: 'Видео не найдено' }
        }
      }
    },
    '/api/cache/stats': {
      get: {
        tags: ['Сервис'],
        summary: 'Статистика кэша',
        responses: {
          200: {
            description: 'Количество записей в кэше',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { entries: { type: 'integer', example: 12 } } }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = swaggerSpec;
