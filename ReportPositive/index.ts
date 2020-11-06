import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { defaultPartition, usersTableClient } from '../common';
import { UserEntity } from '../common/models/user.model';
import { TableEntity } from '@azure/data-tables';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        const patch: TableEntity<{ Reported: boolean, ReportDate: Date }> = {
            partitionKey: defaultPartition,
            rowKey: req.body['user'],
            Reported: true,
            ReportDate: req.body['date'] ? new Date(req.body['date']) : new Date(),
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
