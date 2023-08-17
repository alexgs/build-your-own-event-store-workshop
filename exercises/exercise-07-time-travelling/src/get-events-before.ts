import { Knex } from 'knex';
import { Event } from './types';

export async function getEventsBefore(
  knex: Knex,
  streamId: string,
  version: number,
): Promise<Event[]>;
export async function getEventsBefore(
  knex: Knex,
  streamId: string,
  timestamp: Date,
): Promise<Event[]>;
export async function getEventsBefore(
  knex: Knex,
  streamId: string,
  timestampOrVersion: Date | number,
): Promise<Event[]> {
  return knex('events').select().where('stream_id', streamId);
}
