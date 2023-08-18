import KnexClient, { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import { appendEvent } from './append-event';
import { createStreamsTable } from './create-streams-table';
import { createEventsTable } from './create-events-table';
import { getEventsBefore } from './get-events-before';

describe('Function `getEventsBefore`', () => {
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

  it('returns all events for the stream before the version', async () => {
    const STREAM_ID = uuid();
    const STREAM_TYPE = 'test-events';

    await createStreamsTable(knex);
    await createEventsTable(knex);
    await appendEvent(knex, {
      id: uuid(),
      data: { hello: 'Corin' },
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

    const output = await getEventsBefore(knex, STREAM_ID, 2);

    expect(output.length).toEqual(1);
    expect(output[0]).toMatchObject({
      data: { hello: 'Corin' },
      stream_id: STREAM_ID,
      type: 'test-event',
      version: '1',
    });
  });

  it('returns all events for the stream before the timestamp', async () => {
    const STREAM_ID = uuid();
    const STREAM_TYPE = 'test-events';

    await createStreamsTable(knex);
    await createEventsTable(knex);
    await appendEvent(knex, {
      id: uuid(),
      data: { hello: 'Corin' },
      expectedVersion: 0,
      streamId: STREAM_ID,
      streamType: STREAM_TYPE,
      type: 'test-event',
    });
    await new Promise((resolve) => setTimeout(() => resolve(null), 100)); // Sleep
    const mark = new Date();
    await new Promise((resolve) => setTimeout(() => resolve(null), 500)); // Sleep
    await appendEvent(knex, {
      id: uuid(),
      data: { hello: 'Carrie' },
      expectedVersion: 1,
      streamId: STREAM_ID,
      streamType: STREAM_TYPE,
      type: 'test-event',
    });

    const output = await getEventsBefore(knex, STREAM_ID, mark);

    expect(output.length).toEqual(1);
    expect(output[0]).toMatchObject({
      data: { hello: 'Corin' },
      stream_id: STREAM_ID,
      type: 'test-event',
      version: '1',
    });
  });
});
