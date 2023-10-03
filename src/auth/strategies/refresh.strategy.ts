import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "src/user/schemas/user.schema";
import { Request } from "express";
import { PayloadToken } from "../auth.type";
import * as bcrypt from "bcryptjs";


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(
        @InjectModel(User.name)
        private readonly userModel:Model<User>,
    )   {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.RT_SECRET,
            passReqToCallback: true
        })
    }

    async validate(req: Request, payload: PayloadToken) {
        const {id, username, roles} = payload;

        const [type, token] = req.headers.authorization?.split(' ') ?? [];
        const refresh_token = type === 'Bearer' ? token : undefined;

        if(!refresh_token) {
            throw new ForbiddenException('Access is denied');
        }

        const user = await this.userModel.findById(id);

        if(!user || !user.refresh_token) {
            throw new ForbiddenException('Access is denied');
        }

        const isMatchToken = await bcrypt.compare(refresh_token, user.refresh_token);

        if (!isMatchToken) {
            throw new ForbiddenException('Access is denied');
        }

        return user;
    }
}