import {Config} from "../conf";

export class CustomError extends Error {
    public statusCode: number;

    constructor(message:string, statusCode:number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const HandleError = (err, res) => {
    Config.Logger.error(err.message);
    console.log(err);

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message
        });
    } else {
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
};