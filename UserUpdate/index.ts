import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { usersTableClient } from '../common';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const user = req.body;
    const res = await usersTableClient.updateEntity(user, 'Replace');
    context.log(res);
    context.res = {
        status: 200,
        body: user,
    };
};

export default httpTrigger;
