import { IsEmpty, IsEnum, IsNumber, IsOptional, IsString, Min, MaxLength, MinLength } from "class-validator";
import { Category } from "../schemas/book.schema";
import { User } from "../../auth/schemas/user.schema";


export class UpdateBookDto {

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(100)
    readonly title: string;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(100)
    readonly description: string;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(100)
    readonly author: string;

    @IsOptional()
    @IsNumber()
    @Min(1000)
    readonly price: number;

    @IsOptional()
    @IsEnum(Category, { message: 'Please enter a correct category'})
    readonly category:  Category

    @IsEmpty({ message: 'You can not pass user id'})
    readonly user: User
}