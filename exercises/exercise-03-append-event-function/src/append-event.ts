import { Knex } from 'knex';

interface Event {
  id: string;
  data: object;
  expectedVersion: number;
  streamId: string;
  streamType: string;
  type: string;
}

export async function appendEvent(knex: Knex, event: Event) {
  await knex.transaction(async (trx) => {
    // Insert into stream table if there is no stream with provided streamId
    const streamRecord = await trx('streams').select().where('id', event.streamId);
    if (streamRecord.length === 0) {
      await trx('streams').insert({
        id: event.streamId,
        type: event.streamType,
        version: 0
      });
    }

    // Insert new row into events table with version equal to expected_stream_version + 1
    // Update stream version with expected_stream_version + 1
  });
}
