import "reflect-metadata"
import {User} from "../domain/entities/user";
import express, {Router} from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import {DataSource} from "typeorm";
import {Init1690441719032} from "../infrastructure/repositories/postgres/migrations/1690441719032-init";
import {
    UpdateUserTable1692081718020
} from "../infrastructure/repositories/postgres/migrations/1692081718020-update_user_table";
import {
    UpdateUserTable1692082904212
} from "../infrastructure/repositories/postgres/migrations/1692082904212-update_user_table";
import {Config} from "../conf";

export const testServer = express();
export const testRouter: Router = express.Router();

testServer.use(bodyParser.json());
testServer.use(bodyParser.urlencoded({ extended: true }));
testServer.use(cors());

export const testAppDataSource = new DataSource({
    type: "postgres",
    host: Config.ServerConfig.DB_HOST,
    port: Number(Config.ServerConfig.DB_PORT),
    username: Config.ServerConfig.DB_USER,
    password: Config.ServerConfig.DB_PASSWORD,
    database: Config.ServerConfig.DB_NAME,
    synchronize: false,
    logging: Config.ServerConfig.APP_ENV === "local",
    entities: [User],
    migrations: [
        Init1690441719032,
        UpdateUserTable1692081718020,
        UpdateUserTable1692082904212],
    subscribers: [],
});

//testAppDataSource.initialize();

