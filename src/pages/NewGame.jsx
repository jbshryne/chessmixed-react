import React from "react";
import { useNavigate } from "react-router-dom";

const NewGame = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

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
        }),
      }
    );

    const data = await response.json();
    console.log(data);

    if (data.success) {
      //   const updatedGames = [...allGames, data.game];
      //   setAllGames(updatedGames);
      localStorage.setItem(
        "chessmixed_selectedGame",
        JSON.stringify(data.game)
      );
      //   setGameMode("play");
      navigate(`/game`);
    }
  };

  return (
    <div>
      <button onClick={handleCreateGame}>Create Game</button>
    </div>
  );
};

export default NewGame;
