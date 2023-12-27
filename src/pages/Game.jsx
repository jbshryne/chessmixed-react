import { useState } from "react";
import { useGame } from "../store/game-context";
import StatusBox from "../components/StatusBox";
import GameplayBoard from "../components/GameplayBoard";

function Game() {
  const { selectedGame } = useGame();
  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );
  const opponent =
    selectedGame.playerWhite.username === currentUser.username
      ? selectedGame.playerBlack
      : selectedGame.playerWhite;

  const [currentTurn, setCurrentTurn] = useState(selectedGame.currentTurn);
  const [status, setStatus] = useState(" to move");

  const selfColor =
    selectedGame.playerWhite.username === currentUser.username ? "w" : "b";

  const opponentColor =
    selectedGame.playerWhite.username === currentUser.username ? "b" : "w";

  return (
    <div id="game-page">
      <StatusBox>
        {currentTurn === opponentColor && opponent.displayName + status}
      </StatusBox>
      <GameplayBoard setCurrentTurn={setCurrentTurn} setStatus={setStatus} />
      <StatusBox>
        {currentTurn === selfColor && currentUser.displayName + status}
      </StatusBox>
    </div>
  );
}

export default Game;
