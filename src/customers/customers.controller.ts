import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CustomersService } from './providers/customers.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

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
  public getAllCustomers(@Query() customersQuery: PaginationQueryDto) {
    return this.customersService.getAll(customersQuery);
  }
}
