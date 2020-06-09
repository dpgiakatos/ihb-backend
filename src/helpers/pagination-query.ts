import { FindManyOptions } from 'typeorm';

export const GetPaginationQuery = <T>(
    page: number,
    limit: number,
    order: { [P in keyof T]?: 'ASC' | 'DESC' | 1 | -1; } 
): Partial<FindManyOptions<T>> => {
    return {
        skip: (page * limit) - limit,
        take: limit,
        order
    }
}