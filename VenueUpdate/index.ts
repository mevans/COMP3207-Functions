import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { defaultPartition, venuesTableClient } from '../common';
import { VenueAPI, VenueEntity } from '../common/models/venue.model';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const venueAPI: VenueAPI = req.body;
    const venueEntity: VenueEntity = {
        partitionKey: defaultPartition,
        rowKey: venueAPI.id,
        Name: venueAPI.name,
        Address: venueAPI.address,
        Postcode: venueAPI.postcode,
    };
    try {
        await venuesTableClient.updateEntity<VenueEntity>(venueEntity, 'Replace');
        context.res = {
            status: 200,
            body: venueAPI,
        };
    } catch (e) {
        context.res = {
            status: e.statusCode,
            error: e.message,
        };
    }
};

export default httpTrigger;
