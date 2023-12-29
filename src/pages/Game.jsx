import { useEffect, useState } from "react";
// import { useGame } from "../store/game-context";
import { useNavigate, Link } from "react-router-dom";
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

  // console.log(selectedGame);

  useEffect(() => {
    if (!selectedGame) {
      console.log("No game selected");
      navigate("/games");
    }
  });

  const [fetchedGame, setFetchedGame] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [editedCurrentTurn, setEditedCurrentTurn] = useState(null); // ["w", "b"
  const [status, setStatus] = useState(" to move");
  const [isPlayMode, setIsPlayMode] = useState(true);
  const [position, setPosition] = useState(null);
  // const [editedPosition, setEditedPosition] = useState(null);
  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  useEffect(() => {
    const selectedGame = JSON.parse(
      localStorage.getItem("chessmixed_selectedGame")
    );
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

  useEffect(() => {
    if (fetchedGame) {
      setPosition(fetchedGame.fen);
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

  const handleReset = async () => {
    console.log("reset");
    setPosition("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    setEditedCurrentTurn("w");
  };

  const handleSave = async () => {
    console.log("save");
    const newFen = position + " " + editedCurrentTurn + " KQkq - 0 1";
    const response = await fetch(
      `http://localhost:3200/games/${selectedGame._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...fetchedGame,
          fen: newFen,
          currentTurn: editedCurrentTurn,
        }),
      }
    );

    console.log(newFen);
    console.log(response);

    const data = await response.json();
    console.log(data);
    setFetchedGame(data);
    setIsPlayMode(true);
    setPosition(newFen);
    setCurrentTurn(editedCurrentTurn);
  };

  return (
    <div id="game-page">
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
          <div className="controls">
            <Link to="/games">
              <button>Back to Games</button>
            </Link>
            <button
              onClick={() => {
                setIsPlayMode(false);
                setPosition(fetchedGame.fen.split(" ")[0]);
                setEditedCurrentTurn(currentTurn);
              }}
            >
              Edit Boardstate
            </button>
          </div>
        </>
      ) : (
        <>
          {fetchedGame && (
            <>
              <div className="controls">
                <label htmlFor="blacktoMove">
                  Black to move
                  <input
                    type="radio"
                    id="blackToMove"
                    className="currentTurn"
                    value="b"
                    checked={editedCurrentTurn === "b"}
                    onChange={() => setEditedCurrentTurn("b")}
                  />
                </label>
              </div>
              <EditBoard
                fetchedGame={fetchedGame}
                selfColor={selfColor}
                // editedPosition={editedPosition}
                // setEditedPosition={setEditedPosition}
                position={position}
                setPosition={setPosition}
              />
              <div className="controls">
                <label htmlFor="whitetoMove">
                  White to move
                  <input
                    type="radio"
                    id="whiteToMove"
                    className="currentTurn"
                    value="w"
                    checked={editedCurrentTurn === "w"}
                    onChange={() => setEditedCurrentTurn("w")}
                  />
                </label>
              </div>
            </>
          )}
          <div className="controls">
            <Link to="/games">
              <button>Back to Games</button>
            </Link>
            <button
              onClick={() => {
                setIsPlayMode(true);
                setPosition(fetchedGame.fen);
              }}
            >
              Discard Changes
            </button>
            <button onClick={handleReset}>Start Position</button>
            <button onClick={handleSave}>Save and Continue</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Game;
