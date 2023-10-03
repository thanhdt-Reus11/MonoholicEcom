import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenStrategy } from './strategies/access.strategy';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({}),
    JwtModule.register({}),
    MongooseModule.forFeature([{name:User.name, schema: UserSchema}]),
  ],
  controllers: [AuthController, ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AccessTokenStrategy, RefreshTokenStrategy]
})
export class AuthModule {}
