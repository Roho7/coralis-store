import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils";
import fs from "fs";
import { join } from "path";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

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
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  projectConfig: {
    workerMode: process.env.MEDUSA_WORKER_MODE as
      | "shared"
      | "worker"
      | "server",
    databaseUrl: process.env.DATABASE_URL,
    databaseName: "defaultdb",
    databaseLogging: true,
    redisUrl: process.env.REDIS_URL,
    databaseDriverOptions:
      process.env.NODE_ENV !== "development"
        ? { connection: { ssl: { rejectUnauthorized: false } } }
        : {},
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",

    },
  },

  plugins: ["medusa-plugin-razorpay-rh"],
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
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      dependencies: [
        Modules.PAYMENT
      ],
      options: {
        providers: [
          {
            resolve: "medusa-plugin-razorpay-rh/providers/payment-razorpay/src",
            id: "razorpay",
            options: {
              key_id:
                process?.env?.RAZORPAY_TEST_KEY_ID ?? process?.env?.RAZORPAY_ID,
              key_secret:
                process?.env?.RAZORPAY_TEST_KEY_SECRET ??
                process?.env?.RAZORPAY_SECRET,
              razorpay_account:
                process?.env?.RAZORPAY_TEST_ACCOUNT ??
                process?.env?.RAZORPAY_ACCOUNT,
              automatic_expiry_period: 30 /* any value between 12minuts and 30 days expressed in minutes*/,
              manual_expiry_period: 20,
              refund_speed: "normal",
              webhook_secret:
                process?.env?.RAZORPAY_TEST_WEBHOOK_SECRET ??
                process?.env?.RAZORPAY_WEBHOOK_SECRET,
            },
          },
        ],
      },
    },
  ],
});
