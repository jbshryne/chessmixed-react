import { useEffect, useState } from "react";
// import { useGame } from "../store/game-context";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import StatusBox from "../components/StatusBox";
import GameplayBoard from "../components/GameplayBoard";
import EditBoard from "../components/EditBoard";

function Game() {
  // const { selectedGame } = useGame();
  const navigate = useNavigate();
  const selectedGame = JSON.parse(
    localStorage.getItem("chessmixed_selectedGame")
  );

  console.log(selectedGame);

  useEffect(() => {
    if (!selectedGame) {
      console.log("No game selected");
      navigate("/games");
    }
  });

  const [fetchedGame, setFetchedGame] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [status, setStatus] = useState(" to move");
  const [isPlayMode, setIsPlayMode] = useState(true);

  useEffect(() => {
    if (selectedGame) {
      async function fetchData() {
        const response = await fetch(
          `http://localhost:3200/games/${selectedGame._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log(data);
        setFetchedGame(data);
      }

      fetchData();
      socket.emit("joinRoom", `game-${selectedGame._id}`);
    }
  }, []);

  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  useEffect(() => {
    if (fetchedGame) {
      setCurrentTurn(fetchedGame.currentTurn);
    }
  }, [fetchedGame]);

  if (!fetchedGame) {
    return <div>Loading...</div>;
  }

  const opponent =
    fetchedGame.playerWhite.username === currentUser.username
      ? fetchedGame.playerBlack
      : fetchedGame.playerWhite;

  const selfColor =
    fetchedGame.playerWhite.username === currentUser.username ? "w" : "b";

  const opponentColor =
    fetchedGame.playerWhite.username === currentUser.username ? "b" : "w";

  return (
    <div id="game-page">
      <button onClick={() => setIsPlayMode(!isPlayMode)}>
        Toggle Play Mode
      </button>
      {isPlayMode ? (
        <>
          <StatusBox>
            {currentTurn === opponentColor && opponent.displayName + status}
          </StatusBox>
          {fetchedGame && (
            <GameplayBoard
              setCurrentTurn={setCurrentTurn}
              setStatus={setStatus}
              fetchedGame={fetchedGame}
            />
          )}
          <StatusBox>
            {currentTurn === selfColor && currentUser.displayName + status}
          </StatusBox>
        </>
      ) : (
        <>
          {fetchedGame && (
            <EditBoard fetchedGame={fetchedGame} selfColor={selfColor} />
          )}
        </>
      )}
    </div>
  );
}

export default Game;
