import KnexClient, { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import { aggregateStream } from './aggregate-stream';
import { appendEvent } from './append-event';
import { createStreamsTable } from './create-streams-table';
import { createEventsTable } from './create-events-table';

describe('Function `aggregateStream`', () => {
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

  it('returns the correct aggregate for the provided stream ID', async () => {
    const STREAM_ID = uuid();
    const STREAM_TYPE = 'test-events';

    await createStreamsTable(knex);
    await createEventsTable(knex);
    await appendEvent(knex, {
      id: uuid(),
      data: { person2: 'Corin', instrument: 'drums' },
      expectedVersion: 0,
      streamId: STREAM_ID,
      streamType: STREAM_TYPE,
      type: 'test-event',
    });
    await appendEvent(knex, {
      id: uuid(),
      data: { person1: 'Carrie', instrument: 'guitar' },
      expectedVersion: 1,
      streamId: STREAM_ID,
      streamType: STREAM_TYPE,
      type: 'test-event',
    });

    const output = await aggregateStream(knex, STREAM_ID);

    expect(output).toMatchObject({
      person1: 'Carrie',
      person2: 'Corin',
      instrument: 'guitar',
    });
  });
});
