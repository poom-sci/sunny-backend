import redis from "../loaders/redis";

async function set(key: string, value: any, ttl: number = 60) {
  return redis.set(key, JSON.stringify(value), {
    EX: ttl
  });
}

async function get(key: string) {
  const value = await redis.get(key);

  if (!value) {
    return null;
  }
  return JSON.parse(value);
}

export { set, get };
