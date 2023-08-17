import { Knex } from 'knex';
import { Event } from './types';

export async function appendEvent(knex: Knex, event: Event) {
  await knex.transaction(async (trx) => {
    // Insert into stream table if there is no stream with provided streamId
    let streamRecord = await trx('streams').select().where('id', event.streamId);
    if (streamRecord.length === 0) {
      await trx('streams').insert({
        id: event.streamId,
        type: event.streamType,
        version: 0,
      });
      streamRecord = await trx('streams').select().where('id', event.streamId);
    }

    // Using `parseInt` because "Note that bigint data is returned as a string
    //   in queries because JavaScript may be unable to parse them without loss
    //   of precision" (see https://knexjs.org/guide/schema-builder.html#biginteger).
    if (parseInt(streamRecord[0].version) !== event.expectedVersion) {
      throw new Error(`Stream version ${streamRecord[0].version} and expected version ${event.expectedVersion} do not match.`);
    }

    // Insert new row into events table with version equal to expected_stream_version + 1
    await trx('events').insert({
      id: event.id,
      data: event.data,
      stream_id: event.streamId,
      type: event.type,
      version: event.expectedVersion + 1,
    });

    // Update stream version with expected_stream_version + 1
    await trx('streams').where('id', event.streamId).update({
      version: event.expectedVersion + 1,
    });
  });
}
