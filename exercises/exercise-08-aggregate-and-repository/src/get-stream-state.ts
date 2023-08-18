import { Knex } from 'knex';

export async function getStreamState(knex: Knex, streamId: string) {
  const result = await knex('streams').select().where('id', streamId);
  return result[0];
}
