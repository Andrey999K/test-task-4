import { Sequelize } from "sequelize";
import { env } from "./env";
import { logger } from "@/utils/log";

export const sequelize = new Sequelize({
  host: env.DB.host,
  port: env.DB.port,
  database: env.DB.database,
  username: env.DB.user,
  password: env.DB.password,
  dialect: "postgres",
  logging: env.NODE_ENV === "development" ? (msg) => logger.debug(msg) : false,
});

export async function testConnection(): Promise<boolean> {
  try {
    await sequelize.authenticate();
    logger.info("Database connection established successfully.");
    return true;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    return false;
  }
}
