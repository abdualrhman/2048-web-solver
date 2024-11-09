import { GameStateType, MoveDirection } from "../types";
import { BoardClass } from "../utils/BoardClass";
import {
  getAvailableCells,
  isBoardEqual,
  withinBounds,
} from "../utils/boardUtils";

const minValue = 0.1;

type BoardType = number[][];
type AgentType = "player" | "ai";

const moveDirections: {
  [key: string]: (board: BoardClass, state: GameStateType) => void;
} = {
  up: (board, state) => board.mergeBoardUp(state),
  down: (board, state) => board.mergeBoardDown(state),
  left: (board, state) => board.mergeBoardLeft(state),
  right: (board, state) => board.mergeBoardRight(state),
};

export function getBestMove(
  boardArr: BoardType,
  depth: number,
  priority: number[][]
): MoveDirection {
  let moveScore = minValue;
  let bestMove: MoveDirection = "up";
  for (const moveDir in moveDirections) {
    const boardInstance = new BoardClass();
    boardInstance.setBoard(boardArr);

    moveDirections[moveDir](boardInstance, "sim");

    if (isBoardEqual(boardInstance.getBoard(), boardArr)) continue;

    const newScore = expectiMax(
      boardInstance.getBoard(),
      depth - 1,
      "ai",
      priority
    );
    if (newScore > moveScore) {
      bestMove = moveDir as MoveDirection;
      moveScore = newScore;
    }
  }

  return bestMove;
}

const expectiMaxCache = new Map<string, number>();
function expectiMax(
  boardArr: BoardType,
  depth: number,
  agent: AgentType,
  priority: number[][]
): number {
  const cacheKey = JSON.stringify({ boardArr, depth, agent });
  if (expectiMaxCache.has(cacheKey)) {
    return expectiMaxCache.get(cacheKey)!;
  }

  if (depth === 0) {
    return calculateScore(boardArr, priority);
  }

  let result: number;

  if (agent === "player") {
    let playerScore = minValue;
    for (const moveDir in moveDirections) {
      const boardInstance = new BoardClass();
      boardInstance.setBoard(boardArr);

      moveDirections[moveDir](boardInstance, "sim");
      if (isBoardEqual(boardInstance.getBoard(), boardArr)) continue;
      playerScore = Math.max(
        playerScore,
        expectiMax(boardInstance.getBoard(), depth - 1, "ai", priority)
      );
    }
    result = playerScore;
  } else {
    let boardScore = 0;
    const availableCells = getAvailableCells(boardArr);

    for (const cell of availableCells) {
      for (const [value, prob] of [
        [2, 0.9],
        [4, 0.1],
      ]) {
        const newBoard = boardArr.map((row) => [...row]);
        newBoard[cell[0]][cell[1]] = value;
        boardScore +=
          prob * expectiMax(newBoard, depth - 1, "player", priority);
      }
    }
    result = availableCells.length ? boardScore / availableCells.length : 0;
  }

  expectiMaxCache.set(cacheKey, result);
  return result;
}

function calculateScore(board: BoardType, priority: number[][]): number {
  let gameScore = 0;
  let penalty = 0;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const val = board[i][j];
      if (val > 0) {
        gameScore += priority[i][j] * val ** 2;
      }
      const neighbors = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ];
      for (const [dx, dy] of neighbors) {
        const ni = i + dx;
        const nj = j + dy;
        if (withinBounds([ni, nj]) && board[ni][nj] > 0) {
          penalty += Math.abs(val - board[ni][nj]);
        }
      }
    }
  }

  return gameScore - penalty;
}
