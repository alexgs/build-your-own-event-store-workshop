import { Knex } from 'knex';

export async function getEvents(knex: Knex, streamId: string) {
  return knex('events').select().where('stream_id', streamId);
}
