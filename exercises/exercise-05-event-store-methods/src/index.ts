import KnexClient from 'knex';
import { v4 as uuid } from 'uuid';
import { appendEvent } from './append-event';
import { createEventsTable } from './create-events-table';
import { createStreamsTable } from './create-streams-table';

// This is an example "happy path" execution. See `index.test.ts` for more
//   tests and usage information.
async function main() {
  const STREAM_ID = uuid();
  const STREAM_TYPE = 'test-events';

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
    data: { hello: 'world' },
    expectedVersion: 0,
    streamId: STREAM_ID,
    streamType: STREAM_TYPE,
    type: 'test-event',
  });

  await knex.destroy();
}

main()
  .then(() => {
    console.log('Success!');
    process.exit(0);
  })
  .catch(e => console.error(e));
