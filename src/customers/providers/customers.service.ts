import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CreateCustomerProvider } from './create-customer.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../customer.entity';
import { Repository } from 'typeorm';
import { GetCustomersProvider } from './get-customers.provider';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

@Injectable()
export class CustomersService {
  constructor(
    /**Inject createCustomerProvider */
    private readonly createCustomerProvider: CreateCustomerProvider,
    /**Inject getCustomersProvider */
    private readonly getCustomersProvider: GetCustomersProvider,
    /**Inject customer repository */
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  public create(createCustomerDto: CreateCustomerDto) {
    return this.createCustomerProvider.createCustomer(createCustomerDto);
  }

  public async getAll(getCustomersDto: PaginationQueryDto) {
    return await this.getCustomersProvider.getAll(getCustomersDto)
  }
}
