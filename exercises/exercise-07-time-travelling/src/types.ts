export interface Event {
  id: string;
  data: object;
  expectedVersion: number;
  streamId: string;
  streamType: string;
  type: string;
}
