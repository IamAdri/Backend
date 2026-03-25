import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { ObjectLiteral, Repository } from "typeorm";
import { PaginationQueryDto } from "../dtos/pagination-query.dto";
import { Paginated } from "../interfaces/paginated.interface";

@Injectable()
export class PaginationProvider{
    constructor(
        /**Inject request */
        @Inject(REQUEST)
        private readonly request: Request,
    ){}
    public async paginateQuery<T extends ObjectLiteral>(
        paginationQuery: PaginationQueryDto, 
        repository: Repository<T>): Promise<Paginated<T>>{
            const page = paginationQuery.page ?? 1;
            const limit = paginationQuery.limit ?? 3;

            let results = await repository.find({
                skip: (page - 1) * limit,
                take: limit
            });
            /**Create the request urls */
        const baseURL = this.request.protocol + '://' + this.request.headers.host + '/';
        const newURL = new URL(this.request.url, baseURL);
        console.log(newURL);
        /**Calculate the page numbers */
        const totalItems = await repository.count();
        const totalPages = Math.ceil(totalItems/limit);
        const nextPage = page === totalPages ? page : page + 1;
        const previousPage = page === 1 ? page : page - 1;

        const finalResponse: Paginated<T> = {
            data: results,
            meta: {
                itemsPerPage: limit,
                totalItems: totalItems,
                currentPage: page,
                totalPages: totalPages,
            },
            links: {
                first: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=1`,
                last: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${totalPages}`,
                current: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${page}`,
                next: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${nextPage}`,
                previous: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${previousPage}`
            }
        }
        return finalResponse;
        }
        

}