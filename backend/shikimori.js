const axios = require('axios');
const cache = require('./cache');

const BASE_URL = 'https://shikimori.io/api';
const HEADERS = { 'User-Agent': 'AnimeLibrary' };

async function getWithCache(path, params, ttlSeconds) {
  const key = path + JSON.stringify(params || {});

  const cached = cache.get(key);
  if (cached) {
    return { data: cached, fromCache: true };
  }

  const response = await axios.get(`${BASE_URL}${path}`, {
    params: params,
    headers: HEADERS
  });

  cache.set(key, response.data, ttlSeconds);
  return { data: response.data, fromCache: false };
}

module.exports = { getWithCache };
