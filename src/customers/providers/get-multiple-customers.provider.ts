import { Injectable } from '@nestjs/common';
import { Customer } from '../customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class FindMultipleCustomersProvider {
  constructor(
    /**Inject customersRepository */
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  public async findMultipleCustomers(customers: string[]) {
    let results = await this.customersRepository.find({
      where: {
        companyName: In(customers),
      },
      order: {
        companyName: 'ASC',
      },
    });

    return results;
  }
}

/**
 *  public async findMultipleTeamMembers(teamMembers: string[]) {
     let results = await this.teamMemberRepository.find({
       where: {
         name: In(teamMembers),
       },
       order: {
         name: 'ASC',
       },
     });
     return results;
   }
 }
 */
