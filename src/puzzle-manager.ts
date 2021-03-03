import { FifteenPuzzle } from "15-puzzle";
import { range } from "./utils";

type Point2D = [number, number];
interface TapData {
  time: number;
  coord: Point2D;
}
interface Score {
  timeGenerated: number;
  timeStarted: number | null;
  timeSolved: number | null;
  seed: string;
  columns: number;
  rows: number;
  taps: TapData[];
}
function getUnixTimestamp() { return +new Date; } 

export class PuzzleManager {
  public scoreHistory: Score[] = [];
  public currentScore: Score
  public currentPuzzle: FifteenPuzzle;

  public get started() { return this.currentScore.timeStarted !== null; }
  public get isSolved() { return this.currentScore.timeSolved !== null; }

  private newGame(timeGenerated: number, columns = 4, rows = columns): Score {
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
  private createTapData(coord: Point2D, time: number): TapData {
    return { coord, time };
  }

  public constructor() {
    this.reset();
  }

  public onUpdate: () => any = () => {};
  public setOnUpdate(onUpdate: () => any): this {
    this.onUpdate = onUpdate;
    return this;
  }

  private onSolve() {
    this.scoreHistory.push(this.currentScore);
    this.currentScore.timeSolved = getUnixTimestamp();
  }

  public reset(): this {
    this.currentScore = this.newGame(getUnixTimestamp());
    this.currentPuzzle = FifteenPuzzle.generateRandom(
      this.currentScore.seed,
      this.currentScore.columns,
      this.currentScore.rows
    );
    this.scoreHistory.push(this.currentScore);
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
    if (!this.started) this.currentScore.timeStarted = getUnixTimestamp();
    this.currentScore.taps.push(this.createTapData(coord, getUnixTimestamp() - this.currentScore.timeStarted!));
    if (this.currentPuzzle.isSolved()) this.onSolve();
    this.onUpdate();
    return true;
  }

  public forceSolve() {
    if (this.isSolved) return;
    const puzzle = this.currentPuzzle;
    puzzle.numbers = range(1, puzzle.columns * puzzle.rows).concat(0);
    this.onSolve();
    this.onUpdate();
    return this;
  }
}
