import { createClient } from "redis";

// handle redis url logic for dev vs prod
// function getRedisUrl() {
//   if (process.env.ENVIRONMENT_TYPE == "development") {
//     console.log("dev redis url: ", "redis://" + process.env.REDIS_URL);
//     return "redis://" + process.env.REDIS_URL;
//   } else {
//     console.log(
//       "prod redis url: ",
//       `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}`
//     );
//     return `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}`;
//   }
// }

// // create redis client instance for server to utilize...
// export const client = await createClient({
//   url: getRedisUrl(),
// })
//   .on("error", (err) => console.log("Redis Client Error", err))
//   .on("ready", () => {
//     console.log("Local Redis client is ready !");
//   })
//   .connect();

// // console.log("redis client: ", await client.info());

// // get cache data function
// export async function getCacheData(redisKey) {
//   const cached = await client.get(redisKey);
//   console.log("getting cached data ");
//   return JSON.parse(cached);
// }

// // set cache data
// export async function setCacheData(redisKey, data) {
//   console.log("Setting cached data ");
//   // expiry - 1 hour
//   const expiry = 3600;
//   const cached = await client.set(redisKey, JSON.stringify(data), {
//     EX: expiry,
//   });
//   return cached;
// }
