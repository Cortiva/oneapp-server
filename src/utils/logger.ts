import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import config from "./config";

// Initialize Logtail
const logtail = new Logtail(config.LOGTAIL_TOKEN!, {
  endpoint: `https://${config.LOGTAIL_INGESTING_HOST!}`,
});

// Winston Logger
const logger = winston.createLogger({
  level: "info", // Change to 'debug' in development
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "Orbitcare API" },
  transports: [
    // Console transport (for local dev)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // Logtail transport (cloud)
    new LogtailTransport(logtail),
  ],
});

export default logger;
