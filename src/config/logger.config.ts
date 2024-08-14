import { WinstonModuleOptions } from 'nest-winston';
import { transports, format } from 'winston';

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: 'logs/combined.log',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
};
