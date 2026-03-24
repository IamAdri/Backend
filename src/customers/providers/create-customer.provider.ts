import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from '../customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerDto } from '../dtos/create-customer.dto';

@Injectable()
export class CreateCustomerProvider {
  constructor(
    /**Inject customer repository */
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  public async createCustomer(createCustomerDto: CreateCustomerDto) {
    let newCustomer;
    try {
      newCustomer = this.customersRepository.create({
        ...createCustomerDto,
      });
      newCustomer = await this.customersRepository.save(newCustomer);
    } catch (err) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please trye later!',
        { description: 'Error connecting to the database!' },
      );
    }

    return newCustomer;
  }
}
