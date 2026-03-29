export type RoomId = string;
export type SeatIndex = 0 | 1 | 2 | 3;

export type ConnectedPlayer = Readonly<{
  seat: SeatIndex;
  playerId: string;
  name: string;
  socketId: string;
}>;

export type ReservedSeat = Readonly<{
  seat: SeatIndex;
  playerId: string;
  name: string;
  reservedUntilMs: number;
}>;

