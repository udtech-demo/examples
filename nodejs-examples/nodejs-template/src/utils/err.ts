export class CustomError extends Error {
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
    statusCode: number;
}

export class BadRequestError extends CustomError {
    constructor(message: string) {
        super(message, 400);
    }
    name: string = "BadRequestError";
}

export class NotFoundError extends CustomError {
    constructor(message: string) {
        super(message, 404);
    }
    name: string = "NotFoundError";
}