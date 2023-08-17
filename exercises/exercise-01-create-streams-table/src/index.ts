import KnexClient from 'knex';
import { createStreamTable } from './create-streams-table';

const knex = KnexClient({ client: 'pg' });

createStreamTable(knex)
  .then(() => process.exit(0))
  .catch(e => console.error(e));
