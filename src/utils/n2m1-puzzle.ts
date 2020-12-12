import { range } from '.';

const { floor, abs } = Math;

export type Point2D = [number, number];
export class N2m1Puzzle {
  constructor(
    public readonly n: number = 4,
    private nums: number[] = range(1, n ** 2)
  ) {}
  
  clone() { return new (this.constructor as typeof N2m1Puzzle)(this.n, this.nums.slice()); }
  equals(point1: Point2D, point2: Point2D) { return point1[0] === point2[0] && point1[1] === point2[1]; }
  toIndex(point: Point2D) { return point[0] + point[1] * this.n; }
  toPoint(index: number): Point2D { return [index % this.n, floor(index / this.n)]; }
  getValue(point: Point2D) { return this.nums[this.toIndex(point)]; }
  setValue(point: Point2D, value: number) { this.nums[this.toIndex(point)] = value; return this; }
  getPoint(value: number) { return this.toPoint(this.nums.findIndex(i => i === value)); }

  isCorrect() {
    return this.nums.length === this.n ** 2 && range(this.n ** 2).every(i => this.nums.includes(i));
  }
  isSolvable() {
    if (!this.isCorrect()) return false;
    const cloned = this.clone();
    if (!cloned.equals(cloned.getPoint(0), Array(2).fill(cloned.n - 1) as Point2D)) {
      cloned.tap([cloned.n - 1, cloned.getPoint(0)[1]]);
      cloned.tap(Array(2).fill(cloned.n - 1) as Point2D);
    }
    const count = range(cloned.n ** 2 - 1).reduce((acc, i) => {
      const j = cloned.getPoint(i + 1);
      if (i !== cloned.toIndex(j)) {
        cloned.swap(cloned.toPoint(i), j);
        return acc + 1;
      } else return acc;
    })
    return count % 2 === 0;
  }
  
  swap(point1: Point2D, point2: Point2D) {
    const value1 = this.getValue(point1);
    const value2 = this.getValue(point2);
    this.setValue(point1, value2);
    this.setValue(point2, value1);
    return this;
  }
  tap(point: Point2D) {
    const emptyPoint = this.getPoint(0);
    if (this.equals(point, emptyPoint)) return this;
    if (point[0] !== emptyPoint[0] && point[1] !== emptyPoint[1]) return this;
    const isVertical = point[0] === emptyPoint[0];
    const axis = +isVertical;
    const distance = emptyPoint[axis] - point[axis];
    range(1, abs(distance) + 1)
      .map(i => distance > 0 ? i : -i)
      .forEach(i => this.swap(
        this.getPoint(0),
        isVertical ? [point[0], emptyPoint[1] - i] : [emptyPoint[0] - i, point[1]]
      ));
    return this;
  }
}
