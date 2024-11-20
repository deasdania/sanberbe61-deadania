/*
# src/utils/database.ts
*/
import mongoose from "mongoose";
import { DATABASE_URL, DATABASE_NAME } from "./env";

const connect = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: DATABASE_NAME,
    });
    return "Database connected";
  } catch (error) {
    return error;
  }
};

export default connect;
