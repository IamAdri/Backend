import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './providers/customers.service';
import { CreateCustomerProvider } from './providers/create-customer.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { GetCustomersProvider } from './providers/get-customers.provider';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, CreateCustomerProvider, GetCustomersProvider],
  imports: [TypeOrmModule.forFeature([Customer]), PaginationModule],
})
export class CustomersModule {}
