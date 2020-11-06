import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { defaultPartition, venuesTableClient } from '../common';
import { VenueAPI, VenueEntity } from '../common/models/venue.model';

/* Return all venues, or a venue specified by the id */

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const id = req.query.id;
    // If looking for a specific venue (never actually used in the app)
    if (id) {
        try {
            const venueEntity = await venuesTableClient.getEntity<VenueEntity>(defaultPartition, id);
            const venueAPI: VenueAPI = {
                id: venueEntity.rowKey,
                name: venueEntity.Name,
                address: venueEntity.Address,
                postcode: venueEntity.Postcode,
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
                address: venue.Address,
                postcode: venue.Postcode,
            });
        }
        context.res = {
            status: 200,
            body: venueAPIS,
        };
    }
};

export default httpTrigger;
