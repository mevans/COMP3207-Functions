import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { UserEntity } from '../common/models/user.model';
import { checkinsTableClient, usersTableClient } from '../common';
import { CheckinEntity } from '../common/models/checkin.model';
import { flatMap, uniq } from 'lodash';
import { queryList, uniqueByPartitionAndRowKey } from '../common/functions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const startDate = req.query['start'];
    const endDate = req.query['end'];
    let dateQuery = '';
    // Search for reports between the two queried dates
    if (startDate && endDate) {
        dateQuery = ` and (ReportDate ge datetime'${new Date(startDate).toISOString()}' and ReportDate le datetime'${new Date(endDate).toISOString()}')`;
    }
    // Get all reported users
    const reportedUsers = await queryList<UserEntity>(usersTableClient, `(Reported eq true)${dateQuery}`);
    // Get all checkins which reported users visited
    const primaryAffectedCheckins = uniqueByPartitionAndRowKey<CheckinEntity>(flatMap<CheckinEntity>(await Promise.all(
        reportedUsers.map(u => queryList(checkinsTableClient, `User eq '${ u.rowKey }'`)),
    )));
    // Get all checkins at the same venue as those ^ and which overlap any days
    const secondaryAffectedCheckins = uniqueByPartitionAndRowKey<CheckinEntity>(flatMap<CheckinEntity>(await Promise.all(
        primaryAffectedCheckins.map(c => queryList(checkinsTableClient, `(PartitionKey eq '${ c.partitionKey }') and not (Arrive gt datetime'${ c.Leave.toISOString() }' or Leave lt datetime'${ c.Arrive.toISOString() }')`))
    )));
    // Return the users
    const users: string[] = uniq(secondaryAffectedCheckins.map(c => c.User));
    context.res = {
        status: 200,
        body: { users },
    };
};

export default httpTrigger;
