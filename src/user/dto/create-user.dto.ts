import { IsEmail, IsEmpty, IsNotEmpty, IsString, MinLength, isEmpty } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    readonly username: string;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string

    @IsEmail({}, {message: "Please enter correct email."})
    @IsNotEmpty()
    readonly email: string;

    readonly roles: string[];

    @IsEmpty({ message: "You cannot pass refresh token" })
    readonly refresh_token: string;
}
