import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";


export class LogInDto {

    @IsNotEmpty()
    @IsEmail({},{ message: "Please enter a correct email "})
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(25)
    readonly password: string;
}