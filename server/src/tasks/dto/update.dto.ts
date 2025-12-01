import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateTaskDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    skills: string[];
}