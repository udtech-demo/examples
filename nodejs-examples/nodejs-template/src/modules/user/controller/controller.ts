import { Request, Response, NextFunction } from 'express';
import {LoginReq, SignUpReq, User} from "../../../domain/entities/user";
import {IUserUsecase} from "../interface/usecase";
import {IUserController} from "../interface/controller";
import {validateOrReject} from "class-validator";
import {CustomRequest} from "../../../domain/entities/auth";
import {HandleError} from "../../../domain/error";
import {verifyJWT} from "../../../infrastructure/middlewares/jwt";

export class UserController implements IUserController<User> {
    private readonly _uc: IUserUsecase<User>;

    constructor(uc: IUserUsecase<User>) {
        this._uc = uc;
    }

    public async HealthCheck(request: Request, response: Response, next: NextFunction): Promise<any> {
        return new Promise(() => response.status(200).send("Health check!"))
    }

    public async GoogleAuth(request: Request, response: Response, next: NextFunction): Promise<any> {
        try {
            const authURL = await this._uc.GetGoogleAuthURL();

            return response.redirect(authURL);

        }  catch (error) {
            return HandleError(error, response);
        }
    }

    public async GoogleCallBack(request: Request, response: Response, next: NextFunction): Promise<any> {
        try {
            const code = request.query.code as string;

            const rsp = await this._uc.GoogleAuth(code);

            return response.status(201).send(rsp);

        }  catch (error) {
            return HandleError(error, response);
        }
    }

    public async Login(request: Request, response: Response, next: NextFunction): Promise<any> {
        try {
            const req = Object.assign(new LoginReq(), request.body);

            await validateOrReject(req);

            let resp= await this._uc.Login(req);

            return response.status(201).send(resp);
        } catch (error) {
            return HandleError(error, response);
        }
    }

    public async SignUp(request: Request, response: Response, next: NextFunction): Promise<any> {
        try {
            const req = Object.assign(new SignUpReq(), request.body);

            await validateOrReject(req);

            let resp= await this._uc.SignUp(req);

            return response.status(201).send(resp);
        } catch (error) {
            return HandleError(error, response);
        }
    }

    public async Refresh(request: CustomRequest, response: Response, next: NextFunction): Promise<any> {
        try {
            //Receive the token
            const authStr = request.header('Authorization');
            if(!authStr){
                return response.status(401).send('Access Denied. Token Missing!');
            }

            const splitToken = authStr.split(" ");
            if(splitToken.length != 2 || splitToken[0] !== "Bearer"){
                return response.status(401).send('Access Denied. Token is invalid!');
            }

            const token = splitToken[1]

            const user =  verifyJWT(token)

            if (!user.isRefresh) {
                throw 'Token is invalid!'
            }

            let resp = await this._uc.Refresh(user);

            return response.status(201).send(resp);
        } catch (error) {
            return HandleError(error, response);
        }
    }

    public async Me(request: CustomRequest, response: Response, next: NextFunction): Promise<any> {
        try {
            const resp= await this._uc.Me(request.user);

            return response.status(201).send(resp);
        } catch (error) {
            return HandleError(error, response);
        }
    }
}