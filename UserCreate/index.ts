import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { v4 as uuid } from 'uuid';
import { UserEntity } from '../common/models/user.model';
import { usersTableClient } from '../common';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const user: UserEntity = {
        partitionKey: 'Partition',
        rowKey: uuid(),
        FirstName: req.body['first_name'],
        LastName: req.body['last_name'],
    };
    const response = await usersTableClient.createEntity(user);
    context.res = {
        status: 201,
        body: user,
    };
};

export default httpTrigger;
