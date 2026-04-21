import { forwardRef, Module } from '@nestjs/common';
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
import { FindMultipleCustomersProvider } from './providers/get-multiple-customers.provider';
import { TeamMember } from 'src/team-members/team-member.entity';

@Module({
  controllers: [CustomersController],
  providers: [
    CustomersService,
    CreateCustomerProvider,
    GetCustomersProvider,
    PatchCustomersProvider,
    DeleteCustomersProvider,
    FindMultipleCustomersProvider,
  ],
  imports: [
    TypeOrmModule.forFeature([Customer, TeamMember]),
    PaginationModule,
    TeamMembersModule,
  ],
  exports: [CustomersService],
})
export class CustomersModule {}
