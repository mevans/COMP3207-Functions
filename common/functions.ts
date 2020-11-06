import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { TableClient } from '@azure/data-tables';
import { uniqBy } from 'lodash';

/* Helpful functions */

// Turn a date into a date in the format yyyy-mm-dd
export const dateToString = (date: Date) => date.toISOString().split('T')[0];

// Get all items from an async iterable
export const getListFromAsyncIterable = async <T>(iterable: PagedAsyncIterableIterator<T>): Promise<T[]> => {
    const items: T[] = [];
    for await (const item of iterable) {
        items.push(item);
    }
    return items;
};

// Get a list of items from a table and a query
export const queryList = async <T extends Object>(client: TableClient, filter: string): Promise<T[]> => {
    return getListFromAsyncIterable(client.listEntities<T>({ queryOptions: { filter } }))
}

// Remove defaults by their partition key and their row key
export const uniqueByPartitionAndRowKey = <T extends { partitionKey: string; rowKey: string; }>(items: T[]): T[] => {
    return uniqBy(items, item => [item.partitionKey, item.rowKey].join('-'));
}
