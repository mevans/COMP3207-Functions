import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { defaultPartition, usersTableClient } from '../common';
import { UserAPI, UserEntity } from '../common/models/user.model';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const id = req.query.id;
    // If looking for a specific user
    if (id) {
        try {
            const userEntity = await usersTableClient.getEntity<UserEntity>(defaultPartition, id);
            const userAPI: UserAPI = {
                id: userEntity.rowKey,
                name: userEntity.Name,
            };
            context.res = {
                status: 200,
                body: userAPI,
            }
        } catch (e) {
            context.res = {
                status: e.statusCode,
                error: e.message,
            };
        }
    } else {
        // Return all users
        const userAPIS: UserAPI[] = [];
        const userEntitiesIter = usersTableClient.listEntities<UserEntity>();
        for await (const user of userEntitiesIter) {
            userAPIS.push({
                id: user.rowKey,
                name: user.Name,
            });
        }
        context.res = {
            status: 200,
            body: userAPIS,
        };
    }
};

export default httpTrigger;
