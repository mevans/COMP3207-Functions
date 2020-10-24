import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { defaultPartition, usersTableClient } from '../common';
import { UserAPI, UserEntity } from '../common/models/user.model';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const userAPI: UserAPI = req.body;
    const userEntity: UserEntity = {
        partitionKey: defaultPartition,
        rowKey: userAPI.id,
        FirstName: userAPI.first_name,
        LastName: userAPI.last_name,
    };
    await usersTableClient.updateEntity<UserEntity>(userEntity, 'Replace');
    context.res = {
        status: 200,
        body: userAPI,
    };
};

export default httpTrigger;
