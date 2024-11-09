import { BoardType, GameStateType, MoveDirection } from "../types";

export class BoardClass {
  private board: BoardType;
  private score: number;
  private boardSize: number;
  private newTilePos: { row: number; col: number } | null;
  constructor(size: number = 4) {
    this.boardSize = size;
    this.board = this.generateEmptyBoard();
    this.score = 0;
    this.newTilePos = null;
  }

  getNewTilePos() {
    return this.newTilePos;
  }
  public hasWon(target: number = 2048): boolean {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (this.board[row][col] === target) {
          return true;
        }
      }
    }
    return false;
  }

  public isGameOver(): boolean {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const tile = this.board[row][col];

        if (col < this.boardSize - 1 && tile === this.board[row][col + 1]) {
          return false;
        }

        if (row < this.boardSize - 1 && tile === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }
  setBoard(board: BoardType) {
    this.board = board;
  }

  getBoard() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  private generateEmptyBoard(): BoardType {
    return Array(this.boardSize)
      .fill(null)
      .map(() => Array(this.boardSize).fill(0));
  }

  addRandomTile() {
    const emptyCells: { row: number; col: number }[] = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) emptyCells.push({ row: rowIndex, col: cellIndex });
      });
    });

    if (emptyCells.length === 0) return;
    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newTileValue = Math.random() < 0.9 ? 2 : 4;
    this.board[randomCell.row][randomCell.col] = newTileValue;
    this.newTilePos = randomCell;
    return this.board;
  }

  private mergeRowLeft(row: number[], state: GameStateType): number[] {
    let mergedRow = row.filter((val) => val !== 0);

    for (let i = 0; i < mergedRow.length - 1; i++) {
      if (mergedRow[i] === mergedRow[i + 1]) {
        mergedRow[i] *= 2;
        if (state === "real") this.score += mergedRow[i];
        mergedRow[i + 1] = 0;
      }
    }

    mergedRow = mergedRow.filter((val) => val !== 0);
    while (mergedRow.length < this.boardSize) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  mergeBoardLeft(state: GameStateType): BoardType {
    const newBoard = this.board.map((row) =>
      this.mergeRowLeft([...row], state)
    );
    this.board = newBoard;
    return newBoard;
  }

  private reverse(row: number[]): number[] {
    return row.slice().reverse();
  }
  public merge(direction: MoveDirection, state: GameStateType) {
    switch (direction) {
      case "up":
        this.mergeBoardUp(state);
        break;
      case "down":
        this.mergeBoardDown(state);
        break;
      case "left":
        this.mergeBoardLeft(state);
        break;
      case "right":
        this.mergeBoardRight(state);
        break;
    }
  }
  mergeBoardRight(state: GameStateType): BoardType {
    const newBoard = this.board.map((row) => {
      const reversedRow = this.reverse(row);
      const mergedRow = this.mergeRowLeft(reversedRow, state);
      return this.reverse(mergedRow);
    });
    this.board = newBoard;
    return newBoard;
  }

  private transpose(): BoardType {
    const newBoard = Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(0)
    );
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        newBoard[j][i] = this.board[i][j];
      }
    }
    return newBoard;
  }

  mergeBoardUp(state: GameStateType): BoardType {
    this.board = this.transpose();
    this.mergeBoardLeft(state);
    this.board = this.transpose();
    return this.board;
  }

  mergeBoardDown(state: GameStateType): BoardType {
    this.board = this.transpose();
    this.mergeBoardRight(state);
    this.board = this.transpose();
    return this.board;
  }
}
