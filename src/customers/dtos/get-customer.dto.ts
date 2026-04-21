import { IsArray, IsOptional, IsString } from 'class-validator';
import { customerProjectType } from '../enums/customerProjectType.enum';
import { customerStatus } from '../enums/customerStatus.enum';

export class GetCustomerDto {
  id: number;
  companyName: string;
  contactName: string;
  contactEmail: string;
  industry: string;
  projectType: customerProjectType;
  status: customerStatus;
  deadline: Date;
  createdAt: Date;
  teamMembers: string[];
}
