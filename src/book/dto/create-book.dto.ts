import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";
import { Category } from "../schemas/book.schema";
import { User } from "../../auth/schemas/user.schema";


export class CreateBookDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(100)
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(100)
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(100)
    readonly author: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1000)
    readonly price: number;

    @IsNotEmpty()
    @IsEnum(Category, { message: 'Please enter a correct category'})
    readonly category:  Category

    @IsEmpty({ message: 'You can not pass user id'})
    readonly user: User
}