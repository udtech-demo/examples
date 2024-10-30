import {User} from "../../../domain/entities/user";
import {IUserUsecase} from "../interface/usecase";
import {NextFunction, Request, Response} from "express";

export class UserGQLController {
    private readonly _uc: IUserUsecase<User>;

    constructor(uc: IUserUsecase<User>) {
        this._uc = uc;
    }

    public Me(args, context) {
        if (!context.req.user) {
            throw new Error('Not authorized');
        }

        return this._uc.Me(context.req.user);
    }
}