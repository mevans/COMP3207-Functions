import { TableEntity } from '@azure/data-tables';

export interface UserDB {
    FirstName: string;
    LastName: string;
}

export interface UserAPI {
    id?: string;
    first_name: string;
    last_name: string;
}

export type UserEntity = TableEntity<UserDB>;
