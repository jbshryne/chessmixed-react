import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useGame } from "../store/game-context";
import { socket } from "../socket";
import { Chessboard } from "react-chessboard";

const Games = () => {
  const [allGames, setAllGames] = useState([]);
  // const { setGame } = useGame();
  const navigate = useNavigate();

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
    console.log(selectedGame);
    socket.emit("joinRoom", `game-${selectedGame._id}`);
    // setGame(selectedGame);
    localStorage.setItem(
      "chessmixed_selectedGame",
      JSON.stringify(selectedGame)
    );
    navigate(`/game`);
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

  const handleCreateGame = async () => {
    const response = await fetch("http://localhost:3200/games/create", {
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

    if (data.success) {
      const updatedGames = [...allGames, data.game];
      setAllGames(updatedGames);
    }
  };

  const handleDeleteGame = async (gameId) => {
    const response = await fetch("http://localhost:3200/games/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId,
        // currentUser,
      }),
      gameId,
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
      const updatedGames = allGames.filter((game) => game._id !== gameId);
      setAllGames(updatedGames);
    }
  };

  return (
    <div id="games-page">
      <h1>{currentUser.displayName}'s Games</h1>
      <button onClick={handleCreateGame}>create new game</button>

      <ul id="games-container">
        {allGames.map((game, idx) => {
          return (
            <li className="game-container" key={game._id}>
              <h4>Game {idx + 1}</h4>
              <div
                className="board-container"
                onClick={() => handleGameSelection(game)}
              >
                <Chessboard
                  className="game-thumbnail"
                  position={game.fen}
                  boardWidth={250}
                  boardOrientation={
                    game.playerWhite &&
                    game.playerWhite.playerId === currentUser._id
                      ? "white"
                      : "black"
                  }
                  arePiecesDraggable={false}
                />
              </div>
              <div className="controls">
                <button onClick={() => handleGameSelection(game)}>PLAY</button>
                <button>EDIT</button>
                <button onClick={() => handleDeleteGame(game._id)}>
                  DELETE
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <button onClick={handleSeedGames}>Seed Games</button>
    </div>
  );
};

export default Games;
