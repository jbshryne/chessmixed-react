import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import GameplayBoard from "../components/GameplayBoard";
import { useGame } from "../store/game-context";

const Game = () => {
  const { gameId } = useParams();
  const { selectedGame } = useGame();

  console.log(selectedGame);

  //   const currentUser = JSON.parse(
  //     localStorage.getItem("chessmixed_currentUser")
  //   );

  useEffect(() => {
    async function fetchGame() {
      const response = await fetch(`http://localhost:3200/games/${gameId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ userId: currentUser._id }),
      });

      const data = await response.json();
      //   console.log(data);
    }
    fetchGame();
  }, [gameId]);

  return (
    <div>
      <GameplayBoard currentGame={selectedGame} />
    </div>
  );
};

export default Game;
