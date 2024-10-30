import express from 'express';
import {AppDataSource} from "./infrastructure/repositories/postgres/typeorm_config";
import {ExpressConfig} from "./infrastructure/routes/router";
import * as Sentry from '@sentry/node';
import {Config} from "./conf";

const main = async () => {
    const typeORM = await AppDataSource.initialize();
    const app = express();

    Sentry.init({
        dsn: Config.ServerConfig.SENTRY_DSN,
        environment: Config.ServerConfig.APP_ENV,
        tracesSampleRate: 1.0,
    });

    const Express = new ExpressConfig(app);
    if (typeORM.isInitialized) {
        console.log("Connected to database");
        await Express.init();
    }
};

main();