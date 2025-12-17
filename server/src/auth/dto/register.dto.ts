import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @IsNotEmpty({ message: 'The names field is required' })
  names: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\+2507\d{8}$/, {
      message: 'Phone number must be in format +2507 followed by 8 digits (e.g., +250788484848)',
  })
  telephone: string;
}