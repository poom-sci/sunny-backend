import { createLogger, transports, format } from "winston";
import config from "src/loaders/config";

const logger = createLogger({
  transports: [new transports.Console({})],
  level: config.logger.level,
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.colorize(),
    format.errors({ stack: config.logger.stack }),
    format.printf(({ timestamp, level, message, service }) => {
      return `[${timestamp}] ${service} ${level}: ${JSON.stringify(message)}`;
    })
  ),
  defaultMeta: {
    service: config.logger.service
  }
});

export default logger;
