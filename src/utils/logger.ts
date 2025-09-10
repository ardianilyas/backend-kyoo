import fs from "fs";
import path from "path";
import pino, { multistream } from "pino";
import pretty from "pino-pretty";

// Pastikan folder logs ada
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Stream untuk file log
const logFile = fs.createWriteStream(path.join(logDir, "app.log"), { flags: "a" });

// Stream untuk console (kalau development, pakai pretty)
const consoleStream =
  process.env.NODE_ENV === "development"
    ? pretty({
        colorize: true,
        translateTime: "yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname",
      })
    : process.stdout;

// Gabungkan stream
const streams = [
  { stream: consoleStream }, // tampil di console
  { stream: logFile },       // simpan ke file
];

// Buat logger
const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => ({ level: label.toUpperCase() }),
    },
  },
  multistream(streams)
);

export default logger;