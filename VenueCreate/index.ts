import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { v4 as uuid } from 'uuid';
import { defaultPartition, venuesTableClient } from '../common';
import { VenueAPI, VenueEntity } from '../common/models/venue.model';

/* Create a venue */

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const venueAPI: VenueAPI = {
        id: uuid(),
        name: req.body['name'],
        address: req.body['address'],
        postcode: req.body['postcode'],
    }
    const venueEntity: VenueEntity = {
        partitionKey: defaultPartition,
        rowKey: venueAPI.id,
        Name: venueAPI.name,
        Address: venueAPI.address,
        Postcode: venueAPI.postcode,
    };
    try {
        await venuesTableClient.createEntity<VenueEntity>(venueEntity);
        context.res = {
            status: 201,
            body: venueAPI,
        };
    } catch (e) {
        context.res = {
            status: e.statusCode,
            error: e.message,
        }
    }
};

export default httpTrigger;
