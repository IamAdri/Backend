import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../customer.entity';
import { Repository } from 'typeorm';
import { PatchCustomerDto } from '../dtos/patch-customer.dto';
import { TeamMember } from 'src/team-members/team-member.entity';

@Injectable()
export class PatchCustomersProvider {
  constructor(
    /**Inject repository Customer*/
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    /**Inject teamMemberRepository */
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
  ) {}
  public async update(patchCustomerDto: PatchCustomerDto, id: number) {
    //Check if id exists in DB
    const customer = await this.customersRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }

    //Check if company name is unique(if edited company name is not the same as the other company name with different id)
    if (patchCustomerDto.companyName) {
      const existingCompany = await this.customersRepository.findOne({
        where: {
          companyName: patchCustomerDto.companyName,
        },
      });
      if (existingCompany && existingCompany.id !== id) {
        throw new ConflictException(
          'This company name has been already taken. Please change the edited company name!',
        );
      }
    }

    //Update the edited details
    Object.assign(customer, patchCustomerDto);
    try {
      return await this.customersRepository.save(customer);
    } catch (err) {
      if (err && typeof err === 'object' && 'code' in err) {
        if (err.code === '23505')
          throw new ConflictException('Duplicate entry.');
      }
      throw new InternalServerErrorException(
        'Error updating customer. Please try again!',
      );
    }
  }
}

/*
    if (customer) {
      customer.companyName =
        patchCustomerDto.companyName ?? customer.companyName;
      customer.contactName =
        patchCustomerDto.contactName ?? customer.contactName;
      customer.contactEmail =
        patchCustomerDto.contactEmail ?? customer.contactEmail;
      customer.industry = patchCustomerDto.industry ?? customer.industry;
      customer.projectType =
        patchCustomerDto.projectType ?? customer.projectType;
      customer.status = patchCustomerDto.status ?? customer.status;
      customer.deadline = patchCustomerDto.deadline ?? customer.deadline;
    }
*/
