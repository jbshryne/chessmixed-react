import { useState, useEffect } from "react";
import { useGame } from "../store/game-context";
import { socket } from "../socket";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const GameplayBoard = () => {
  const { selectedGame, setGame } = useGame();
  const gameId = selectedGame._id;
  // console.log(selectedGame);
  const [chess, setChess] = useState(new Chess(selectedGame.fen));
  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  // console.log(currentUser);

  function isDraggablePiece({ piece }) {
    if (
      selectedGame.playerWhite.username !== selectedGame.playerBlack.username
    ) {
      const currentTurn = selectedGame.currentTurn;
      const playerColor =
        selectedGame.playerBlack &&
        selectedGame.playerBlack.playerId === currentUser._id
          ? "b"
          : "w";

      if (piece.includes(currentTurn) && currentTurn === playerColor) {
        return true;
      }
      return false;
    } else if (
      selectedGame.playerWhite.username === selectedGame.playerBlack.username
    ) {
      const currentTurn = selectedGame.currentTurn;
      if (piece.includes(currentTurn)) {
        return true;
      }
      return false;
    }
  }

  // async function recieveNewMove(move) {
  //   const result = makeAMove(move);

  //   if (result === null) {
  //     alert("Illegal move");
  //     return;
  //   }

  // }

  async function makeAMove(move) {
    const newChess = new Chess(chess.fen());
    let result;

    try {
      result = newChess.move(move);
      console.log(result);
    } catch (error) {
      console.log(error);
      return null;
    }
    // console.log(newChess.fen());

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

    if (move.local) {
      const response = await fetch(
        `http://localhost:3200/games/${gameId}/move`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId,
            fen: newChess.fen(),
            currentTurn: gameCopy.currentTurn,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    }

    return result; // null if the move was illegal, the move object if the move was legal
  }

  // function handleReset() {
  //   // setChess(new Chess());
  //   console.log("reset");
  // }

  function onDrop(sourceSquare, targetSquare, piece) {
    console.log(sourceSquare, targetSquare, piece);

    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
      local: true,
    });

    // illegal move
    if (move === null) return false;

    socket.emit(
      "sendNewMove",
      {
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
        local: false,
      },
      `game-${gameId}`
    );

    return true;
  }

  useEffect(() => {
    socket.on("getNewMove", (move) => {
      // console.log("newMove", move);
      makeAMove(move);
    });
  });

  return (
    <div className="board-container">
      <Chessboard
        position={chess.fen()}
        boardWidth={500}
        isDraggablePiece={isDraggablePiece}
        onPieceDrop={onDrop}
        // onPieceDragEnd={onDrop}
        boardOrientation={
          selectedGame.playerWhite &&
          selectedGame.playerWhite.playerId === currentUser._id
            ? "white"
            : "black"
        }
      />
      {/* <input
        type="text"
        id="from"
        placeholder="from"
        onChange={handleMoveInput}
      />
      <input type="text" id="to" placeholder="to" onChange={handleMoveInput} />
      <button onClick={() => makeAMove(move)}>Move</button> */}
      {/* <button onClick={handleReset}>Reset Board</button> */}
    </div>
  );
};

export default GameplayBoard;
