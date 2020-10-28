import { TableEntity } from '@azure/data-tables';

export interface UserDB {
    Name: string;
    Email: string;
    Phone: string;
    Address: string;
}

export interface UserAPI {
    id?: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export type UserEntity = TableEntity<UserDB>;
