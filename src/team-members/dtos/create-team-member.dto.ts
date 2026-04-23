import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { userRole } from '../enums/user-role.enum';

export class CreateTeamMemberDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(55)
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('RO')
  contactNumber?: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  contactEmail?: string;

  @IsEnum(userRole)
  @IsNotEmpty()
  role?: userRole;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak!',
  })
  password!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customers?: string[];
}
/**
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customers?: string[]; */
/* @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak!',
  })*/
