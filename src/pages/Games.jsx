import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGame } from "../store/game-context";
import { Chessboard } from "react-chessboard";

const Games = () => {
  const [allGames, setAllGames] = useState([]);
  const { setGame } = useGame();

  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:3200/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser._id }),
      });

      const data = await response.json();
      console.log(data);
      setAllGames(data);
    }
    fetchData();
  }, [currentUser._id]);

  const handleGameSelection = (selectedGame) => {
    // console.log(selectedGame);

    // ???

    setGame(selectedGame);
  };

  const handleSeedGames = async () => {
    const response = await fetch("http://localhost:3200/games/seed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentUser,
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <div id="games-page">
      <h1>{currentUser.displayName}'s Games</h1>
      <ul id="games-container">
        {allGames.map((game, idx) => {
          return (
            <Link to={`/game`} key={game._id}>
              <li
                className="game-thumbnail"
                onClick={() => handleGameSelection(game)}
              >
                <h4>Game {idx + 1}</h4>
                <Chessboard
                  position={game.fen}
                  boardWidth={250}
                  boardOrientation={
                    game.playerBlack &&
                    game.playerBlack.playerId === currentUser._id
                      ? "black"
                      : "white"
                  }
                  arePiecesDraggable={false}
                />
              </li>
            </Link>
          );
        })}
      </ul>
      <button onClick={handleSeedGames}>Seed Games</button>
    </div>
  );
};

export default Games;
