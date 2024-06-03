import chalk from "chalk";
import mongoose from "mongoose";
import { systemLogs } from "../utils/Logger.js";

const connectionToDb = async () => {
  try {
    const connectionParams = {
      dbName: process.env.DB_NAME,
    };
    const conn = await mongoose.connect(
      process.env.MONGO_URI,
      connectionParams
    );
    console.log(chalk.blue.bold(`Mongo DB connected: ${conn.connection.host}`));
    systemLogs.info(`Mongo DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(chalk.red.bold(`Error: ${error.message}`));
    process.exit(1);
  }
};

export default connectionToDb;
