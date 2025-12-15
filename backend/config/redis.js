

import { createClient } from "redis";

let redisClient;

const connectRedis = async () => {
  if (!redisClient) {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL is not set in .env");
    }

    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on("error", (err) => console.error("Redis Error:", err));
    redisClient.on("connect", () => console.log("Redis Connected"));

    await redisClient.connect();
  }

  return redisClient;
};

export default connectRedis;




// config/redis.js
// import { createClient } from "redis";

// let redisClient;

// const connectRedis = async () => {
//   if (!redisClient) {
//     // Redis Cloud URL format: redis://:PASSWORD@HOST:PORT
//     const redisUrl = process.env.REDIS_URL || `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

//     redisClient = createClient({
//       url: redisUrl,
//       username: process.env.REDIS_USERNAME || undefined, // optional
//     });

//     redisClient.on("error", (err) => console.error("❌ Redis Error:", err));
//     redisClient.on("connect", () => console.log("Redis Connected"));

//     await redisClient.connect();
//   }

//   return redisClient;
// };

// export default connectRedis;
