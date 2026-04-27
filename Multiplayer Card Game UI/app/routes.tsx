// Client-side route table: maps URL patterns to screen components; all four game phases have their own route.
import { createBrowserRouter } from "react-router";
import { LobbyScreen } from "./screens/LobbyScreen";
import { RoomScreen } from "./screens/RoomScreen";
import { GameScreen } from "./screens/GameScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { NotFoundScreen } from "./screens/NotFoundScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LobbyScreen,
  },
  {
    path: "/room/:roomCode",
    Component: RoomScreen,
  },
  {
    path: "/game/:roomCode",
    Component: GameScreen,
  },
  {
    path: "/result/:roomCode",
    Component: ResultScreen,
  },
  {
    path: "*",
    Component: NotFoundScreen,
  },
]);