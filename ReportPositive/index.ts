import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { defaultPartition, usersTableClient } from '../common';
import { UserEntity } from '../common/models/user.model';
import { TableEntity } from '@azure/data-tables';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const id = req.query['id'];
    try {
        const patch: TableEntity<{ Reported: boolean }> = {
            partitionKey: defaultPartition,
            rowKey: id,
            Reported: true,
        };
        await usersTableClient.updateEntity<UserEntity>(patch as any, 'Merge');
        context.res = {
            status: 200,
        }
    } catch (e) {
        context.res = {
            status: e.statusCode,
            error: e.message,
        };
    }
};

export default httpTrigger;
