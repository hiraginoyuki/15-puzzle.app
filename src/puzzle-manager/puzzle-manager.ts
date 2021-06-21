import { Puzzle, MinimalGameData } from "./puzzle";
import { EventEmitter } from 'events';

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
  public tap(x: number, y: number) {
    if (this.current.isSolved) return false;
    const tapSucceeded = this.current.tap(x, y);
    if (this.current.isSolved) this.emit("solve");
    if (tapSucceeded) this.emit("update");
    return tapSucceeded;
  }
}
