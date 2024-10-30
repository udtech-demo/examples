import {User} from "../../../domain/entities/user";

export interface IUserRepo<T> {
    GetById(id:string): Promise<User>;
    GetByEmail(email:string): Promise<User>;
    Create(u:User): Promise<User>;
    Update(s:User): Promise<User>;
}