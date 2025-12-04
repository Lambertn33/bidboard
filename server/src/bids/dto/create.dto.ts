import { IsNotEmpty, IsString } from "class-validator";

export class CreateBidDto {
    @IsNotEmpty()
    @IsString()
    taskId: string;

    @IsNotEmpty()
    @IsString()
    message: string;
}