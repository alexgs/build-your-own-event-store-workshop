import { Knex } from 'knex';

export async function createStreamTable(knex: Knex) {
  knex.schema.createTable('streams', (table) => {
    table.uuid('id').primary();
    table.string('type');
    table.increments('version');
  }).toSQL();
}
