import {Logger} from "./logger-config";
import {Server} from "./server-config";
import {morganMiddleware} from "./morgan-logger-config";


export let Config = {
    ServerConfig: Server,
    Logger: Logger,
    MorganMiddleware: morganMiddleware,
}