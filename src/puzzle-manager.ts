import { FifteenPuzzle } from "15-puzzle";
import { range } from "./utils";

type Point2D = [number, number];

interface Game {
  timeGenerated: number;
  timeStarted: number;
  timeEnded: number;
  seed: string;
  taps: Point2D[];
}

function getTimestamp() {
  return +new Date;
}
  
function getNewGame() {
  return { taps: [] } as any as Game;
}

export class PuzzleManager {
  public gameHistory: Game[];
  public gameInfo: Game;
  public puzzleInstance: FifteenPuzzle;

  public constructor(private onUpdate: () => any = () => {}) {
    this.gameHistory = [];
    this.clean();
  }

  public setOnUpdate(onUpdate: () => any): this {
    this.onUpdate = onUpdate;
    return this;
  }
  
  public started = false;
  public isSolved = false;
  private clean() {
    if (this.puzzleInstance && this.puzzleInstance.isSolved()) {
      this.gameHistory.push(this.gameInfo);
    }
    this.started = false;
    this.isSolved = false;
    this.gameInfo = getNewGame();
  }

  private updateSolvedState() {
    this.isSolved = this.puzzleInstance.isSolved();
  }

  public generate(): this {
    this.clean();
    const timestamp = getTimestamp();
    const seed = `${timestamp}`;
    this.puzzleInstance = FifteenPuzzle.generateRandom(seed);
    this.gameInfo.timeGenerated = timestamp;
    this.gameInfo.seed = seed;
    this.updateSolvedState();
    this.onUpdate();
    return this;
  }

  public tap(coord: Point2D): boolean {
    if (this.isSolved) return false;
    const succeeded = this.puzzleInstance.tap(coord);
    if (!succeeded) return false;
    if (!this.started) {
      this.started = true;
      this.gameInfo.timeStarted = getTimestamp();
    }
    this.gameInfo.taps.push(coord);
    this.updateSolvedState();
    if (this.isSolved) this.onSolve();
    this.onUpdate();
    return true;
  }

  private onSolve() {
    this.gameInfo.timeEnded = getTimestamp();
  }

  public getNumbers() {
    const puzzle = this.puzzleInstance;
    return range(1, puzzle.columns * puzzle.rows)
      .map(number => {
        const coord = puzzle.getPointFromValue(number);
        const index = puzzle.pointUtil.convertPointToIndex(coord);
        return { coord, number, isCorrect: number == index + 1 };
      });
  }

  public forceSolve() {
    const puzzle = this.puzzleInstance;
    puzzle.numbers = [...Array(puzzle.columns * puzzle.rows - 1)].map((_, i) => i + 1).concat(0);
    this.onUpdate();
  }
}
