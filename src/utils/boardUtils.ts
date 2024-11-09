import { BoardType } from "../types";

export function isBoardEqual(board1: BoardType, board2: BoardType): boolean {
  for (let i = 0; i < board1.length; i++) {
    for (let j = 0; j < board1[i].length; j++) {
      if (board1[i][j] !== board2[i][j]) return false;
    }
  }
  return true;
}

export function withinBounds(pos: [number, number]): boolean {
  return pos[0] >= 0 && pos[0] < 4 && pos[1] >= 0 && pos[1] < 4;
}

export function getAvailableCells(board: BoardType): [number, number][] {
  const cells: [number, number][] = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        cells.push([i, j]);
      }
    }
  }
  return cells;
}
