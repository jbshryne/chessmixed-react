import React, { createContext, useContext, useState } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // const storedGame = JSON.parse(
  //   localStorage.getItem("chessmixed-selectedGame")
  // ) || {
  //   fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  // };

  // const [selectedGame, setSelectedGame] = useState(storedGame);

  // const setGame = (game) => {
  //   // console.log(game);
  //   setSelectedGame(game);
  //   localStorage.setItem("chessmixed-selectedGame", JSON.stringify(game));
  // };

  const [gameMode, setGameMode] = useState("play");

  return (
    <GameContext.Provider value={{ gameMode, setGameMode }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
