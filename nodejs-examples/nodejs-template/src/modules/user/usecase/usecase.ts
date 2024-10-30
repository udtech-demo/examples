import {LoginReq, LoginResp, MeResp, RefreshResp, SignUpReq, SignUpResp, User} from "../../../domain/entities/user";
import {IUserRepo} from "../interface/repository";
import {IUserUsecase} from "../interface/usecase";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Config} from "../../../conf";
import axios from "axios";
import {google} from "googleapis";
import { v4 as uuidv4 } from 'uuid';
import {CustomError} from "../../../domain/error";

export class UserUsecase implements IUserUsecase<User> {
    private readonly _repo: IUserRepo<User>;
    private readonly _oauth2Client: any;

    constructor(repo) {
        this._repo = repo;

        // Define google auth
        this._oauth2Client = new google.auth.OAuth2(
            Config.ServerConfig.GOOGLE_CLIENT_ID,
            Config.ServerConfig.GOOGLE_CLIENT_SECRET,
            `${Config.ServerConfig.APP_HOST}:${Config.ServerConfig.APP_PORT}/api/v1/auth/google/callback`
        );

        console.log(`${Config.ServerConfig.APP_HOST}/api/v1/auth/google/callback`)
    }

    public async GetGoogleAuthURL():Promise<any> {
        /*
         * Generate a url that asks permissions to the user's email and profile
         */
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ];

        return this._oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: scopes, // If you only need one scope you can pass it as string
        });
    }

    public async GetGoogleUser(code:string) {
        const { tokens } = await this._oauth2Client.getToken(code);

        // 1. Fetch the user's profile with the access token and bearer
        const googleUser = await axios
            .get(
                `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokens.id_token}`,
                    },
                },
            ).then(res => res.data)
            .catch(error => {
                throw new Error(error.message);
            });

        return googleUser;
    }

    async GoogleAuth(code:string):Promise<any> {
        const googleUser = await this.GetGoogleUser(code);

        let user = await this._repo.GetByEmail(googleUser.email)
        if (!user) {
           const signUpReq = new SignUpReq();

           signUpReq.email = googleUser.email;
           signUpReq.password = uuidv4();
           signUpReq.firstname = googleUser.given_name;
           signUpReq.lastname = googleUser.family_name;

           const signUpRsp = await this.SignUp(signUpReq);

           return new LoginResp(signUpRsp.access_token, signUpRsp.refresh_token);
        }

        // Generate a JWT, add it as a cookie
        const tokens = await this.MakeAccessAndRefreshTokens(user)

        return new LoginResp(tokens.access_token, tokens.refresh_token);
    }

    public async Login(req:LoginReq): Promise<LoginResp> {
        // Get user by email
        const user = await this._repo.GetByEmail(req.email)
        if (user === null) {
            throw new CustomError('user does not exists', 400);
        }

        // Validate Password
        const passwordVerify = await bcrypt.compare(req.password, user.password);
        if (!passwordVerify) {
            throw new CustomError('invalid password', 400);
        }

        const tokens = await this.MakeAccessAndRefreshTokens(user)

        let response = new LoginResp(tokens.access_token, tokens.refresh_token)

        return response
    }

    private async MakeAccessAndRefreshTokens(u:User): Promise<any> {
        const privateKey = Config.ServerConfig.PRIVATE_KEY;

        const accessExpiresIn = 60*60;
        const refreshExpiresIn = 60*60*60;
        const accessExpiresAt = Math.floor(Date.now() / 1000) + accessExpiresIn;
        const refreshExpiresAt = Math.floor(Date.now() / 1000) + refreshExpiresIn;

        const access_token = jwt.sign({
            id: u.id,
            role: u.role,
            exp: accessExpiresAt,
        }, privateKey, { algorithm: 'RS256' });

        const refresh_token = jwt.sign({
            id: u.id,
            role: u.role,
            isRefresh: true,
            exp: refreshExpiresAt,
        }, privateKey, { algorithm: 'RS256' });

        // Update user
        u.access_token = access_token;
        u.refresh_token = refresh_token;
        u.access_token_expires_in = accessExpiresIn;
        u.access_token_expires_at = new Date(accessExpiresAt *  1000);
        u.refresh_token_expires_at = new Date(refreshExpiresAt *  1000);

        await this._repo.Update(u);

        return { access_token: access_token, refresh_token: refresh_token }
    }

    public async SignUp(req:SignUpReq): Promise<SignUpResp> {
        // Get user by email
        const user = await this._repo.GetByEmail(req.email)
        if (user !== null) {
            throw 'user with this email already exists'
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(req.password, salt);

        // Make user
        let newUser = new User();

        newUser.email = req.email
        newUser.firstname = req.firstname
        newUser.lastname = req.lastname
        newUser.password = pass

        // Save user
        newUser =  await this._repo.Create(newUser)

        // Make tokens
        const tokens = await this.MakeAccessAndRefreshTokens(newUser)

        return new SignUpResp(tokens.access_token, tokens.refresh_token)
    }

    public async Me(u:any): Promise<MeResp> {
        const user = await this._repo.GetById(u.id)

        return new MeResp(user.id, user.email, user.firstname, user.lastname, user.created_at)
    }

    public async Refresh(u:any): Promise<RefreshResp> {
        const user = await this._repo.GetById(u.id)

        const tokens = await this.MakeAccessAndRefreshTokens(user)

        return new RefreshResp(tokens.access_token, tokens.refresh_token)
    }
}
