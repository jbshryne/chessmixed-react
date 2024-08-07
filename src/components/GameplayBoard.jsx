import { useState, useEffect } from "react";
import { socket } from "../socket";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";

const GameplayBoard = ({
  setCurrentTurn,
  setStatus,
  fetchedGame,
  cpuOpponentColor,
}) => {
  const gameId = fetchedGame._id;
  const [chess, setChess] = useState(new Chess(fetchedGame.fen));

  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  const isLocalGame =
    fetchedGame.playerWhite.playerId === fetchedGame.playerBlack.playerId;

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
  let makeAMoveCount = 0;

  async function requestOpponentMove(newChess, gameCopy) {
    gptApiCallCounter++;
    console.log(
      "requestOpponentMove fires",
      gptApiCallCounter,
      "cpuOpponentColor:",
      cpuOpponentColor
    );

    if (gptApiCallCounter >= 5) {
      console.log("GPT API call limit reached!");
      gptApiCallCounter = 0;
      return;
    }

    console.log("fen on call #", gptApiCallCounter, ":", newChess.fen());
    console.log(cpuOpponentColor, gameCopy.currentTurn);

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
          cpuOpponentColor,
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
      newChess,
      true
    );
  }

  async function makeAMove(move, newChess, isCpuMove = false) {
    makeAMoveCount++;
    console.log(
      "makeAMove fires",
      makeAMoveCount,
      "current turn:",
      chess.turn(),
      "isLocalGame:",
      isLocalGame
    );
    if (newChess === undefined) newChess = new Chess(chess.fen());
    let result;

    try {
      result = newChess.move(move);
      console.log(result);
    } catch (error) {
      console.log(error);
      if (isCpuMove) {
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
    newChess.inCheck()
      ? setStatus(" is in check!")
      : cpuOpponentColor && gameCopy.currentTurn === cpuOpponentColor
      ? setStatus(" is thinking...")
      : setStatus(" to move");

    // checkmate
    if (newChess.isCheckmate()) {
      setStatus(" is in checkmate!");
      return;
    }

    if (
      !isCpuMove &&
      cpuOpponentColor &&
      gameCopy.currentTurn === cpuOpponentColor &&
      gptApiCallCounter < 5
    ) {
      console.log("requesting opponent move...");
      requestOpponentMove(newChess, gameCopy);
    } else {
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
            validMoves: newChess.moves({ verbose: false }),
          }),
        }
      ).catch((error) => console.error(error));

      const data = await response.json();
      console.log(data);
    }

    // if (gptApiCallCounter >= 5) {
    //   console.log("GPT API call limit reached!");
    //   gptApiCallCounter = 0;
    // }

    return result; // null if the move was illegal, the move object if the move was legal
  }

  function onDrop({ sourceSquare, targetSquare, piece }) {
    console.log(sourceSquare, targetSquare, piece);

    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    // illegal move
    if (move === null) return false;

    if (!isLocalGame) {
      console.log("sending move to server...");

      socket.emit(
        "sendNewMove",
        {
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
          playerId: currentUser._id,
        },
        `game-${gameId}`
      );
    }

    return true;
  }

  useEffect(() => {
    socket.on("getNewMove", (move) => {
      console.log("getNewMove received:", move);
      if (move.playerId !== currentUser._id) makeAMove(move);
    });
  });

  return (
    <div className="board-container">
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
