import React from "react";

const Games = () => {
  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  const handleSeedGames = () => {
    fetch("http://localhost:3200/games/seed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser._id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // setGames(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <h1>{currentUser.displayName}'s Games</h1>
      <ul>
        <li>Game 1</li>
        <li>Game 2</li>
        <li>Game 3</li>
      </ul>
      <button onClick={handleSeedGames}>Seed Games</button>
    </div>
  );
};

export default Games;
