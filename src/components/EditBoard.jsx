// import { useState } from "react";
// import { Chessboard } from "react-chessboard";
import Chessboard from "chessboardjsx";
import FENBoard from "fen-chess-board";

const EditBoard = ({
  selfColor,
  //   editedPosition,
  //   setEditedPosition,
  position,
  setPosition,
}) => {
  //   let fenBoard = new FENBoard(selectedGame.fen);
  //   const [position, setPosition] = useState(fetchedGame.fen);
  //   console.log(fenBoard);

  console.log(position);

  //   const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  const onDrop = ({ sourceSquare, targetSquare, piece }) => {
    console.log(sourceSquare, targetSquare, piece);
    let fenBoard = new FENBoard(position);
    if (sourceSquare === "spare") {
      let newPiece;
      if (piece[0] === "w") {
        newPiece = piece[1].toUpperCase();
      } else if (piece[0] === "b") {
        newPiece = piece[1].toLowerCase();
      }
      fenBoard.put(targetSquare, newPiece);
    } else {
      fenBoard.move(sourceSquare, targetSquare);
    }
    setPosition(fenBoard.fen);
    // setEditedPosition(fenBoard.fen);
  };

  //   console.log(selectedGame);

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
        // transitionDuration={0}
        getPosition={(position) => {
          console.log(position);
        }}
        width={480}
        // allowDrag={true}
        sparePieces={true}
        onDrop={onDrop}
        orientation={selfColor === "w" ? "white" : "black"}
      />
    </div>
  );
};

export default EditBoard;
