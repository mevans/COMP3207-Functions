import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { UserEntity } from '../common/models/user.model';
import { checkinsTableClient, usersTableClient } from '../common';
import { CheckinEntity } from '../common/models/checkin.model';
import { flatMap, uniqBy } from 'lodash';
import { TableClient } from '@azure/data-tables';

const getListFromAsyncIterable = async <T>(iterable: PagedAsyncIterableIterator<T>): Promise<T[]> => {
    const items: T[] = [];
    for await (const item of iterable) {
        items.push(item);
    }
    return items;
};

const queryList = async <T extends Object>(client: TableClient, filter: string): Promise<T[]> => {
    return getListFromAsyncIterable(client.listEntities<T>({ queryOptions: { filter } }))
}

const uniqueByPartitionAndRowKey = <T extends { partitionKey: string; rowKey: string; }>(items: T[]): T[] => {
    return uniqBy(items, item => [item.partitionKey, item.rowKey].join('-'));
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Get all reported users
    const reportedUsers = await queryList<UserEntity>(usersTableClient, 'Reported eq true');
    // Get all checkins which reported users visited
    const primaryAffectedCheckins = uniqueByPartitionAndRowKey<CheckinEntity>(flatMap<CheckinEntity>(await Promise.all(
        reportedUsers.map(u => queryList(checkinsTableClient, `User eq '${ u.rowKey }'`)),
    )));
    // Get all checkins at the same venue as those ^ and which overlap any days
    const secondaryAffectedCheckins = uniqueByPartitionAndRowKey<CheckinEntity>(flatMap<CheckinEntity>(await Promise.all(
        primaryAffectedCheckins.map(c => queryList(checkinsTableClient, `(PartitionKey eq '${ c.partitionKey }') and not (Arrive gt datetime'${ c.Leave.toISOString() }' or Leave lt datetime'${ c.Arrive.toISOString() }')`))
    )));
    // Return the users
    const users: string[] = secondaryAffectedCheckins.map(c => c.User);
    context.res = {
        status: 200,
        body: { users },
    };
};

export default httpTrigger;
