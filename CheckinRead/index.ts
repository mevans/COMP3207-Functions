import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { checkinsTableClient } from '../common';
import { CheckinAPI, CheckinEntity } from '../common/models/checkin.model';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Return all checkins
    const checkinAPIS: CheckinAPI[] = [];
    const checkinEntitiesIter = checkinsTableClient.listEntities<CheckinEntity>();
    for await (const checkin of checkinEntitiesIter) {
        checkinAPIS.push({
            venue: checkin.partitionKey,
            id: checkin.rowKey,
            user: checkin.User,
            arrive: checkin.Arrive,
            leave: checkin.Leave,
        });
    }
    context.res = {
        status: 200,
        body: checkinAPIS,
    };
};

export default httpTrigger;