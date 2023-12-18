import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useGame } from "../store/game-context";

const GameplayBoard = () => {
  const { selectedGame, setGame } = useGame();
  const [chess, setChess] = useState(new Chess(selectedGame.fen));
  const gameId = selectedGame._id;
  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  function isDraggablePiece({ piece }) {
    const currentTurn = selectedGame.currentTurn;
    if (piece.includes(currentTurn)) {
      return true;
    }
    return false;
  }

  async function makeAMove(move) {
    const newChess = new Chess(chess.fen());
    let result;

    try {
      result = newChess.move(move);
      console.log(result);
    } catch (error) {
      // console.log(error);
      return null;
    }
    console.log(newChess.fen());

    setChess(newChess);

    const gameCopy = selectedGame;
    gameCopy.fen = newChess.fen();
    result.color === "w"
      ? (gameCopy.currentTurn = "b")
      : (gameCopy.currentTurn = "w");

    if (result.flags.includes("c")) {
      // capture
      const piece = result.captured;
      if (result.color === "w") {
        gameCopy.capturedBlack.push(piece);
      } else {
        gameCopy.capturedWhite.push(piece);
      }
    }

    setGame(gameCopy);

    const response = await fetch(`http://localhost:3200/games/${gameId}/move`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, fen: newChess.fen() }),
    });

    const data = await response.json();
    console.log(data);

    return result; // null if the move was illegal, the move object if the move was legal
  }

  function onDrop(sourceSquare, targetSquare) {
    // console.log(sourceSquare, targetSquare);

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
      <Chessboard
        position={chess.fen()}
        boardWidth={500}
        onPieceDrop={onDrop}
        isDraggablePiece={isDraggablePiece}
        boardOrientation={
          selectedGame.playerBlack &&
          selectedGame.playerBlack.playerId === currentUser._id
            ? "black"
            : "white"
        }
      />
    </div>
  );
};

export default GameplayBoard;
