import { Knex } from 'knex';
import { Event } from './types';

async function getEventsBeforeTimestamp(
  knex: Knex,
  streamId: string,
  timestamp: Date,
): Promise<Event[]> {
  return knex('events')
    .select()
    .where('stream_id', streamId)
    .where('created_at', '<', timestamp);
}

async function getEventsBeforeVersion(
  knex: Knex,
  streamId: string,
  version: number,
): Promise<Event[]> {
  return knex('events')
    .select()
    .where('stream_id', streamId)
    .where('version', '<', version);
}

export async function getEventsBefore(
  knex: Knex,
  streamId: string,
  timestamp: Date,
): Promise<Event[]>;
export async function getEventsBefore(
  knex: Knex,
  streamId: string,
  version: number,
): Promise<Event[]>;
export async function getEventsBefore(
  knex: Knex,
  streamId: string,
  timestampOrVersion: Date | number,
): Promise<Event[]> {
  if (typeof timestampOrVersion === 'number') {
    const version = timestampOrVersion as number;
    return getEventsBeforeVersion(knex, streamId, version);
  } else {
    const timestamp = timestampOrVersion as Date;
    return getEventsBeforeTimestamp(knex, streamId, timestamp);
  }
}
