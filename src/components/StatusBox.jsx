import React from "react";
import { useGame } from "../store/game-context";

const StatusBox = ({ player }) => {
  const { selectedGame } = useGame();
  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  console.log(selectedGame, player, currentUser);

  const playerWhiteName = selectedGame.playerWhite
    ? selectedGame.playerWhite.displayName
    : "PlayerWhite";
  const playerBlackName = selectedGame.playerBlack
    ? selectedGame.playerBlack.displayName
    : "PlayerBlack";

  let playerName;

  if (player === "self") {
    playerName =
      currentUser.username === selectedGame.playerWhite.username
        ? playerWhiteName
        : playerBlackName;
  } else {
    playerName =
      currentUser.username === selectedGame.playerWhite.username
        ? playerBlackName
        : playerWhiteName;
  }

  return <div className="status-box">{playerName}</div>;
};

export default StatusBox;
