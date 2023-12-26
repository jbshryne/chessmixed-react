// import { useEffect } from "react";
// import { useGame } from "../store/game-context";
// import { useParams } from "react-router-dom";
import GameplayBoard from "../components/GameplayBoard";
import StatusBox from "../components/StatusBox";
// import { socket } from "../socket";

const Game = () => {
  // const { selectedGame } = useGame();
  // const { setGame } = useGame();
  // const { id } = useParams();

  // let selectedGame = {};

  // useEffect(() => {
  //   const currentUser = JSON.parse(
  //     localStorage.getItem("chessmixed_currentUser")
  //   );

  //   async function fetchGame() {
  //     const response = await fetch("http://localhost:3200/games/" + id, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         currentUser,
  //       }),
  //     });

  //     const data = await response.json();
  //     console.log(data);
  //     setGame(data);
  //     // selectedGame = data;
  //   }
  //   fetchGame();
  // }, [setGame, id]);

  // console.log(selectedGame);

  return (
    <div id="game-page">
      <StatusBox player="opponent" />
      <GameplayBoard />
      <StatusBox player="self" />
    </div>
  );
};

export default Game;
