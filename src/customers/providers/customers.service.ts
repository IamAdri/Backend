import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CreateCustomerProvider } from './create-customer.provider';

@Injectable()
export class CustomersService {
  constructor(
    /**Inject createCustomerProvider */
    private readonly createCustomerProvider: CreateCustomerProvider,
  ) {}

  public create(createCustomerDto: CreateCustomerDto) {
    return this.createCustomerProvider.createCustomer(createCustomerDto);
  }
}
