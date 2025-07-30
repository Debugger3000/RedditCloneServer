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
