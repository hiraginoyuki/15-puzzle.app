import { FifteenPuzzle } from "15-puzzle";
import { Validator, _switch } from "../utils";

export type Vec2 = [number, number];
export interface TapData {
  time: number;
  coord: Vec2;
}

export type MinimalGameData = [
  //@ts-ignore
  [...([] | [string]), ...([] | [number] | [number, number])], // [seed, columns, rows]
  [number] | [number, number] | [number, number, number],      // [tGenerate, tStart, tSolve]
  ...[number, Vec2][]                                          // [tTapRelative, [x, y]]
];

//@ts-ignore
export class Game extends FifteenPuzzle {
  public puzzleInstance: FifteenPuzzle;
  public constructor(
    public readonly seed: string,
    columns: number,
    rows: number,
    public readonly timeGenerated: number,
    public taps: TapData[] = [],
  ) {
    super([columns, rows], FifteenPuzzle.generateRandom(seed, columns, rows).numbers);
    this.taps.forEach(tap => this.puzzleInstance.tap(tap.coord));
  }

  public get timeStarted(): number | null {
    return this.timeGenerated + this.taps[0].time;
  }
  public get timeSolved(): number | null {
    return this.timeGenerated + (this.isSolved() && this.taps[this.taps.length - 1] as any);
  }

  public tap(coord: Vec2) {
    const tapResult = super.tap(coord);
    if (tapResult) {
      this.taps.push({ time: +new Date - this.timeGenerated, coord });
    }
    return tapResult;
  }

  public _BRANCHLESS_tap(coord: Vec2) {
    return this.taps.length !== (this.taps.push(...[{ time: +new Date - this.timeGenerated, coord }].slice(+super.tap(coord))), this.taps.length);
  }

  public static generateRandom(...args: MinimalGameData[0]): Game {
    const { seed, columns, rows } = super.convertArgs(args);
    return new this(seed, columns, rows, +new Date, []);
  }

  public static fromMinimalData(data: MinimalGameData) {
    if (!this.validateMinimalData(data)) return null;
    const { seed, columns, rows } = FifteenPuzzle.convertArgs(data[0]);
    const taps = (data.slice(2) as MinimalGameData[2][]).map(([ time, coord ]) => ({ time, coord }));
    return new Game(seed, columns, rows, data[1][0], taps);
  }
  public static toMinimalData(data: Game): MinimalGameData {
    return [
      [
        ...data.seed    === ""+data.timeGenerated ? [] : [data.seed],
        ...data.columns === 4                     ? [] : [data.columns],
        ...data.rows    === data.columns          ? [] : [data.rows],
      ],
      [
        data.timeGenerated,
        ...data.timeStarted === null ? [] : [data.timeStarted],
        ...data.timeSolved  === null ? [] : [data.timeSolved],
      ],
      ...data.taps.map(tap => [tap.time, tap.coord])
    ] as MinimalGameData;
  }

  public static validateMinimalData(data: any[][]): data is MinimalGameData {
    const { validator, expect } = new Validator();

    expect(data)
      .toBeAnArray()
      .and
      .toSatisfy(data => data.every(Array.isArray))
    .then(() => {
      const [ config, times ] = data;
      const taps = data.slice(2);
      const isSeedPassed = typeof config[0] === "string";
      let columns = 4, rows = 4;

      expect(config)
        .toSatisfy(config =>
          _switch(config.length - <any>isSeedPassed)
            .case(0, true)
            .case(1, () => Number.isInteger(columns = rows = config[+<any>isSeedPassed]))
            .case(2, () => ([columns, rows] = config.slice(+<any>isSeedPassed)).every(Number.isInteger))
            .run())
        .and
        .toSatisfy(config => config.every((data, index) =>
          ( isSeedPassed && index === 0 ) || typeof data === "number"));

      expect(times)
        .toSatisfy(times => [1, 2, 3].includes(times.length))
        .and
        .toSatisfy(times => times.every(Number.isInteger));

      taps.forEach(data => validator
        .expect(data[0])
          .toBeAnInteger()
        .then
        .expect(data[1])
          .toBeAnArray()
          .and
          .toSatisfy(tap => tap.every(Number.isInteger)
          /************/ && 0 <= tap[0] && tap[0] <= columns
          /************/ && 0 <= tap[1] && tap[1] <= rows)
      );
    });

    return validator.result;
  }
}
