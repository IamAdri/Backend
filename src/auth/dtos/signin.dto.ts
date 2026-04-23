import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  contactEmail!: string;

  @MinLength(8)
  @IsNotEmpty()
  password!: string;
}
