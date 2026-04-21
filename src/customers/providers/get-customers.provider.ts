import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from '../customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { GetCustomerDto } from '../dtos/get-customer.dto';

@Injectable()
export class GetCustomersProvider {
  constructor(
    /**Inject repository Customer*/
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    /**Inject paginationProvider */
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async getAll(
    customerQuery: PaginationQueryDto,
  ): Promise<Paginated<Customer>> {
    let customers = await this.paginationProvider.paginateQuery(
      {
        limit: customerQuery.limit,
        page: customerQuery.page,
      },
      this.customersRepository,
      {
        order: {
          createdAt: 'ASC',
        },
        relations: ['teamMembers'],
        select: {
          teamMembers: {
            id: true,
            name: true,
          },
        },
      },
    );
    customers.data.forEach((customer) => {
      if (customer.teamMembers && customer.teamMembers.length > 0) {
        customer.teamMembers.sort((a, b) =>
          (a.name || '').localeCompare(b.name || ''),
        );
      }
    });
    /*
    const formattedCustomersData: GetCustomerDto[] = customers.data.map(
      (customer): GetCustomerDto => ({
        ...customer,
        teamMembers:
          customer.teamMembers
            ?.map((tm) => tm.name)
            .sort((a, b) => a.localeCompare(b)) ?? [],
      }),
    );
    const result: Paginated<GetCustomerDto> = {
      ...customers,
      data: formattedCustomersData,
    };
    return result;*/
    return customers;
  }

  public async getAllCompanyNames() {
    const companyNames = await this.customersRepository.find({
      select: {
        companyName: true,
      },
      order: {
        companyName: 'ASC',
      },
    });
    return companyNames;
  }
}
/** relations: ['customers'],
        select: {
          id: true,
          name: true,
          contactNumber: true,
          contactEmail: true,
          customers: {
            companyName: true,
          },
        }, */
