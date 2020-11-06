import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { defaultPartition, usersTableClient } from '../common';
import { UserAPI, UserEntity } from '../common/models/user.model';

/* Update a user */

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const userAPI: UserAPI = req.body;
    const userEntity: UserEntity = {
        partitionKey: defaultPartition,
        rowKey: userAPI.id,
        Name: userAPI.name,
        Email: userAPI.email,
        Phone: userAPI.phone,
        Address: userAPI.email,
    };
    try {
        await usersTableClient.updateEntity<UserEntity>(userEntity, 'Replace');
        context.res = {
            status: 200,
            body: userAPI,
        };
    } catch (e) {
        context.res = {
            status: e.statusCode,
            error: e.message,
        };
    }
};

export default httpTrigger;
