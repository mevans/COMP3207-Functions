import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { usersTableClient } from '../common';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const id = req.query.id;
    if (!id) {
        context.res = {
            status: 404,
        };
    }
    await usersTableClient.deleteEntity('Partition', id);
    context.res = {
        status: 204,
    };
};

export default httpTrigger;
