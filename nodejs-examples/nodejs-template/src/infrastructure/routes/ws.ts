import {verifyJWT} from "../middlewares/jwt";
import url from "url";

export interface IWsHub<T> {
    Ws(ws, request);
    Broadcast(msg);
}

export class WsHub {
    private readonly _clients:Map<any,any>;

    constructor() {
        this._clients = new Map();
    }

    public async Ws(ws, request) {
        const queryObject = url.parse(request.url, true).query;
        if (!queryObject.token) {
            console.log('Invalid token');
            ws.close();
            return
        }

        try {
            let token:string = ''

            // Verify token
            if (typeof queryObject.token === 'string') {
                token = queryObject.token.replace('Bearer ', '');
            } else {
                throw 'Invalid token'
            }

            const decodedToken = verifyJWT(token);
            if (decodedToken.isRefresh) {
                throw 'Invalid token'
            }

            // Set client to clients map
            this._clients.set(decodedToken.id, ws);

            // On close delete from _clients map
            ws.on("close", () => {
                this._clients.delete(ws);
            });

            // // On message
            // ws.on('message', (message: string) => {
            //     ws.send(`Your message: ${message}`);
            //
            //     setTimeout(() => {
            //         ws.send('Hello from server!');
            //     }, 5000);
            // });

        } catch (error) {
            console.log('Err: ', error.message);
            ws.close();
            return
        }
    }

    public async Broadcast(msg) {
        const outbound = JSON.stringify(msg);

        [...this._clients.values()].forEach((client) => {
            client.send(outbound);
        });
    }
}