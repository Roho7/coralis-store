import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import fs from 'fs'
import { join } from 'path'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// const DB_USERNAME = process.env.DB_USERNAME;
// const DB_PASSWORD = process.env.DB_PASSWORD;
// const DB_HOST = process.env.DB_HOST;
// const DB_PORT = process.env.DB_PORT;
// const DB_DATABASE = process.env.DB_DATABASE;

// const DATABASE_URL =
//   `postgres://${DB_USERNAME}:${DB_PASSWORD}` +
//   `@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?sslmode=require&ssl=true&rejectUnauthorized=false`;

// const cert = fs.readFileSync(join(__dirname, 'cert.crt')).toString()

// console.log(cert)

module.exports = defineConfig({
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
  },
  projectConfig: {
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    databaseUrl: process.env.DATABASE_URL,
    databaseName: 'defaultdb',
    redisUrl: process.env.REDIS_URL,

    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          url: process.env.REDIS_URL,
        },
      },
    },
  ],

})