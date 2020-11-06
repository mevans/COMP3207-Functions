import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { defaultPartition, usersTableClient } from '../common';
import { UserEntity } from '../common/models/user.model';
import { TableEntity } from '@azure/data-tables';

/* Report a user positive for covid */

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        // Patch their user entry so that they are reported, with the report date
        const patch: TableEntity<{ Reported: boolean, ReportDate: Date }> = {
            partitionKey: defaultPartition,
            rowKey: req.body['user'],
            Reported: true,
            // If no report date is supplied, use the current date
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
