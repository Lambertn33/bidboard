import { IsNotEmpty, IsString } from "class-validator";
import { Type } from "class-transformer";

export class AcceptBidDto {
    @IsNotEmpty()
    endDate: string;
}