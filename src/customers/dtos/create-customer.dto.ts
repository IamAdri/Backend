import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { customerProjectType } from '../enums/customerProjectType.enum';
import { customerStatus } from '../enums/customerStatus.enum';

export class CreateCustomerDto {
  @IsString()
  @MaxLength(55)
  @IsNotEmpty()
  companyName?: string;

  @IsString()
  @MaxLength(55)
  @IsNotEmpty()
  contactName?: string;

  @IsEmail()
  @IsNotEmpty()
  contactEmail?: string;

  @IsString()
  @MaxLength(55)
  @IsNotEmpty()
  industry?: string;

  @IsEnum(customerProjectType)
  @IsNotEmpty()
  projectType?: customerProjectType;

  @IsEnum(customerStatus)
  @IsNotEmpty()
  status?: customerStatus;

  @IsDate()
  @IsNotEmpty()
  deadline?: Date;
}

/*
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  teamMembers?: string[];*/
