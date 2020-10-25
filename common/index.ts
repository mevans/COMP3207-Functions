import { TableClient, TablesSharedKeyCredential } from '@azure/data-tables';

const account = 'trackandtracestorage2';
const key = 'ZgXwHUFPtLztE5QOjWWXGQH/puanKVdcDPqaaMFNoX+k8TmijYAtv6lgat8XKbzHwFVJcEAvSuyumVZ+2F46+A==';
const url = 'https://trackandtracestorage2.table.core.windows.net';

const credential = new TablesSharedKeyCredential(account, key);
export const usersTableClient = new TableClient(url, 'users', credential);
export const venuesTableClient = new TableClient(url, 'venues', credential);
export const checkinsTableClient = new TableClient(url, 'checkins', credential);
export const defaultPartition = 'Partition';
