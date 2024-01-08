import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGame } from "../store/game-context";
// import { socket } from "../socket";
import { Chessboard } from "react-chessboard";

const Games = () => {
  const [allGames, setAllGames] = useState([]);
  const { setGameMode } = useGame();
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/games`, {
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
    localStorage.setItem(
      "chessmixed_selectedGame",
      JSON.stringify(selectedGame)
    );
    setGameMode("play");
    navigate(`/game`);
  };

  const handleSeedGames = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/seed`, {
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

  // const handleCreateGame = async () => {
  //   const response = await fetch(
  //     `${process.env.REACT_APP_API_URL}/games/create`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         currentUser,
  //       }),
  //     }
  //   );

  //   const data = await response.json();
  //   console.log(data);

  //   if (data.success) {
  //     const updatedGames = [...allGames, data.game];
  //     setAllGames(updatedGames);
  //   }
  // };

  const handleEditGame = (gameId) => {
    const selectedGame = allGames.find((game) => game._id === gameId);
    localStorage.setItem(
      "chessmixed_selectedGame",
      JSON.stringify(selectedGame)
    );
    setGameMode("edit");
    navigate(`/game`);
  };

  const handleDeleteGame = async (gameId) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/games/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
        }),
      }
    );

    const data = await response.json();
    console.log(data);

    if (data.success) {
      window.location.reload();
      //   const updatedGames = allGames.filter((game) => game._id !== gameId);
      //   setAllGames(updatedGames);
    }
  };

  return (
    <div id="games-page">
      <h1>{currentUser.displayName}'s Games</h1>
      <Link to="/new">
        <button>new game</button>
      </Link>

      <ul id="games-container">
        {allGames.map((game, idx) => {
          let opponentName;
          if (game.playerWhite.playerId === game.playerBlack.playerId) {
            opponentName = "none";
          } else if (game.playerWhite.playerId === currentUser._id) {
            opponentName = game.playerBlack.displayName;
          } else {
            opponentName = game.playerWhite.displayName;
          }

          return (
            <li className="game-container" key={game._id}>
              {/* <h4>Game {idx + 1}</h4> */}
              <h3>Opponent: {opponentName}</h3>
              <div
                className="board-container"
                onClick={() => handleGameSelection(game)}
              >
                <Chessboard
                  className="game-thumbnail"
                  position={game.fen}
                  boardWidth={160}
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
                <button onClick={() => handleEditGame(game._id)}>EDIT</button>
                <button onClick={() => handleDeleteGame(game._id)}>
                  DELETE
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="controls">
        <button onClick={handleSeedGames}>Seed Games</button>
      </div>
    </div>
  );
};

export default Games;
