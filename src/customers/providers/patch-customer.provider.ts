import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../customer.entity';
import { Repository } from 'typeorm';
import { PatchCustomerDto } from '../dtos/patch-customer.dto';

@Injectable()
export class PatchCustomersProvider {
  constructor(
    /**Inject repository Customer*/
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}
  public async update(patchCustomerDto: PatchCustomerDto, id: number) {
    const customer = await this.customersRepository.findOneBy({
      id: id,
    });
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

    if (customer) {
      await this.customersRepository.save(customer);
    }
    return customer;
  }
}
