import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Customer } from "../customer.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationProvider } from "src/common/pagination/providers/pagination.provider";
import { Paginated } from "src/common/pagination/interfaces/paginated.interface";
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";

@Injectable()
export class GetCustomersProvider{
    constructor(
        /**Inject repository Customer*/
        @InjectRepository(Customer)
        private readonly customersRepository: Repository<Customer>,
        /**Inject paginationProvider */
        private readonly paginationProvider: PaginationProvider,
    ){}

    public async getAll(customerQuery: PaginationQueryDto): Promise<Paginated<Customer>>{
        let customers = await this.paginationProvider.paginateQuery({
            limit: customerQuery.limit,
            page: customerQuery.page,
        }, this.customersRepository);
        return customers;
    }
}