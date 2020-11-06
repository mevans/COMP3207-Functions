import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { TableClient } from '@azure/data-tables';
import { uniqBy } from 'lodash';

export const dateToString = (date: Date) => date.toISOString().split('T')[0];

export const getListFromAsyncIterable = async <T>(iterable: PagedAsyncIterableIterator<T>): Promise<T[]> => {
    const items: T[] = [];
    for await (const item of iterable) {
        items.push(item);
    }
    return items;
};

export const queryList = async <T extends Object>(client: TableClient, filter: string): Promise<T[]> => {
    return getListFromAsyncIterable(client.listEntities<T>({ queryOptions: { filter } }))
}

export const uniqueByPartitionAndRowKey = <T extends { partitionKey: string; rowKey: string; }>(items: T[]): T[] => {
    return uniqBy(items, item => [item.partitionKey, item.rowKey].join('-'));
}
