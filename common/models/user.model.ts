import { TableEntity } from '@azure/data-tables';

export interface User {
    FirstName: string;
    LastName: string;
}

export type UserEntity = TableEntity<User>;
