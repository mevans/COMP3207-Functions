import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { usersTableClient } from '../common';
import { UserEntity } from '../common/models/user.model';
import { TableQuery } from 'azure-storage';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const id = req.query.id;
    // If looking for a specific user
    if (id) {
        const user = await usersTableClient.getEntity<UserEntity>('Partition', id);
        context.res = {
            status: 200,
            body: user,
        }
    } else {
        // Return all users
        const users: UserEntity[] = [];
        const usersIter = usersTableClient.listEntities<UserEntity>();
        for await (const user of usersIter) {
            users.push(user);
        }
        context.res = {
            status: 200,
            body: users,
        };
    }
};

export default httpTrigger;
