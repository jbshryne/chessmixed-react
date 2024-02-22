import Chessboard from "chessboardjsx";

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

const EditBoard = ({
  selfColor,
  position,
  setPosition,
  boardWidth = 480,
  orientation,
}) => {
  // console.log(position);

  const getPosition = (position) => {
    const fen = convertToFen(position);
    // console.log(fen);
    setPosition(fen);
  };

  return (
    <div className="board-container">
      <Chessboard
        position={position}
        orientation={orientation}
        getPosition={(position) => {
          getPosition(position);
        }}
        width={boardWidth}
        sparePieces={true}
        dropOffBoard="trash"
        // allowDrag={true}
      />
    </div>
  );
};

export default EditBoard;
