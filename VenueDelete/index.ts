import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { checkinsTableClient, defaultPartition, venuesTableClient } from '../common';
import { queryList } from '../common/functions';
import { CheckinEntity } from '../common/models/checkin.model';

/* Delete a venue */

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Supply the venue id in the query params
    const id = req.query.id;
    try {
        // Delete the partition, the partition is default
        if (!id) throw { statusCode: 404, message: 'Not found' };
        await venuesTableClient.deleteEntity(defaultPartition, id);
        // Now delete all checkins to do with that venue (CASCADE)
        const venueCheckins = await queryList<CheckinEntity>(checkinsTableClient, `PartitionKey eq '${id}'`);
        await Promise.all(venueCheckins.map(checkin => checkinsTableClient.deleteEntity(checkin.partitionKey, checkin.rowKey)));
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
