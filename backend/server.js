import "dotenv/config";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import connectionToDb from "./config/connectsDb.js";
import { morganMiddleware, systemLogs } from "./utils/Logger.js";
import mongoSanitize from "express-mongo-sanitize";
// IMPORTS
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
// ROUTES
import authRoutes from "./routes/authRoutes.js";

await connectionToDb();
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(morganMiddleware);

app.get("/api/v1/tests", (req, res) => {
  res.status(200).json({
    message: "Welcome to invoice app",
  });
});

// MAIN ROUTES
app.use("/api/v1/auth", authRoutes);

// ERROR Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `${chalk.green.bold("✅")} Server runing in ${chalk.yellow.bold(
      process.env.NODE_ENV
    )} mode on port ${chalk.blue.bold(PORT)}`
  );
  systemLogs.info(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});

// Log levels

// 0 - error;
// 1 - warn;
// 2 - info;
// 3 - http;
// 4 - verbose;
// 5 - debug;
// 6 - silly;

// TIME Lesson {26} time {13:34}
// https://github.com/API-Imperfect/mern-invoice
