import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CustomersService } from './providers/customers.service';

@Controller('customers')
export class CustomersController {
  constructor(
    /**Inject customersService */
    private readonly customersService: CustomersService,
  ) {}
  @Post()
  public createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    console.log(createCustomerDto);
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  public getAllCustomers() {
    return this.customersService.getAll();
  }
}
