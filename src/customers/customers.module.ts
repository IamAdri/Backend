import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './providers/customers.service';
import { CreateCustomerProvider } from './providers/create-customer.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { GetCustomersProvider } from './providers/get-customers.provider';
import { PatchCustomersProvider } from './providers/patch-customer.provider';
import { DeleteCustomersProvider } from './providers/delete-customer.provider';
import { TeamMembersModule } from 'src/team-members/team-members.module';

@Module({
  controllers: [CustomersController],
  providers: [
    CustomersService,
    CreateCustomerProvider,
    GetCustomersProvider,
    PatchCustomersProvider,
    DeleteCustomersProvider,
  ],
  imports: [
    TypeOrmModule.forFeature([Customer]),
    PaginationModule,
    TeamMembersModule,
  ],
})
export class CustomersModule {}
