import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    project_id: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    skills: string[];
}