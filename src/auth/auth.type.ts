import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import mongoose from "mongoose";
import {Request} from "express"
import { UserDocument } from "src/user/schemas/user.schema";

export type PayloadToken = {
    id: mongoose.Types.ObjectId;
    username: string;
    roles: string[]
}

export type Tokens = {
    refresh_token: String;
    access_token: String;
}

export class LoginDto {
    
    @IsEmail({}, {message: "Please enter correct email."})
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;
}

export type RequestWithAuth = Request & {user : UserDocument};