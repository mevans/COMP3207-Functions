import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { v4 as uuid } from 'uuid';
import { defaultPartition, usersTableClient } from '../common';
import { UserAPI, UserEntity } from '../common/models/user.model';

/* Create a user */

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const userAPI: UserAPI = {
        id: uuid(), // Generate a unique id
        name: req.body['name'],
        email: req.body['email'],
        phone: req.body['phone'],
        address: req.body['address'],
    }
    const userEntity: UserEntity = {
        partitionKey: defaultPartition, // Use the default partition and the row key as the unique id
        // On a real application, this partition key could possible be something like postcode / county to nicely separate users
        rowKey: userAPI.id,
        Name: userAPI.name,
        Email: userAPI.name,
        Phone: userAPI.phone,
        Address: userAPI.address,
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
