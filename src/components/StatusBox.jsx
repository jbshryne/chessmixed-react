// import React, { useState } from "react";
// import { useGame } from "../store/game-context";

const StatusBox = ({ children }) => {
  // const [message, setMessage] = useState("");
  // const { selectedGame } = useGame();
  // const { playerWhite, playerBlack } = selectedGame;
  // const currentUser = JSON.parse(
  //   localStorage.getItem("chessmixed_currentUser")
  // );

  // console.log(selectedGame, player);
  // let playerName;
  // let message = "";

  // if (
  //   playerWhite.username === currentUser.username &&
  //   playerBlack.username === currentUser.username
  // ) {
  //   player === "self" ? (playerName = "White") : (playerName = "Black");
  // } else if (playerWhite.username !== playerBlack.username) {
  //   if (player === "self") {
  //     playerName =
  //       currentUser.username === playerWhite.username
  //         ? playerWhite.displayName
  //         : playerBlack.displayName;
  //   } else {
  //     playerName =
  //       currentUser.username === playerWhite.username
  //         ? playerBlack.displayName
  //         : playerWhite.displayName;
  //   }
  // }

  return <h2 className="status-box">{children}</h2>;
};

export default StatusBox;
