import "reflect-metadata"
import {User} from "../../../domain/entities/user";
import { DataSource } from "typeorm"
import {Init1690441719032} from "./migrations/1690441719032-init";
import {UpdateUserTable1692081718020} from "./migrations/1692081718020-update_user_table";
import {UpdateUserTable1692082904212} from "./migrations/1692082904212-update_user_table";
import {Config} from "../../../conf";

export const AppDataSource = new DataSource({
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
})