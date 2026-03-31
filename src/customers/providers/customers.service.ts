import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CreateCustomerProvider } from './create-customer.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../customer.entity';
import { Repository } from 'typeorm';
import { GetCustomersProvider } from './get-customers.provider';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { PatchCustomersProvider } from './patch-customer.provider';
import { PatchCustomerDto } from '../dtos/patch-customer.dto';
import { DeleteCustomersProvider } from './delete-customer.provider';

@Injectable()
export class CustomersService {
  constructor(
    /**Inject createCustomerProvider */
    private readonly createCustomerProvider: CreateCustomerProvider,
    /**Inject getCustomersProvider */
    private readonly getCustomersProvider: GetCustomersProvider,
    /**Inject patchCustomersProvider */
    private readonly patchCustomersProvider: PatchCustomersProvider,
    /**Inject deleteCustomersProvider */
    private readonly deleteCustomersProvider: DeleteCustomersProvider,
    /**Inject customer repository */
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  public create(createCustomerDto: CreateCustomerDto) {
    return this.createCustomerProvider.createCustomer(createCustomerDto);
  }

  public async getAll(getCustomersDto: PaginationQueryDto) {
    return await this.getCustomersProvider.getAll(getCustomersDto);
  }

  public async update(patchCustomerDto: PatchCustomerDto, id: number) {
    return await this.patchCustomersProvider.update(patchCustomerDto, id);
  }

  public async delete(id: number) {
    return await this.deleteCustomersProvider.deleteCustomer(id);
  }
}
