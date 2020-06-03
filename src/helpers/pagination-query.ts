import { FindManyOptions } from 'typeorm';

export const GetPaginationQuery = <T extends {id: string;}>(page: number, limit: number): Partial<FindManyOptions<T>> => {
    return {
        skip: (page * limit) - limit,
        take: limit,
        order: { id: 'ASC' }
    }
}