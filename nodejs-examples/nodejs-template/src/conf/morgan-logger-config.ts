import morgan, { StreamOptions } from "morgan";
import {Logger} from "./logger-config";

const stream: StreamOptions = {
    // Use the http severity
    write: (message) => Logger.http(message),
};

const skip = () => {
    return false;
};

// Build the morgan middleware
export const morganMiddleware = morgan(
    ":method :url :status :res[content-length] - :response-time ms",
    { stream, skip}
);