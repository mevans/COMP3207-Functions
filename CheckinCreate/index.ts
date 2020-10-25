import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { CheckinAPI, CheckinEntity } from '../common/models/checkin.model';
import { v4 as uuid } from 'uuid';
import { checkinsTableClient } from '../common';
import { dateToString } from '../common/functions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const venue = req.body['venue'];
    const users: string[] = req.body['users'];
    const arrive = req.body['arrive'];
    const leave = req.body['leave'];
    const createCheckinEntity = (user: string) => ({
        partitionKey: venue,
        rowKey: uuid(),
        User: user,
        Arrive: new Date(arrive),
        Leave: new Date(leave),
    }) as CheckinEntity;
    const checkinEntities = users.map(createCheckinEntity);
    try {
        await Promise.all(checkinEntities.map(e => checkinsTableClient.createEntity(e)));
        const checkinAPIs: CheckinAPI[] = checkinEntities.map(e => ({
            id: e.rowKey,
            venue: e.partitionKey,
            user: e.User,
            arrive: dateToString(e.Arrive),
            leave: dateToString(e.Leave),
        }));
        context.res = {
            status: 201,
            body: checkinAPIs,
        };
    } catch (e) {
        context.res = {
            status: e.statusCode,
            error: e.message,
        };
    }
};

export default httpTrigger;
