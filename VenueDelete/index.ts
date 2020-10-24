import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { defaultPartition, venuesTableClient } from '../common';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const id = req.query.id;
    try {
        if (!id) throw { statusCode: 404, message: 'Not found' };
        await venuesTableClient.deleteEntity(defaultPartition, id);
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
