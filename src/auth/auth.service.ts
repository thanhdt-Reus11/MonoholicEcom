import { BadGatewayException, BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcryptjs'
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { LoginDto, PayloadToken, Tokens } from './auth.type';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        private readonly jwtService : JwtService
    ) {};

    async register ( createUserDto : CreateUserDto) : Promise<Tokens> {
        const {username, password, email} = createUserDto;

        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await this.userModel.create({
                username,
                email,
                password: hashedPassword,
                roles: 'user',
            });

            const [refresh_token, access_token] = await this.createTokens({id: user._id, username: username, roles: user.roles})

            user.refresh_token = await bcrypt.hash(refresh_token, 10);
            user.save();

            return {
                refresh_token: refresh_token,
                access_token: access_token
            }

        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Duplicate email entered');
            }
            throw new BadRequestException(error);
        }
    }

    async login (loginDto:LoginDto) : Promise<Tokens> {
        const {email, password} = loginDto;
        const user = await this.userModel.findOne({email});

        if (!user){
            throw new BadRequestException('Invalid email or password');
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        
        if(!isPasswordMatched) {
            throw new BadRequestException('Invalid email or password');
        }

        const [refresh_token, access_token] = await this.createTokens({id: user._id, username: user.username, roles:user.roles});

        user.refresh_token = await bcrypt.hash(refresh_token, 10);
        user.save()

        return {
            refresh_token: refresh_token,
            access_token: access_token
        };
    }

    async refresh (user: UserDocument) {
        const payload = {
            id: user._id,
            username: user.username,
            roles: user.roles,
        }

        const [refresh_token, access_token] = await this.createTokens(payload);

        const hashRT = await bcrypt.hash(refresh_token, 10);
        await this.userModel.updateOne({_id: user._id}, {
            refresh_token: hashRT,
        })

        return {
            refresh_token: refresh_token,
            access_token: access_token
        };
    }

    async logout (user : UserDocument) {
        user.refresh_token = null;
        user.save();
        return user;
    }

    private createTokens (payload:PayloadToken) : Promise<[String, String]> {
        return Promise.all([
            this.jwtService.signAsync({
                id : payload.id,
                username: payload.username,
                roles: payload.roles
            },
            {
                secret: process.env.RT_SECRET,
                expiresIn: process.env.RT_EXPIRE
            }),
            this.jwtService.signAsync({
                id : payload.id,
                username: payload.username,
                roles: payload.roles
            },
            {
                secret: process.env.AT_SECRET,
                expiresIn: process.env.AT_EXPIRE
            }),
        ])
    }
}
