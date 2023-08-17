import KnexClient, { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import { appendEvent } from './append-event';
import { createStreamsTable } from './create-streams-table';
import { createEventsTable } from './create-events-table';

describe('Appending events', () => {
  let knex: Knex;

  beforeAll(() => {
    knex = KnexClient({
      client: 'pg',
      connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'solarwinds123',
      },
      debug: false, // set to `true` to get useful debugging information in the console
    });
  });

  afterAll(() => {
    knex.destroy();
  })

  it('throws an error if the expected version is wrong', async () => {
    const STREAM_ID = uuid();
    const STREAM_TYPE = 'test-events';

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

    await expect(
      async () => await appendEvent(knex, {
        id: uuid(),
        data: { hello: 'world' },
        expectedVersion: 0,
        streamId: STREAM_ID,
        streamType: STREAM_TYPE,
        type: 'test-event',
      }),
    ).rejects.toThrowError();
  });
});
