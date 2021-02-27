import { FifteenPuzzle } from "15-puzzle";
import { range } from "./utils";

type Point2D = [number, number];
interface TapData {
  time: number;
  coord: Point2D;
}
interface Game {
  timeGenerated: number;
  timeStarted: number | null;
  timeSolved: number | null;
  seed: string;
  columns: number;
  rows: number;
  taps: TapData[];
}
const getUnixTimestamp = () => +new Date;

export class PuzzleManager {
  public gameHistory: Game[] = [];
  public currentGame: Game;
  public currentPuzzle: FifteenPuzzle;

  public get started() { return this.currentGame.timeStarted !== null; }
  public get isSolved() { return this.currentGame.timeSolved !== null; }

  public externalOnUpdate: () => any = () => {};
  public setOnUpdate(onUpdate: () => any): this {
    this.externalOnUpdate = onUpdate;
    return this;
  }

  public onUpdate() {
    if (this.currentPuzzle.isSolved()) this.onSolve();
    this.externalOnUpdate();
  }

  private onSolve() {
    this.gameHistory.push(this.currentGame);
    this.currentGame.timeSolved = getUnixTimestamp();
  }

  private newGame(timeGenerated: number, columns = 4, rows = columns): Game {
    return {
      timeGenerated,
      timeStarted: null,
      timeSolved: null,
      seed: `${timeGenerated}`,
      columns,
      rows,
      taps: [],
    };
  }

  private newTapData(coord: Point2D, time: number): TapData {
    return { coord, time };
  }

  public constructor() {
    this.reset();
  }

  public reset(): this { // TODO
    if (!this.gameHistory[this.gameHistory.length - 1])
      this.gameHistory.push(this.currentGame);
    this.currentGame = this.newGame(getUnixTimestamp());
    this.currentPuzzle = FifteenPuzzle.generateRandom(
      this.currentGame.seed,
      this.currentGame.columns,
      this.currentGame.rows
    );
    this.onUpdate();
    return this;
  }

  public getNumbers() {
    const puzzle = this.currentPuzzle;
    return range(puzzle.columns * puzzle.rows)
      .map(number => {
        const coord = puzzle.getPointFromValue(number);
        const index = puzzle.pointUtil.convertPointToIndex(coord);
        return { coord, number, isCorrect: number == index + 1 };
      });
  }

  public tap(coord: Point2D): boolean {
    if (this.isSolved) return false;
    if (!this.currentPuzzle.tap(coord)) return false;
    if (!this.started) this.currentGame.timeStarted = getUnixTimestamp();
    this.currentGame.taps.push(this.newTapData(coord, getUnixTimestamp() - this.currentGame.timeStarted!));
    this.onUpdate();
    return true;
  }
  
  public forceSolve() {
    if (this.isSolved) return;
    const puzzle = this.currentPuzzle;
    puzzle.numbers = range(1, puzzle.columns * puzzle.rows).concat(0);
    this.onUpdate();
  }
}
