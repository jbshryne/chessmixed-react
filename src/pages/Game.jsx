// import { useParams } from "react-router-dom";
// import { useGame } from "../store/game-context";
import GameplayBoard from "../components/GameplayBoard";
import StatusBox from "../components/StatusBox";

const Game = () => {
  // const { gameId } = useParams();
  // const { selectedGame } = useGame();

  // console.log(selectedGame);

  //   const currentUser = JSON.parse(
  //     localStorage.getItem("chessmixed_currentUser")
  //   );

  return (
    <div id="game-page">
      <StatusBox player="opponent" />
      <GameplayBoard />
      <StatusBox player="self" />
    </div>
  );
};

export default Game;
