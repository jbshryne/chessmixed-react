// import { useState } from "react";
import { Chessboard } from "react-chessboard";
// import { useGame } from "../store/game-context";
import FENBoard from "fen-chess-board";

const EditBoard = ({
  selfColor,
  //   editedPosition,
  //   setEditedPosition,
  position,
  setPosition,
}) => {
  //   const { selectedGame } = useGame();
  //   let fenBoard = new FENBoard(selectedGame.fen);
  //   const [position, setPosition] = useState(fetchedGame.fen);
  //   console.log(fenBoard);

  const onDrop = (sourceSquare, targetSquare, piece) => {
    let fenBoard = new FENBoard(position);
    fenBoard.move(sourceSquare, targetSquare);
    setPosition(fenBoard.fen);
    // setEditedPosition(fenBoard.fen);
  };

  //   console.log(selectedGame);

  return (
    <div className="board-container">
      <Chessboard
        position={position}
        animationDuration={0}
        boardWidth={500}
        arePiecesDraggable={true}
        onPieceDrop={onDrop}
        boardOrientation={selfColor === "w" ? "white" : "black"}
      />
    </div>
  );
};

export default EditBoard;
