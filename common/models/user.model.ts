import { TableEntity } from '@azure/data-tables';

export interface UserDB {
    Name: string;
}

export interface UserAPI {
    id?: string;
    name: string;
}

export type UserEntity = TableEntity<UserDB>;
