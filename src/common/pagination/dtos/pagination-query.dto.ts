import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
    @Type(()=>Number)
    @IsPositive()
    @IsOptional()
    limit?: number = 3;

    @Type(()=>Number)
    @IsPositive()
    @IsOptional()
    page?: number = 1;
}
