import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { sendBid, playCard } from "../../network/socket";
import { useGameStore } from "../../state/gameStore";
import type { Suit, TrickPlay, VisibleHand } from "../../../../shared/src/index.js";
import { Banner } from "../../components/game/Banner";
import { BidDisplay } from "../components/game/BidDisplay";
import { BiddingPanel } from "../components/game/BiddingPanel";
import { CardDealAnimation } from "../components/game/CardDealAnimation";
import { GameButton } from "../components/game/GameButton";
import { GlassPanel } from "../components/game/GlassPanel";
import { InfoBadge } from "../components/game/InfoBadge";
import { InvalidActionFeedback } from "../components/game/InvalidActionFeedback";
import { PlayedCardSlot } from "../components/game/PlayedCardSlot";
import { PlayerSeat, type PlayerData } from "../components/game/PlayerSeat";
import { PlayingHand } from "../components/game/PlayingHand";
import { ReconnectingOverlay } from "../components/game/ReconnectingOverlay";
import { ScoringResultPanel } from "../components/game/ScoringResultPanel";
import { TurnIndicator } from "../components/game/TurnIndicator";
import { gameTheme } from "../theme";

const SUIT_SYMBOL: Record<string, string> = { S: "♠", H: "♥", D: "♦", C: "♣" };

function slotPlays(
  meIdx: number,
  players: ReadonlyArray<{ id: string }>,
  plays: ReadonlyArray<TrickPlay>
): [TrickPlay | null, TrickPlay | null, TrickPlay | null, TrickPlay | null] {
  const s: [TrickPlay | null, TrickPlay | null, TrickPlay | null, TrickPlay | null] = [null, null, null, null];
  for (const p of plays) {
    const idx = players.findIndex((x) => x.id === p.playerId);
    if (idx < 0) continue;
    const rel = (idx - meIdx + 4) % 4;
    s[rel] = p;
  }
  return s;
}

