import {NextFunction, Request, Response} from "express";
import {CustomRequest} from "../../../domain/entities/auth";

export interface IUserController<T> {
    HealthCheck(request: Request, response: Response, next: NextFunction): Promise<any>;
    Login(request: Request, response: Response, next: NextFunction): Promise<any>;
    SignUp(request: Request, response: Response, next: NextFunction): Promise<any>;
    Refresh(request: CustomRequest, response: Response, next: NextFunction): Promise<any>;
    Me(request: CustomRequest, response: Response, next: NextFunction): Promise<any>;
    GoogleAuth(request: Request, response: Response, next: NextFunction): Promise<any>;
    GoogleCallBack(request: Request, response: Response, next: NextFunction): Promise<any>;
}
