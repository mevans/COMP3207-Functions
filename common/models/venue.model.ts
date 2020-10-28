import { TableEntity } from '@azure/data-tables';

export interface VenueDB {
    Name: string;
    Address: string;
    Postcode: string;
}

export interface VenueAPI {
    id?: string;
    name: string;
    address: string;
    postcode: string;
}

export type VenueEntity = TableEntity<VenueDB>;
