import {
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from '../customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

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
    let customers: Paginated<Customer>;
    try {
      customers = await this.paginationProvider.paginateQuery(
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
    } catch (err) {
      throw new RequestTimeoutException(
        'The server is taking too long to respond. Please try again later!',
        { description: 'Error during pagination or database connection.' },
      );
    }
    //Sort team members in alphanbetical order
    customers.data?.forEach((customer) => {
      if (customer.teamMembers?.length) {
        customer.teamMembers.sort((a, b) =>
          (a.name || '').localeCompare(b.name || ''),
        );
      }
    });

    return customers;
  }

  public async getAllCompanyNames() {
    try {
      const companyNames = await this.customersRepository.find({
        select: {
          companyName: true,
        },
        order: {
          companyName: 'ASC',
        },
      });
      return companyNames || [];
    } catch (err) {
      console.error('Fetch company names error:', err);
      throw new InternalServerErrorException('Could not get company names.');
    }
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
