import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "src/user/schemas/user.schema";
import { PayloadToken } from "../auth.type";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectModel(User.name)
        private readonly userModel : Model<User>,
        private readonly configService : ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('AT_SECRET'),
        })
    }

    async validate(payload : PayloadToken) {
        const {id, username, roles} = payload;

        const user = await this.userModel.findById(id);

        if (!user && user?.username===username) {
            throw new ForbiddenException('Forbidden Error!');
        }

        return user;
    }
}
