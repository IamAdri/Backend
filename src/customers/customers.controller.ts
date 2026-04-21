import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CustomersService } from './providers/customers.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { PatchCustomerDto } from './dtos/patch-customer.dto';

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

  @Get('names')
  public getAllCompanyNames() {
    return this.customersService.getAllCompanyNames();
  }

  @Patch(':id')
  public updateCustomer(
    @Body() patchCustomerDto: PatchCustomerDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.customersService.update(patchCustomerDto, id);
  }

  @Delete(':id')
  public deleteCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.delete(id);
  }
}
