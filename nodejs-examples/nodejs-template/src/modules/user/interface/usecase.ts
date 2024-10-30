import {
    LoginReq,
    LoginResp,
    MeResp,
    RefreshResp,
    SignUpReq,
    SignUpResp,
} from "../../../domain/entities/user";

export interface IUserUsecase<T> {
    Login(req:LoginReq): Promise<LoginResp>;
    SignUp(req:SignUpReq): Promise<SignUpResp>;
    Me(u:any): Promise<MeResp>;
    Refresh(u:any): Promise<RefreshResp>;
    GetGoogleAuthURL():Promise<any>;
    GoogleAuth(code:string):Promise<any>;
}
