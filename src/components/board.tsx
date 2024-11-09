import React, { useState, useRef, useEffect } from "react";

import { useBoardControls } from "../hooks/useBoardControls";
import { BoardClass } from "../utils/BoardClass";
import { getAvailableCells, isBoardEqual } from "../utils/boardUtils";
import { getBestMove } from "../solvers/expecitmax";
import PriorityMatrix from "./priorityMatrix";

export const BoardComponent: React.FC = () => {
  const boardInstance = useRef(new BoardClass());
  const [board, setBoard] = useState<number[][]>(
    boardInstance.current.getBoard()
  );
  const [score, setScore] = useState<number>(boardInstance.current.getScore());
  const [solving, setSolving] = useState<boolean>(false);
  const [priority, setPriority] = useState<number[][]>([
    [14, 9, 8, 4],
    [10, 8, 5, 4],
    [2, 1, 1, 0],
    [0, 0, -1, -2],
  ]);
  const priorityRef = useRef(priority);
  const stopSolverRef = useRef(false);
  const [gameStatus, setGameStatus] = useState<string>("");
  const [newTile, setNewTile] = useState<{ row: number; col: number } | null>(
    null
  );
  const handlePriorityChange = (row: number, col: number, value: string) => {
    const updatedPriority = priority.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? parseInt(value) || 0 : c))
    );
    setPriority(updatedPriority);
  };

  const updateBoard = () => {
    setBoard([...boardInstance.current.getBoard()]);
    setScore(boardInstance.current.getScore());
  };

  const handleMove = (direction: "up" | "down" | "left" | "right") => {
    boardInstance.current.merge(direction, "real");
    if (!isBoardEqual(boardInstance.current.getBoard(), board))
      handleAddNewTile();
  };

  useBoardControls({ onMove: handleMove });

  useEffect(() => {
    handleAddNewTile();
  }, []);

  useEffect(() => {
    priorityRef.current = priority;
  }, [priority]);

  const handleSolve = async () => {
    setSolving(true);
    stopSolverRef.current = false;
    while (
      !boardInstance.current.isGameOver() &&
      !boardInstance.current.hasWon() &&
      !stopSolverRef.current
    ) {
      if (stopSolverRef.current) break;
      const availableCells = getAvailableCells(
        boardInstance.current.getBoard()
      );
      const depth = availableCells.length > 5 ? 5 : 6;

      const bestMove = getBestMove(
        boardInstance.current.getBoard(),
        depth,
        priorityRef.current
      );

      boardInstance.current.merge(bestMove, "real");

      handleAddNewTile();

      await new Promise((resolve) => setTimeout(resolve, 275));
    }

    setSolving(false);
  };
  const handleAddNewTile = () => {
    boardInstance.current.addRandomTile();
    const newTilePos = boardInstance.current.getNewTilePos();
    setNewTile(newTilePos);
    updateBoard();
  };
  useEffect(() => {
    if (boardInstance.current.hasWon()) {
      setGameStatus("You Won!");
      setSolving(false);
    } else if (boardInstance.current.isGameOver()) {
      setGameStatus("Game Over");
      setSolving(false);
    }
  }, [boardInstance, gameStatus, solving, newTile]);

  const handleCreateNewBoard = () => {
    boardInstance.current = new BoardClass();
    handleAddNewTile();
    handleStop();
    setGameStatus("");
    updateBoard();
  };
  const handleStop = () => {
    stopSolverRef.current = true;
    setSolving(false);
  };
  return (
    <div className="board-container">
      <div className="score">Score: {score}</div>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((tile, tileIndex) => {
              const isNew =
                newTile &&
                newTile.row === rowIndex &&
                newTile.col === tileIndex;
              return (
                <div
                  key={tileIndex}
                  className={`tile tile-${tile} ${isNew ? "new" : ""}`}
                >
                  {tile !== 0 ? tile : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {gameStatus && <div className="game-status">{gameStatus}</div>}
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={handleSolve} disabled={solving}>
          {solving ? "Solving..." : "Solve"}
        </button>
        {solving && (
          <button onClick={handleStop} disabled={!solving}>
            Stop
          </button>
        )}
      </div>
      <button onClick={handleCreateNewBoard}>Create New Board</button>
      <PriorityMatrix
        priority={priority}
        onPriorityChange={handlePriorityChange}
      />
    </div>
  );
};

export default BoardComponent;
