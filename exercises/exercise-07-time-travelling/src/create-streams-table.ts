import { Knex } from 'knex';

export async function createStreamsTable(knex: Knex) {
  const exists = await knex.schema.hasTable('streams');
  if (!exists) {
    await knex.schema.createTable('streams', (table) => {
      table.uuid('id').primary();
      table.text('type');
      table.bigint('version');
    });
  }
}
