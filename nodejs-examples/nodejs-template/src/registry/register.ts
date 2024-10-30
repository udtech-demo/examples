import {AppDataSource} from "../infrastructure/repositories/postgres/typeorm_config";
import {UserUsecase} from "../modules/user/usecase/usecase";
import {UserRepo} from "../modules/user/repository/repository";
import {UserController} from "../modules/user/controller/controller";
import {UserGQLController} from "../modules/user/controller/graphql";

// User
export const userRepo = new UserRepo(AppDataSource);
export const userUc = new UserUsecase(userRepo);
export const userController = new UserController(userUc);

// GQL
export const userGQLController = new UserGQLController(userUc);

export const root = {
    Me: userGQLController.Me.bind(userGQLController),
};

