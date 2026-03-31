import { Repository } from 'typeorm';
import { Customer } from '../customer.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class DeleteCustomersProvider {
  constructor(
    /**Inject customerRepository */
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  public async deleteCustomer(id: number) {
    await this.customerRepository.delete(id);
    return { deleted: true, id };
  }
}
