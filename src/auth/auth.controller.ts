import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto, RequestWithAuth, Tokens } from './auth.type';
import { AuthGuard } from '@nestjs/passport';
import { SkipToken } from './skip-token.decorator';
import { RefreshGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService : AuthService,
        ) {};
    
    @SkipToken()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register (
        @Body() createUserDto : CreateUserDto
    ) : Promise<Tokens> {
        return this.authService.register(createUserDto);
    }


    @SkipToken()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login (
        @Body() loginDto : LoginDto
    ) : Promise<Tokens> {
        return this.authService.login(loginDto);
    }

    @Get('logout')
    @HttpCode(HttpStatus.OK)
    async logout (
        @Req() req : RequestWithAuth
    ) {
        return this.authService.logout(req.user);
    }

    @SkipToken()
    @UseGuards(RefreshGuard)
    @Get('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh (
        @Req() req: RequestWithAuth
    ) : Promise<Tokens> {
        return this.authService.refresh(req.user);
    }
}
