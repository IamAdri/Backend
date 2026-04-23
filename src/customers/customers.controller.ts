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
  Req,
} from '@nestjs/common';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CustomersService } from './providers/customers.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { PatchCustomerDto } from './dtos/patch-customer.dto';
import { REQUEST_TEAM_MEMBER_KEY } from 'src/auth/constants/auth.constants';
import { ActiveTeamMember } from 'src/auth/decorator/active-team-member.decorator';
import type { ActiveTeamMemberData } from 'src/auth/interfaces/active-team-member-data.interface';

@Controller('customers')
export class CustomersController {
  constructor(
    /**Inject customersService */
    private readonly customersService: CustomersService,
  ) {}
  @Post()
  public createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
    @ActiveTeamMember() teamMember: ActiveTeamMemberData,
  ) {
    console.log(createCustomerDto);
    return this.customersService.create(createCustomerDto, teamMember);
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
