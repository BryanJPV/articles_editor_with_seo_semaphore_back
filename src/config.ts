import { config } from "dotenv";
config();

// DATABASE VARS
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_PORT: number = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
export const DB_DATABASE = process.env.DB_DATABASE;