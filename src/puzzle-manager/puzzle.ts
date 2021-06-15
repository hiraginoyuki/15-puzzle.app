import { FifteenPuzzle } from "15-puzzle";
import { Vec2 } from "15-puzzle/dist/vec2";
import { Validator, _switch } from "../utils";

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
export class Puzzle extends FifteenPuzzle {
  // public static fromMinimalData(data: MinimalGameData) {
  //   if (!this.validateMinimalData(data)) return null;
  //   const [ seed, columns, rows ] = FifteenPuzzle.convertArgs(data[0]);
  //   const taps = (data.slice(2) as MinimalGameData[2][]).map(([ time, coord ]) => ({ time, coord }));
  //   return new Puzzle(seed, columns, rows, data[1][0], taps);
  // }
  public static toMinimalData(data: Puzzle): MinimalGameData {
    return [
      [
        ...data.seed   === ""+data.timeGenerated ? [] : [data.seed],
        ...data.width  === 4                     ? [] : [data.width],
        ...data.height === data.width            ? [] : [data.height],
      ],
      [
        data.timeGenerated,
        ...data.timeStarted === null ? [] : [data.timeStarted],
        ...data.timeSolved  === null ? [] : [data.timeSolved],
      ],
      ...data.taps ? data.taps.map(tap => [tap.time, tap.x, tap.y]) : []
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
