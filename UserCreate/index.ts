import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { v4 as uuid } from 'uuid';
import { defaultPartition, usersTableClient } from '../common';
import { UserAPI, UserEntity } from '../common/models/user.model';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const userAPI: UserAPI = {
        id: uuid(),
        name: req.body['name'],
    }
    const userEntity: UserEntity = {
        partitionKey: defaultPartition,
        rowKey: userAPI.id,
        Name: userAPI.name,
    };
    try {
        await usersTableClient.createEntity<UserEntity>(userEntity);
        context.res = {
            status: 201,
            body: userAPI,
        };
    } catch (e) {
        context.res = {
            status: e.statusCode,
            error: e.message,
        }
    }
};

export default httpTrigger;
