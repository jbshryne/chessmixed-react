// import { useState } from "react";
// import { Chessboard } from "react-chessboard";
import Chessboard from "chessboardjsx";
// import Chess from "chess.js";
// import FENBoard from "fen-chess-board";

const convertToFen = (position) => {
  let fen = "";
  let emptyCount = 0;
  for (let i = 8; i >= 1; i--) {
    for (let j = 1; j <= 8; j++) {
      const square = String.fromCharCode(96 + j) + i;

      if (position[square]) {
        let piece;
        if (position[square][0] === "w") {
          piece = position[square][1].toUpperCase();
        } else if (position[square][0] === "b") {
          piece = position[square][1].toLowerCase();
        } else {
          piece = position[square];
        }

        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }

        fen += piece;
      } else {
        emptyCount++;
      }
    }
    if (emptyCount > 0) {
      fen += emptyCount;
      emptyCount = 0;
    }
    if (i > 1) {
      fen += "/";
    }
  }
  // console.log("converted fen:", fen);
  return fen;
};

const EditBoard = ({ selfColor, position, setPosition, boardWidth = 480 }) => {
  //   let fenBoard = new FENBoard(selectedGame.fen);
  //   const [position, setPosition] = useState(fetchedGame.fen);
  //   console.log(fenBoard);

  console.log(position);

  // const onDrop = ({ sourceSquare, targetSquare, piece }) => {
  //   console.log(sourceSquare, targetSquare, piece);

  //   let fenBoard = new FENBoard(position);
  //   if (sourceSquare === "spare") {
  //     let newPiece;
  //     if (piece[0] === "w") {
  //       newPiece = piece[1].toUpperCase();
  //     } else if (piece[0] === "b") {
  //       newPiece = piece[1].toLowerCase();
  //     }
  //     fenBoard.put(targetSquare, newPiece);
  //   } else {
  //     fenBoard.move(sourceSquare, targetSquare);
  //   }
  //   setPosition(fenBoard.fen);
  // };

  const getPosition = (position) => {
    const fen = convertToFen(position);
    console.log(fen);
    // const fenBoard = new FENBoard(fen);
    // console.log(fenBoard);
    setPosition(fen);
  };

  return (
    <div className="board-container">
      {/* from react-chessboard: */}
      {/* <Chessboard
        position={position}
        animationDuration={0}
        boardWidth={500}
        arePiecesDraggable={true}
        onPieceDrop={onDrop}
        boardOrientation={selfColor === "w" ? "white" : "black"}
      /> */}
      {/* from chessboardjsx: */}
      <Chessboard
        position={position}
        orientation={selfColor === "w" ? "white" : "black"}
        getPosition={(position) => {
          getPosition(position);
        }}
        width={boardWidth}
        sparePieces={true}
        dropOffBoard="trash"
        // allowDrag={true}
        // transitionDuration={0}
        // onDrop={onDrop}
      />
    </div>
  );
};

export default EditBoard;
