import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './providers/customers.service';
import { CreateCustomerProvider } from './providers/create-customer.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, CreateCustomerProvider],
  imports: [TypeOrmModule.forFeature([Customer])],
})
export class CustomersModule {}
