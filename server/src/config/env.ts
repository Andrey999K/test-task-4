import "dotenv/config";

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "shop_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
  },
};
