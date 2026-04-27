/** Player identity types; TeamId (0 or 1) is derived at game-start from seat index (seats 0/2 → team 0, seats 1/3 → team 1). */
export type PlayerId = string;
export type TeamId = 0 | 1;

export type Player = Readonly<{
  id: PlayerId;
  name: string;
  teamId: TeamId;
}>;

