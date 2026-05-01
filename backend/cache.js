const cache = new Map();
const DEFAULT_TTL = Number(process.env.CACHE_TTL) || 600;

function get(key) {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function set(key, data, ttlSeconds) {
  const ttl = ttlSeconds || DEFAULT_TTL;
  cache.set(key, {
    data: data,
    expiresAt: Date.now() + ttl * 1000
  });
}

function size() {
  return cache.size;
}

function clear() {
  cache.clear();
}

module.exports = { get, set, size, clear };
