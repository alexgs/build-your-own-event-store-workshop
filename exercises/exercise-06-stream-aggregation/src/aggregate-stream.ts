import { Knex } from 'knex';
import { getEvents } from './get-events';

export async function aggregateStream(knex: Knex, streamId: string) {
  const events = await getEvents(knex, streamId);
  return events.reduce((result, event) => {
    return {
      ...result,
      ...event.data,
    };
  }, {});
}
