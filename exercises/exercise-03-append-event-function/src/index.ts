import KnexClient from 'knex';
import { v4 as uuid } from 'uuid';
import { appendEvent } from './append-event';
import { createEventsTable } from './create-events-table';
import { createStreamsTable } from './create-streams-table';

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
  await appendEvent(knex, {
    id: uuid(),
    data: {},
    expectedVersion: 0,
    streamId: uuid(),
    streamType: 'idk-1000',
    type: 'test-event',
  });
}

main()
  .then(() => {
    console.log('Success!');
    process.exit(0);
  })
  .catch(e => console.error(e));
