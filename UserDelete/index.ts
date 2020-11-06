import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { checkinsTableClient, defaultPartition, usersTableClient } from '../common';
import { queryList } from '../common/functions';
import { CheckinEntity } from '../common/models/checkin.model';

/* Delete a user */

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Supply the user id in the query params
    const id = req.query.id;
    try {
        // Delete the user, the partition is default
        if (!id) throw { statusCode: 404, message: 'Not found' };
        await usersTableClient.deleteEntity(defaultPartition, id);
        // Now delete all checkins with was for that user (CASCADE)
        const userCheckins = await queryList<CheckinEntity>(checkinsTableClient, `User eq '${id}'`);
        await Promise.all(userCheckins.map(checkin => checkinsTableClient.deleteEntity(checkin.partitionKey, checkin.rowKey)));
        context.res = {
            status: 204,
        };
    } catch (e) {
        context.res = {
            status: e.statusCode,
            error: e.message,
        };
    }
};

export default httpTrigger;
