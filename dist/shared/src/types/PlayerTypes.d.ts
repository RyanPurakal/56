export type PlayerId = string;
export type TeamId = 0 | 1;
export type Player = Readonly<{
    id: PlayerId;
    name: string;
    teamId: TeamId;
}>;
