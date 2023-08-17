import KnexClient, { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import { appendEvent } from './append-event';
import { createStreamsTable } from './create-streams-table';
import { createEventsTable } from './create-events-table';
import { getStreamState } from './get-stream-state';

describe('Function `getStreamState`', () => {
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
  });

  it('returns the state of the provided stream ID', async () => {
    const STREAM_ID = uuid();
    const STREAM_TYPE = 'test-events';

    await createStreamsTable(knex);
    await createEventsTable(knex);
    await appendEvent(knex, {
      id: uuid(),
      data: { hello: 'Corrine' },
      expectedVersion: 0,
      streamId: STREAM_ID,
      streamType: STREAM_TYPE,
      type: 'test-event',
    });
    await appendEvent(knex, {
      id: uuid(),
      data: { hello: 'Carrie' },
      expectedVersion: 1,
      streamId: STREAM_ID,
      streamType: STREAM_TYPE,
      type: 'test-event',
    });

    const output = await getStreamState(knex, STREAM_ID);

    expect(output).toMatchObject({
      id: STREAM_ID,
      type: STREAM_TYPE,
      version: '2',
    });
  });
});
