import KnexClient from 'knex';
import { createStreamsTable } from './create-streams-table';

const knex = KnexClient({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'solarwinds123',
  },
  debug: true,
});

createStreamsTable(knex)
  .then(() => {
    console.log('Success!');
    process.exit(0);
  })
  .catch(e => console.error(e));
