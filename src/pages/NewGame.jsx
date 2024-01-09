import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditBoard from "../components/EditBoard";

const NewGame = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );
  const [position, setPosition] = useState("start");
  const [friends, setFriends] = useState([]);
  const [currentTurn, setCurrentTurn] = useState("w");
  const [selfColor, setSelfColor] = useState("w");
  const [boardOrientation, setBoardOrientation] = useState("white");
  const [opponentId, setOpponentId] = useState(currentUser._id);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/friends/${currentUser._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setFriends(data);
    }
    fetchData();
  }, [currentUser._id]);

  const playerWhiteId = selfColor === "w" ? currentUser._id : opponentId;
  const playerBlackId = selfColor === "b" ? currentUser._id : opponentId;

  const handleCreateGame = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/games/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUser,
          playerWhiteId,
          playerBlackId,
          fen: position,
          currentTurn,
        }),
      }
    );

    const data = await response.json();
    console.log(data);

    if (data.success) {
      localStorage.setItem(
        "chessmixed_selectedGame",
        JSON.stringify(data.game)
      );
      navigate(`/game`);
    }
  };

  const handleOpponentChange = (event) => {
    setOpponentId(event.target.value);
  };

  const handleColorChange = (event) => {
    console.log(event.target.value);
    setSelfColor(event.target.value);
    setBoardOrientation(event.target.value === "w" ? "white" : "black");
  };

  return (
    <div id="new-game-page">
      <h2>Start a New Game</h2>
      <label htmlFor="self-color">
        {opponentId !== currentUser._id ? "Your Color: " : "POV Color: "}
        <input
          type="radio"
          name="self-color"
          id="self-color"
          value="w"
          checked={selfColor === "w"}
          onChange={handleColorChange}
        />
        White
        <input
          type="radio"
          name="self-color"
          id="self-color"
          value="b"
          checked={selfColor === "b"}
          onChange={handleColorChange}
        />
        Black
      </label>
      <label htmlFor="opponent">
        Opponent:
        <select
          name="opponent"
          id="opponent"
          value={opponentId}
          onChange={handleOpponentChange}
        >
          <option value={currentUser._id}>none</option>
          {friends.map((friend) => (
            <option key={friend._id} value={friend._id}>
              {friend.displayName}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="current-turn">
        Color to Move:
        <input
          type="radio"
          name="current-turn"
          id="current-turn"
          value="w"
          checked={currentTurn === "w"}
          onChange={() => setCurrentTurn("w")}
        />
        White
        <input
          type="radio"
          name="current-turn"
          id="current-turn"
          value="b"
          checked={currentTurn === "b"}
          onChange={() => setCurrentTurn("b")}
        />
        Black
      </label>
      <EditBoard
        selfColor={selfColor}
        position={position}
        setPosition={setPosition}
        boardWidth={400}
        orientation={boardOrientation}
      ></EditBoard>
      <button onClick={handleCreateGame}>Create Game</button>
    </div>
  );
};

export default NewGame;
