import winston, { format, createLogger } from "winston";
const { combine, timestamp } = format;

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const level = () => {
    return 'debug' //: 'warn'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors)

export const Logger = createLogger({
    level: level(),
    levels,
    format: combine(
        winston.format.prettyPrint(),
        winston.format.metadata(),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.colorize({ all: true }),
        winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
    ),
    transports: [
        new winston.transports.Console(),
        // new winston.transports.File({
        //     filename: 'logs/error.log',
        //     level: 'error',
        // }),
        // new winston.transports.File({ filename: 'logs/all.log' }),
    ],
});