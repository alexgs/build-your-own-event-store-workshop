import { Knex } from 'knex';

export async function createEventsTable(knex: Knex) {
  const exists = await knex.schema.hasTable('events');
  if (!exists) {
    await knex.schema.createTable('events', (table) => {
      table.uuid('id').primary();
      table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
      table.jsonb('data');
      table.uuid('stream_id');
      table.text('type');
      table.bigint('version');
    });
  }
}
