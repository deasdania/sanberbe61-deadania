import dotenv from "dotenv";

dotenv.config();

export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET: string =
  process.env.CLOUDINARY_API_SECRET || "";
export const CLOUDINARY_CLOUD_NAME: string =
  process.env.CLOUDINARY_CLOUD_NAME || "";
export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const DATABASE_NAME: string = process.env.DATABASE_NAME || "";
export const SECRET: string = process.env.SECRET || "secret";
export const MAIL_USER: string = process.env.MAIL_USER || "";
export const MAIL_PASS: string = process.env.MAIL_PASS || "";
export const DEBUG: boolean = process.env.DEBUG === 'true' || process.env.DEBUG === '1';
export const LOGGER: boolean = process.env.LOGGER === 'true' || process.env.LOGGER === '1';
export const SERVER_URL: string = process.env.SERVER_URL || 'http://localhost:3000';
export const ENV: string = process.env.ENV || 'development';
