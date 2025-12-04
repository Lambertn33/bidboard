import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CompleteWorkDto {
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    completionUrl: string;
}