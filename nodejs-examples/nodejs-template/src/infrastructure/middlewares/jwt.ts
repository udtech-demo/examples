import * as fs from "fs";
import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import {CustomRequest} from "../../domain/entities/auth";
import {Config} from "../../conf";

export const verifyJWT = function (token) {
    const cert = Config.ServerConfig.PUBLIC_KEY;
    const decoded = jwt.verify(token, cert) as JwtPayload;

    return decoded
}

export const authGQL = function (request: Request, response: Response, next: NextFunction) {
    try {
        //Receive the token
        const authStr = request.header('Authorization');
        if(!authStr){
            throw new Error('Access Denied. Token Missing!');
        }

        const splitToken = authStr.split(" ");
        if(splitToken.length != 2 || splitToken[0] !== "Bearer"){
            throw new Error('Access Denied. Token is invalid!');
        }

        const token = splitToken[1];

        //If token found, verify it
        try{
            const decoded  = verifyJWT(token);

            if (decoded.isRefresh) {
                throw new Error('Access Denied. Token is invalid!');
            }

            (request as CustomRequest).user = decoded;

        } catch(err) {
            console.log(err);
            throw new Error("Access Denied!");
        }

    } catch (err) {
        next();
    }

    next();
}

//Authenticate the JSON Web Token
export const auth = function (request: Request, response: Response, next: NextFunction){
    //Receive the token
    const authStr = request.header('Authorization');
    if(!authStr){
        return response.status(401).send('Access Denied. Token Missing!');
    }

    const splitToken = authStr.split(" ");
    if(splitToken.length != 2 || splitToken[0] !== "Bearer"){
        return response.status(401).send('Access Denied. Token is invalid!');
    }

    const token = splitToken[1];

    //If token found, verify it
    try{
        const decoded  = verifyJWT(token);

        if (decoded.isRefresh) {
            return response.status(401).send('Access Denied. Token is invalid!');
        }

        (request as CustomRequest).user = decoded;

        next();

    } catch(err) {
        console.log(err);
        return response.status(403).send("Access Denied!");
    }
}

//Check if user has Admin Credentials
export const adminCheck = function (req, res, next) {
    if (!(req.user.role == "admin"))
        return res.status(403).send('Access Denied!');
    next();
}