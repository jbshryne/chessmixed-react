// import { useGame } from "../store/game-context";
import GameplayBoard from "../components/GameplayBoard";
import StatusBox from "../components/StatusBox";

const Game = () => {
  // const { selectedGame } = useGame();
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
