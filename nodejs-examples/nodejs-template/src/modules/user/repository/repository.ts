import {User} from "../../../domain/entities/user";
import {IUserRepo} from "../interface/repository";
import {DataSource, Repository} from "typeorm";

export class UserRepo implements IUserRepo<User> {
    private _uRepo:Repository<User>;
    private _dataSource:DataSource;

    constructor(db:DataSource) {
        this._dataSource = db;
        this._uRepo = db.getRepository(User);
    }

    public async GetById(id:string): Promise<User> {
        return this._dataSource
            .getRepository(User)
            .createQueryBuilder("user")
            .where("user.id = :id", { id: id })
            .getOne()
    }

    public async GetByEmail(email:string): Promise<User> {
        return this._dataSource
            .getRepository(User)
            .createQueryBuilder("user")
            .where("user.email = :email", { email: email })
            .getOne()
    }

    public async Create(u:User): Promise<User> {
        return this._uRepo.save(u)
    }

    public async Update(s:User): Promise<User> {
        return this._uRepo.save(s)
    }
}