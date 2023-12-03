import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const GameplayBoard = ({ currentGame }) => {
  console.log(currentGame.fen);

  const [game, setGame] = useState(new Chess(currentGame.fen));

  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    // setTimeout(makeRandomMove, 200);
    return true;
  }

  return (
    <div>
      <Chessboard position={game.fen()} boardWidth={500} />
    </div>
  );
};

export default GameplayBoard;
