import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  isPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTeamMemberDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(55)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('RO')
  contactNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  contactEmail: string;

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
