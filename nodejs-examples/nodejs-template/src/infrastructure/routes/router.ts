import express, {Express, Router} from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import {root, userController} from "../../registry/register";
import {AppDataSource} from "../../infrastructure/repositories/postgres/typeorm_config";
import {WsHub} from './ws';
import {WebSocket} from 'ws';
import {auth, authGQL} from "../middlewares/jwt";
import {Config} from "../../conf";
import { graphqlHTTP } from 'express-graphql';
import schema from "../../modules/user/controller/schema";
import {CustomRequest} from "../../domain/entities/auth";

export class ExpressConfig {
    private app: Express;
    private port = Number(Config.ServerConfig.APP_PORT) || 3000;
    private host :string;

    constructor(express: Express) {
        this.app = express;
        this.host = "127.0.0.1";
    }

    public async init(): Promise<void> {
        try {
            // Set default middlewares
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: false }));
            this.app.use(cors({
                origin: ["*"],
                credentials: true,
            }));

            // Set custom logger middleware
            this.app.use(Config.MorganMiddleware);

            // Run transactions
            await AppDataSource.runMigrations({transaction: 'all'});

            // Register endpoints
            const r = this.registerEndpoints();

            // Set router
            this.app.use(r.router);

            // Start listen
            let srv = this.app.listen(this.port, () => {
                console.log(`Server started at http://${this.host}:${this.port}`);
            });

            // Register upgrade ws
            srv.on('upgrade', (request, socket, head) => {
                r.ws.handleUpgrade(request, socket, head, socket => {
                    r.ws.emit('connection', socket, request);
                });
            });

        } catch (error) {
            console.error(error);
        }
    }

    private registerEndpoints()  {
        const router: Router = express.Router();

        // GraphQL endpoint
        this.app.use(
            "/api/v1/graphql",
            [authGQL],
            graphqlHTTP((req:CustomRequest) => ({
                schema: schema, // The GraphQL schema
                rootValue: root, // Root resolver for GraphQL queries and mutations
                graphiql: true, // Enable GraphiQL UI for testing GraphQL queries
                context: { req: req }, // Pass the request object into the GraphQL context
            }))
        );

        router.get('/api/v1/health-check', userController.HealthCheck.bind(userController));

        router.get('/api/v1/auth/google', userController.GoogleAuth.bind(userController));
        router.get('/api/v1/auth/google/callback', userController.GoogleCallBack.bind(userController));

        router.post('/api/v1/sign-in', userController.Login.bind(userController));
        router.post('/api/v1/sign-up', userController.SignUp.bind(userController));
        router.post('/api/v1/refresh', userController.Refresh.bind(userController));

        router.get('/api/v1/users/me', [auth], userController.Me.bind(userController));

        const ws = new WebSocket.Server({ noServer: true });

        // WebSocket hub for handling connections
        const wsHub = new WsHub();

        // WebSocket connection event
        ws.on('connection', wsHub.Ws.bind(wsHub));

        return {router, ws}
    }
}
