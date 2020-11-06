import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { checkinsTableClient, defaultPartition, venuesTableClient } from '../common';
import { queryList } from '../common/functions';
import { CheckinEntity } from '../common/models/checkin.model';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const id = req.query.id;
    try {
        if (!id) throw { statusCode: 404, message: 'Not found' };
        await venuesTableClient.deleteEntity(defaultPartition, id);
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
