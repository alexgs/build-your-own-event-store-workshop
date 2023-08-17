import KnexClient from 'knex';
import { createStreamsTable } from './create-streams-table';
import { createEventsTable } from './create-events-table';

async function main() {
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

  await createStreamsTable(knex);
  await createEventsTable(knex);
}

main()
  .then(() => {
    console.log('Success!');
    process.exit(0);
  })
  .catch(e => console.error(e));
