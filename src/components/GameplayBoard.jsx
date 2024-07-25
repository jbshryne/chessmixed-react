import { useState, useEffect } from "react";
// import { useGame } from "../store/game-context";
import { socket } from "../socket";
import { Chess } from "chess.js";
// import { Chessboard } from "react-chessboard";
import Chessboard from "chessboardjsx";

const GameplayBoard = ({ setCurrentTurn, setStatus, fetchedGame }) => {
  // const { selected, setGame } = useGame();
  const gameId = fetchedGame._id;
  const [chess, setChess] = useState(new Chess(fetchedGame.fen));
  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  // console.log(currentUser);

  function isDraggablePiece({ piece }) {
    if (fetchedGame.playerWhite.username !== fetchedGame.playerBlack.username) {
      const currentTurn = fetchedGame.currentTurn;
      const playerColor =
        fetchedGame.playerBlack &&
        fetchedGame.playerBlack.playerId === currentUser._id
          ? "b"
          : "w";

      if (piece.includes(currentTurn) && currentTurn === playerColor) {
        return true;
      }
      return false;
    } else if (
      fetchedGame.playerWhite.username === fetchedGame.playerBlack.username
    ) {
      const currentTurn = fetchedGame.currentTurn;
      if (piece.includes(currentTurn)) {
        return true;
      }
      return false;
    }
  }

  let gptApiCallCounter = 0;

  async function requestOpponentMove(newChess, gameCopy) {
    gptApiCallCounter++;

    console.log("fen on call #", gptApiCallCounter, ":", newChess.fen());

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/games/${gameId}/move`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          fen: newChess.fen(),
          currentTurn: gameCopy.currentTurn,
          pgn: newChess.pgn(),
          validMoves: newChess.moves({ verbose: true }),
          opponent: "cpu",
        }),
      }
    ).catch((error) => console.error(error));

    const data = await response.json();
    console.log(data);

    makeAMove(
      {
        from: data.from,
        to: data.to,
        promotion: "q",
      },
      newChess
    );
  }

  async function makeAMove(move, newChess) {
    console.log("makeAMove received:", move);
    console.log("current turn:", chess.turn());
    if (newChess === undefined) newChess = new Chess(chess.fen());
    let result;

    try {
      result = newChess.move(move);
      console.log(result);
    } catch (error) {
      console.log(error);
      if (move.local === undefined) {
        requestOpponentMove(newChess, fetchedGame);
      }
      return null;
    }
    // console.log(newChess.fen());

    // promotion

    if (result.flags.includes("p")) {
      const promotion = prompt("Promote to: (q, r, b, n)");
      newChess = new Chess(chess.fen());
      try {
        result = newChess.move({ ...move, promotion });
        console.log(result);
      } catch (error) {
        console.log(error);
        return null;
      }
    }

    setChess(newChess);

    const gameCopy = fetchedGame;
    gameCopy.fen = newChess.fen();
    result.color === "w"
      ? (gameCopy.currentTurn = "b")
      : (gameCopy.currentTurn = "w");
    setCurrentTurn(gameCopy.currentTurn);

    if (result.flags.includes("c")) {
      // capture
      const piece = result.captured;
      if (result.color === "w") {
        gameCopy.capturedBlack.push(piece);
      } else {
        gameCopy.capturedWhite.push(piece);
      }
    }

    // check
    newChess.inCheck() ? setStatus(" is in check!") : setStatus(" to move");

    // checkmate
    if (newChess.isCheckmate()) {
      setStatus(" is in checkmate!");
    }

    // setGame(gameCopy);

    if (move.local && gptApiCallCounter < 3) {
      requestOpponentMove(newChess, gameCopy);
    }

    if (gptApiCallCounter >= 3) {
      console.log("GPT API call limit reached!");
      gptApiCallCounter = 0;
    }

    return result; // null if the move was illegal, the move object if the move was legal
  }

  function onDrop({ sourceSquare, targetSquare, piece }) {
    console.log(sourceSquare, targetSquare, piece);

    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
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
      {/* from react-chessboard: */}
      {/* <Chessboard
        position={chess.fen()}
        boardWidth={500}
        isDraggablePiece={isDraggablePiece}
        onPieceDrop={onDrop}
        boardOrientation={
          fetchedGame.playerWhite &&
          fetchedGame.playerWhite.playerId === currentUser._id
            ? "white"
            : "black"
        }
      /> */}
      {/* from chessboardjsx: */}
      <Chessboard
        position={chess.fen()}
        width={480}
        allowDrag={isDraggablePiece}
        onDrop={onDrop}
        orientation={
          fetchedGame.playerWhite &&
          fetchedGame.playerWhite.playerId === currentUser._id
            ? "white"
            : "black"
        }
      />
    </div>
  );
};

export default GameplayBoard;