export function GameScreen() {
  const roomId = useGameStore((s) => s.currentRoomId);
  const gs = useGameStore((s) => s.gameState);
  const me = useGameStore((s) => s.playerId);
  const myHand = useGameStore((s) => s.myHand);
  const tableCards = useGameStore((s) => s.tableCards);
  const clientPhase = useGameStore((s) => s.clientPhase);
  const trump = useGameStore((s) => s.trump);
  const currentTurnPlayerId = useGameStore((s) => s.currentTurnPlayerId);
  const invalid = useGameStore((s) => s.invalidMoveMessage);
  const connectionStatus = useGameStore((s) => s.connectionStatus);
  const resetToLobby = useGameStore((s) => s.resetToLobby);
  const resetToRoom = useGameStore((s) => s.resetToRoom);

  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  if (!roomId || !gs || !me) return null;

  const isMyTurn = currentTurnPlayerId === me;
  const myPlayer = gs.players.find((p) => p.id === me);
  const currentTurnPlayer = currentTurnPlayerId ? gs.players.find((p) => p.id === currentTurnPlayerId) : null;

  const handCounts = Object.fromEntries(
    gs.players.map((p) => {
      const h = (gs.handsByPlayerId as Record<string, VisibleHand>)[p.id];
      if (!h || !("kind" in h)) return [p.id, 0];
      return [p.id, h.kind === "hidden" ? h.count : h.kind === "visible" ? h.cards.length : 0];
    })
  );

  const completedTricksCount = (gs.play?.completedTricks?.length ?? 0) as number;
  const trickNumber = Math.min(12, completedTricksCount + 1);

  const phaseLabel =
    gs.phase === "DEAL"
      ? "Dealing"
      : gs.phase === "BIDDING"
        ? "Bidding"
        : gs.phase === "PLAY"
          ? `Trick ${trickNumber}/12`
          : gs.phase === "SCORING"
            ? "Results"
            : "—";

  const highestBid = gs.bidding?.highestBid ?? null;
  const myTeamId = myPlayer?.teamId ?? null;
  const bidderTeamId = highestBid ? gs.players.find((p) => p.id === highestBid.bidderId)?.teamId ?? null : null;
  const canDoubleOrRedouble =
    Boolean(highestBid) &&
    myTeamId !== null &&
    bidderTeamId !== null &&
    ((gs.bidding?.multiplier === 1 && myTeamId !== bidderTeamId) || (gs.bidding?.multiplier === 2 && myTeamId === bidderTeamId));

  const minBid = highestBid ? highestBid.amount + 1 : 28;

  const { tricksUs, tricksThem } = useMemo(() => {
    let u = 0;
    let t = 0;
    if (gs.phase === "PLAY" && gs.play?.completedTricks && myTeamId !== null) {
      for (const tr of gs.play.completedTricks) {
        const w = gs.players.find((p) => p.id === tr.winnerId)?.teamId;
        if (w === myTeamId) u++;
        else if (w !== undefined && w !== null) t++;
      }
    }
    return { tricksUs: u, tricksThem: t };
  }, [gs.phase, gs.play?.completedTricks, gs.players, myTeamId]);

  const meIdx = Math.max(0, gs.players.findIndex((p) => p.id === me));
  const order = [...gs.players.slice(meIdx), ...gs.players.slice(0, meIdx)];
  const bottomP = order[0]!;
  const leftP = order[1]!;
  const topP = order[2]!;
  const rightP = order[3]!;

  const slots = slotPlays(meIdx, gs.players, tableCards);
  const names = Object.fromEntries(gs.players.map((p) => [p.id, p.name]));

  const trumpShown: Suit | null = trump ?? highestBid?.trump ?? null;
  const bidDisplayTrump: Suit = trumpShown ?? "S";
  const declarerId = gs.phase === "PLAY" && highestBid ? highestBid.bidderId : null;

  const toSeat = (p: (typeof gs.players)[0]): PlayerData => ({
    id: p.id,
    name: p.name,
    isReady: true
  });

  const prevTurnRef = useRef<string | null>(null);
  useEffect(() => {
    const prev = prevTurnRef.current;
    if (prev !== currentTurnPlayerId && currentTurnPlayerId === me) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    prevTurnRef.current = currentTurnPlayerId ?? null;
  }, [currentTurnPlayerId, me]);

  return (
    <View style={{ flex: 1, backgroundColor: gameTheme.gameBgDark }}>
      <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, overflow: "hidden" }}>
        <LinearGradient
          colors={["rgba(0,255,136,0.06)", "transparent"]}
          style={{ position: "absolute", width: 700, height: 700, borderRadius: 350, top: "18%", left: "50%", marginLeft: -350 }}
        />
      </View>

      <View style={{ paddingTop: 12, paddingHorizontal: 14, zIndex: 20 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, flex: 1 }}>
            <InfoBadge label="Room" value={roomId} variant="default" />
            <InfoBadge
              label="Trump"
              value={trumpShown ? SUIT_SYMBOL[trumpShown] ?? trumpShown : "—"}
              variant="highlight"
            />
            <InfoBadge label="Phase" value={phaseLabel} variant="default" />
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <InfoBadge label="Your Team" value={`${tricksUs} tricks`} variant="highlight" icon={<Text style={{ color: "#fff" }}>🏆</Text>} />
            <InfoBadge label="Opponents" value={`${tricksThem} tricks`} variant="default" />
          </View>
        </View>
        <Text style={{ marginTop: 8, fontSize: 12, fontWeight: "800", color: isMyTurn ? gameTheme.brandGreen : gameTheme.textMuted }}>
          {isMyTurn ? "Your turn" : `Waiting for ${currentTurnPlayer?.name ?? "player"}…`}
        </Text>
        <Text style={{ marginTop: 4, fontSize: 11, color: gameTheme.textFaint }}>{connectionStatus}</Text>
        {connectionStatus !== "connected" && connectionStatus !== "reconnecting" ? (
          <Banner tone="warn" message="Reconnecting… (state will restore automatically)" />
        ) : null}
      </View>

      {invalid ? <InvalidActionFeedback message={invalid} /> : null}

      <ReconnectingOverlay
        visible={connectionStatus === "reconnecting" || (connectionStatus === "disconnected" && Boolean(gs))}
        isReconnecting={connectionStatus === "reconnecting"}
      />

      <BidDisplay
        visible={Boolean(highestBid && gs.phase !== "SCORING")}
        playerName={highestBid ? gs.players.find((p) => p.id === highestBid.bidderId)?.name ?? "Bidder" : ""}
        bidAmount={highestBid?.amount ?? 0}
        trumpSuit={highestBid?.trump ?? bidDisplayTrump}
      />

      <TurnIndicator
        visible={gs.phase === "PLAY"}
        isYourTurn={isMyTurn}
        {...(!isMyTurn && currentTurnPlayer?.name ? { currentPlayer: currentTurnPlayer.name } : {})}
      />

      <CardDealAnimation active={gs.phase === "DEAL"} />

      <View style={{ flex: 1, marginTop: 8, minHeight: 400 }}>
        <View style={{ position: "absolute", top: 8, left: 0, right: 0, alignItems: "center", zIndex: 5 }}>
          <PlayerSeat
            player={toSeat(topP)}
            position="top"
            isActive={currentTurnPlayerId === topP.id}
            cardCount={handCounts[topP.id] ?? 0}
            isDeclarer={declarerId === topP.id}
          />
        </View>
        <View style={{ position: "absolute", left: 8, top: "34%", zIndex: 5 }}>
          <PlayerSeat
            player={toSeat(leftP)}
            position="left"
            isActive={currentTurnPlayerId === leftP.id}
            cardCount={handCounts[leftP.id] ?? 0}
            isDeclarer={declarerId === leftP.id}
          />
        </View>
        <View style={{ position: "absolute", right: 8, top: "34%", zIndex: 5 }}>
          <PlayerSeat
            player={toSeat(rightP)}
            position="right"
            isActive={currentTurnPlayerId === rightP.id}
            cardCount={handCounts[rightP.id] ?? 0}
            isDeclarer={declarerId === rightP.id}
          />
        </View>

        <View
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            top: "24%",
            bottom: clientPhase === "playing" ? 200 : clientPhase === "bidding" && !isMyTurn ? 120 : 160,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <View style={{ width: "100%", maxWidth: 380, height: 280, alignItems: "center", justifyContent: "center", position: "relative" }}>
            <LinearGradient
              colors={["rgba(255,107,53,0.08)", "rgba(0,255,136,0.06)"]}
              style={{
                position: "absolute",
                width: 280,
                height: 280,
                borderRadius: 140,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)"
              }}
            />
            <PlayedCardSlot card={slots[0]?.card ?? null} position="bottom" {...(slots[0] ? { playerName: names[slots[0].playerId] } : {})} />
            <PlayedCardSlot card={slots[1]?.card ?? null} position="left" {...(slots[1] ? { playerName: names[slots[1].playerId] } : {})} />
            <PlayedCardSlot card={slots[2]?.card ?? null} position="top" {...(slots[2] ? { playerName: names[slots[2].playerId] } : {})} />
            <PlayedCardSlot card={slots[3]?.card ?? null} position="right" {...(slots[3] ? { playerName: names[slots[3].playerId] } : {})} />
            {gs.phase === "BIDDING" ? (
              <Text style={{ position: "absolute", bottom: 20, color: gameTheme.textFaint, fontSize: 12 }}>Bidding in progress…</Text>
            ) : null}
            {gs.phase === "DEAL" ? (
              <Text style={{ position: "absolute", bottom: 20, color: gameTheme.brandAmber, fontSize: 13, fontWeight: "800" }}>Dealing cards…</Text>
            ) : null}
          </View>
        </View>

        <View style={{ position: "absolute", bottom: clientPhase === "playing" ? 150 : 24, left: 0, right: 0, alignItems: "center", zIndex: 5 }}>
          <PlayerSeat
            player={toSeat(bottomP)}
            position="bottom"
            isActive={currentTurnPlayerId === bottomP.id}
            cardCount={handCounts[bottomP.id] ?? 0}
            isDeclarer={declarerId === bottomP.id}
          />
        </View>
      </View>

      {clientPhase === "bidding" && !isMyTurn && currentTurnPlayer ? (
        <View style={{ position: "absolute", left: 14, right: 14, bottom: 100, zIndex: 25 }}>
          <GlassPanel style={{ paddingVertical: 14, paddingHorizontal: 16, alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: gameTheme.textMuted, fontWeight: "700" }}>Bidding</Text>
            <Text style={{ fontSize: 14, color: "#fff", fontWeight: "800", marginTop: 4, textAlign: "center" }}>
              Waiting for {currentTurnPlayer.name} to bid…
            </Text>
          </GlassPanel>
        </View>
      ) : null}

      {clientPhase === "bidding" && isMyTurn ? (
        <BiddingPanel
          currentBid={highestBid?.amount ?? 0}
          minBid={minBid}
          onPass={() => sendBid({ roomId, action: "Pass" })}
          onDouble={() => sendBid({ roomId, action: "Double" })}
          canDouble={canDoubleOrRedouble}
          onBid={(amount, t) => sendBid({ roomId, action: "Bid", amount, trump: t })}
        />
      ) : null}

      {clientPhase === "playing" ? (
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, paddingBottom: 8, zIndex: 30 }}>
          <GlassPanel style={{ marginHorizontal: 14, paddingVertical: 12, paddingHorizontal: 10 }}>
            <PlayingHand
              cards={myHand}
              enabled={isMyTurn}
              selectedUid={selectedUid}
              onSelect={setSelectedUid}
              onPlay={() => {}}
            />
            {selectedUid && isMyTurn ? (
              <View style={{ marginTop: 10 }}>
                <GameButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  onPress={() => {
                    if (selectedUid) {
                      playCard(roomId, selectedUid);
                      setSelectedUid(null);
                    }
                  }}
                >
                  Play Card
                </GameButton>
              </View>
            ) : null}
          </GlassPanel>
        </View>
      ) : null}

      {clientPhase === "scoring" && gs.score ? (
        <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 50, backgroundColor: "rgba(0,0,0,0.72)" }}>
          <ScoringResultPanel
            score={gs.score}
            players={gs.players}
            myTeamId={myPlayer?.teamId ?? 0}
            onPlayAgain={resetToRoom}
            onReturnToLobby={resetToLobby}
          />
        </View>
      ) : null}
    </View>
  );
}
