import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CreateCustomerProvider } from './create-customer.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(
    /**Inject createCustomerProvider */
    private readonly createCustomerProvider: CreateCustomerProvider,
    /**Inject customer repository */
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  public create(createCustomerDto: CreateCustomerDto) {
    return this.createCustomerProvider.createCustomer(createCustomerDto);
  }

  public async getAll() {
    const customers = await this.customersRepository.find();
    console.log(customers);
    return customers;
  }
}
