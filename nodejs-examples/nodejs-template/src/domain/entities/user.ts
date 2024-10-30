import "reflect-metadata"
import {Entity, PrimaryGeneratedColumn, Column, Index} from "typeorm"
import {IsEmail, IsString, Length} from "class-validator";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Index({unique:true})
    @Column('varchar',{nullable:false})
    email: string;

    @Column('varchar',{nullable:true})
    password:string;

    @Column('varchar',{nullable:true})
    firstname: string;

    @Column('varchar',{nullable:true})
    lastname: string;

    @Column('varchar',{nullable:true})
    role:string;

    @Column('varchar',{nullable:true})
    access_token:string;

    @Column('varchar',{nullable:true})
    refresh_token:string;

    @Column('integer',{nullable:true})
    access_token_expires_in:number;

    @Column('timestamp',{nullable:true})
    access_token_expires_at:Date;

    @Column('timestamp',{nullable:true})
    refresh_token_expires_at:Date;

    @Column('timestamp',{ default: () => "NOW()" })
    created_at: Date;

    @Column('timestamp',{ default: () => "NOW()" })
    updated_at: Date;
}

export class LoginReq {
    @IsEmail()
    email: string;

    @IsString()
    @Length(6)
    password: string;
}

export class SignUpReq {
    @IsEmail()
    email: string;

    @Length(6)
    password: string;

    @Length(2)
    firstname: string;

    @Length(2)
    lastname: string;
}

export class SignUpResp {
    constructor(public access_token: string, public refresh_token: string) {}
}

export class MeResp {
    constructor(public id: string, public email: string, public firstname: string, public lastname: string, public created_at: Date) {}
}

export class LoginResp {
    constructor(public access_token: string, public refresh_token: string) {}
}

export class RefreshResp {
    constructor(public access_token: string, public refresh_token: string) {}
}

export class GetMyInfoResp {
    constructor(public id: string, public email: string) {}
}