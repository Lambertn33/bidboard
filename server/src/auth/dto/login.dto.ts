import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'The Email field cannot be empty' })
  email: string;

  @IsNotEmpty({ message: 'The Password field cannot be empty' })
  @MinLength(6)
  password: string;
}