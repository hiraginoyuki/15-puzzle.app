import { Puzzle, MinimalGameData } from "./puzzle";
import { EventEmitter } from 'events';
import { Vec2 } from "15-puzzle/dist/vec2";

export class PuzzleManager extends EventEmitter {
  public games: Puzzle[] = [];
  public get current(): Puzzle {
    return this.games[this.games.length - 1];
  }

  public new(...args: MinimalGameData[0]): this {
    this.games.push(Puzzle.generateRandom(...args as [any]));
    this.emit("update");
    return this;
  }
  public tap(coord: Vec2) {
    if (this.current.isSolved) return false;
    const tapSucceeded = this.current.tap(...coord as [number, number]);
    if (this.current.isSolved) this.emit("solve");
    if (tapSucceeded) this.emit("update");
    return tapSucceeded;
  }
}
