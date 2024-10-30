import {testAppDataSource, testRouter, testServer} from "./index.test";
import {assert} from "chai";
import {describe, it} from "node:test";
import {UserRepo} from "../modules/user/repository/repository";
import {UserUsecase} from "../modules/user/usecase/usecase";
import {UserController} from "../modules/user/controller/controller";
import request from "supertest";

import { getConnectionManager } from 'typeorm';
import {createConnection} from "node:net";

const connectionManager = getConnectionManager();

describe('User tests', async function() {
    const userRepo = new UserRepo(testAppDataSource);
    const userUc = new UserUsecase(userRepo);
    const userController = new UserController(userUc);

    testRouter.post('/sign-up', userController.SignUp.bind(userController));
    testRouter.post('/sign-in', userController.Login.bind(userController));
    testRouter.get('/health-check', userController.HealthCheck.bind(userController));
    testServer.use(testRouter);

    await testAppDataSource.initialize()

    it('sign up', function() {
        return request(testServer)
            .post('/sign-up')
            .send({
                email: "test1@email.com",
                password: "123456",
                firstname: "li",
                lastname: "il"
            })
            .expect(201)
            .then((response) => {
                console.log(response.body)
                //assert.equal(response.text, "Health check!");
            });
    });

    it('login', function() {
        return request(testServer)
            .post('/sign-in')
            .send({
                email: "test1@email.com",
                password: "123456"
            })
            .expect(201)
            .then((response) => {
                console.log(response.body)
                //assert.equal(response.text, "Health check!");
            });
    });

    it('Should return health check message', function() {
        return request(testServer)
            .get('/health-check')
            .expect(200)
            .then((response) => {
                assert.equal(response.text, "Health check!");
            });
    });
});