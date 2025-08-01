import { createClient } from "redis";
import dotenv from "dotenv";

// create redis client instance for server to utilize...
export const client = await createClient({
  url: process.env.REDIS_URL,
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .on("ready", () => {
    console.log("Local Redis client is ready !");
  })
  .connect();

// get cache data function
export async function getCacheData(redisKey) {
  const cached = await client.get(redisKey);
  // console.log("cached data: ", cached);
  return JSON.parse(cached);
}

// set cache data
export async function setCacheData(redisKey, data) {
  // expiry - 1 hour
  const expiry = 3600;
  const cached = await client.set(redisKey, JSON.stringify(data), {
    EX: expiry,
  });
  return cached;
}
