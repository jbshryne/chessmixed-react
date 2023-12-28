import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { useGame } from "../store/game-context";
import FENBoard from "fen-chess-board";

const EditBoard = ({ fetchedGame, selfColor }) => {
  const { selectedGame } = useGame();
  //   let fenBoard = new FENBoard(selectedGame.fen);
  const [position, setPosition] = useState(fetchedGame.fen);
  //   console.log(fenBoard);

  const onDrop = (sourceSquare, targetSquare, piece) => {
    let fenBoard = new FENBoard(position);
    fenBoard.move(sourceSquare, targetSquare);
    setPosition(fenBoard.fen);
  };

  console.log(selectedGame);

  return (
    <div className="board-container">
      <Chessboard
        position={position}
        animationDuration={0}
        boardWidth={500}
        arePiecesDraggable={true}
        onPieceDrop={onDrop}
        // getPositionObject={getPositionObject}
        // isDraggablePiece={isDraggablePiece}
        // onPieceDragEnd={onDrop}
        // onSquareClick={handleSquareClick}
        // onSquareRightClick={handleSquareRightClick}
        // onSquareMouseOver={handleSquareMouseOver}
        // onSquareMouseOut={handleSquareMouseOut}
        // onSquareMouseDown={handleSquareMouseDown}
        // onSquareMouseUp={handleSquareMouseUp}
        // onSquareTouchStart={handleSquareTouchStart}
        // onSquareTouchEnd={handleSquareTouchEnd}
        // onSquareContextMenu={handleSquareContextMenu}
        // onDrop={handleDrop}
        // onDragOverSquare={handleDragOverSquare}
        // onDragLeaveSquare={handleDragLeaveSquare}
        // onSnapbackEnd={handleSnapbackEnd}
        // transitionDuration={transitionDuration}
        // dropOffBoard="snapback"
        sparePieces={true}
        // darkSquareStyle={{ backgroundColor: "var(--dark-square-color)" }}
        // lightSquareStyle={{ backgroundColor: "var(--light-square-color)" }}
        boardOrientation={selfColor === "w" ? "white" : "black"}
        // calcWidth={({ screenWidth }) => (screenWidth < 500 ? 350 : 480)}
        // style={{ margin: "0 auto" }}
      />
    </div>
  );
};

export default EditBoard;
