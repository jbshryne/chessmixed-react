import React from "react";

const GamesList = () => {
  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  return (
    <div>
      <h1>{currentUser.displayName}'s Games</h1>
    </div>
  );
};

export default GamesList;
