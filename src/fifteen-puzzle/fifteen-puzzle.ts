import { flip, range, chooseRandomIndex, chooseRandom } from '../utils';
import { FifteenPuzzleRenderer } from './renderer';
import { EventEmitter } from 'events';

const { floor, abs } = Math;

export type Point2D = [number, number];
export class FifteenPuzzle extends EventEmitter {
  static Renderer = FifteenPuzzleRenderer;

  static generateRandom(columns: number = 4, rows: number = columns) {
    const length = rows * columns;
    const numbers: number[] = [];
    const unusedNumbers = range(1, length);
    for (const _ in range(length - 3)) {
      numbers.push(unusedNumbers.splice(chooseRandomIndex(unusedNumbers), 1)[0]);
    }
    let puzzle = new this([columns, rows], numbers.concat(unusedNumbers, 0));
    if (!puzzle.isSolvable()) puzzle = new this([columns, rows], numbers.concat(unusedNumbers.map(flip), 0));
    const horizontalFirst = chooseRandom([true, false]);
    puzzle.tap(horizontalFirst ? [chooseRandom(range(columns)), rows - 1] : [columns - 1, chooseRandom(range(rows))]);
    puzzle.tap(horizontalFirst ? [puzzle.getEmptyPoint()[0], chooseRandom(range(rows))] : [chooseRandom(range(columns)), puzzle.getEmptyPoint()[1]]);
    return puzzle;
  }

  public readonly columns: number;
  public readonly rows: number;
  constructor(
    n: number | Point2D = 4,
    private numbers: number[] = range(1, Array.isArray(n) ? n[0] * n[1] : n ** 2).concat(0),
  ) {
    super();
    if (Array.isArray(n)) [this.columns, this.rows] = n;
    else this.columns = this.rows = n;
    if (!this.isCorrect()) throw new RangeError("Invalid numbers");
  }

  get length() { return this.numbers.length; }
  getNumbers() { return this.numbers; }

  clone() { return new (this.constructor as typeof FifteenPuzzle)([this.rows, this.columns], this.numbers.slice()); }
  equals(point1: Point2D, point2: Point2D) { return point1[0] === point2[0] && point1[1] === point2[1]; }
  convertPointToIndex(point: Point2D) { return point[0] + point[1] * this.columns; }
  convertIndexToPoint(index: number): Point2D { return [index % this.columns, floor(index / this.columns)]; }
  setValueOfPoint(point: Point2D, value: number) { this.numbers[this.convertPointToIndex(point)] = value; return this; }
  getValueFromPoint(point: Point2D) { return this.numbers[this.convertPointToIndex(point)]; }
  getPointFromValue(value: number) { return this.convertIndexToPoint(this.numbers.findIndex(i => i === value)); }
  getEmptyPoint() { return this.getPointFromValue(0); }

  isCorrect() {
    return this.numbers.length === this.columns * this.rows && range(this.numbers.length).every(i => this.numbers.includes(i));
  }
  isSolvable() {
    if (!this.isCorrect()) return false;
    const cloned = this.clone();
    if (!cloned.equals(cloned.getPointFromValue(0), [cloned.columns, cloned.rows])) {
      cloned.tap([cloned.columns - 1, cloned.getPointFromValue(0)[1]]);
      cloned.tap([cloned.columns - 1, cloned.rows - 1]);
    }
    const swapCount = range(cloned.columns * cloned.rows - 1).reduce((acc, i) => {
      const j = cloned.getPointFromValue(i + 1);
      if (i !== cloned.convertPointToIndex(j)) {
        cloned.swap(cloned.convertIndexToPoint(i), j);
        return acc + 1;
      } else return acc;
    });
    return swapCount % 2 === 0; // A puzzle is solvable only when swapCount is an even.
  }

  swap(point1: Point2D, point2: Point2D) {
    const value1 = this.getValueFromPoint(point1);
    const value2 = this.getValueFromPoint(point2);
    this.setValueOfPoint(point1, value2);
    this.setValueOfPoint(point2, value1);
    return true;
  }
  tap(point: Point2D) {
    const emptyPoint = this.getEmptyPoint();
    if (this.equals(point, emptyPoint)) return false;
    if (point[0] !== emptyPoint[0] && point[1] !== emptyPoint[1]) return false;
    const isVertical = point[0] === emptyPoint[0];
    const axis = +isVertical;
    const distance = emptyPoint[axis] - point[axis];
    range(1, abs(distance) + 1)
      .map(i => distance > 0 ? i : -i)
      .forEach(i => this.swap(
        this.getEmptyPoint(),
        isVertical ? [point[0], emptyPoint[1] - i] : [emptyPoint[0] - i, point[1]]
      ));
    this.clone();
    return true;
  }
}
