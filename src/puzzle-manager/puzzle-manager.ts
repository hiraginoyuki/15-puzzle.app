import { range } from "../utils";
import { Game, MinimalGameData, Vec2 } from "./game-data";
import { EventEmitter } from 'events';

export class PuzzleManager extends EventEmitter {
  public games: Game[] = [];
  public get current(): Game {
    return this.games[this.games.length - 1];
  }

  public new(...args: MinimalGameData[0]): this {
    this.games.push(Game.generateRandom(...args));
    this.emit("update");
    return this;
  }
  public tap(coord: Vec2) {
    if (this.current.isSolved) return false;
    const tapSucceeded = this.current.tap(coord);
    if (this.current.isSolved) this.emit("solve");
    if (tapSucceeded) this.emit("update");
    return tapSucceeded;
  }

  public getNumbers() {
    const puzzle = this.current;
    if (!puzzle) return [];
    return range(puzzle.columns * puzzle.rows)
      .map(number => {
        const coord = puzzle.getPointFromValue(number);
        const index = puzzle.pointUtil.convertPointToIndex(coord);
        return { coord, number, isCorrect: number == index + 1 };
      });
  }
}
