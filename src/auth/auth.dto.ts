import { Equals, IsEmail, IsNotEmpty } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    @IsEmail()
    username: string;
    @IsNotEmpty()
    password: string;
  }

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    username: string;
    
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    confirmPassword: string;
}