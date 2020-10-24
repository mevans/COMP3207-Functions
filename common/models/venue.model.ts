import { TableEntity } from '@azure/data-tables';

export interface VenueDB {
    Name: string;
}

export interface VenueAPI {
    id?: string;
    name: string;
}

export type VenueEntity = TableEntity<VenueDB>;
