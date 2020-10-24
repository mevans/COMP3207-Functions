import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { defaultPartition, venuesTableClient } from '../common';
import { VenueAPI, VenueEntity } from '../common/models/venue.model';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const id = req.query.id;
    // If looking for a specific venue
    if (id) {
        try {
            const venueEntity = await venuesTableClient.getEntity<VenueEntity>(defaultPartition, id);
            const venueAPI: VenueAPI = {
                id: venueEntity.rowKey,
                name: venueEntity.Name,
            };
            context.res = {
                status: 200,
                body: venueAPI,
            }
        } catch (e) {
            context.res = {
                status: e.statusCode,
                error: e.message,
            };
        }
    } else {
        // Return all venues
        const venueAPIS: VenueAPI[] = [];
        const venueEntitiesIter = venuesTableClient.listEntities<VenueEntity>();
        for await (const venue of venueEntitiesIter) {
            venueAPIS.push({
                id: venue.rowKey,
                name: venue.Name,
            });
        }
        context.res = {
            status: 200,
            body: venueAPIS,
        };
    }
};

export default httpTrigger;
