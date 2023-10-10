import { IsOptional } from "class-validator";


export class SearchBookDto {

    @IsOptional()
    page?: number
}