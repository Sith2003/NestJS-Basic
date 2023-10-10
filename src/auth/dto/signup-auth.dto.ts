import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class SignUpDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({},{ message: "Please enter a correct email "})
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(25)
    readonly password: string;
}