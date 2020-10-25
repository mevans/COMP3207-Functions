import { TableEntity } from '@azure/data-tables';

export interface CheckinDB {
    User: string;
    Arrive: Date;
    Leave: Date;
}

export interface CheckinAPI {
    id?: string;
    venue: string;
    user: string;
    arrive: string;
    leave: string;
}

export type CheckinEntity = TableEntity<CheckinDB>;
