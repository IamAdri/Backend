import { Repository } from 'typeorm';
import { Customer } from '../customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class DeleteCustomersProvider {
  constructor(
    /**Inject customerRepository */
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  public async deleteCustomer(id: number) {
    //Check if id exists in DB
    const customer = await this.customersRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }

    //Delete customer from DB
    try {
      await this.customersRepository.remove(customer);
      return { deleted: true, id };
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to delete customer. Please try again!',
      );
    }
  }
}
