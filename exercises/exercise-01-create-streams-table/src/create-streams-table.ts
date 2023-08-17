import { Knex } from 'knex';

export async function createStreamTable(knex: Knex) {
  await knex.schema.createTable('streams', (table) => {
    table.uuid('id').primary();
    table.text('type');
    table.bigint('version');
  });
}
