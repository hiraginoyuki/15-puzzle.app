import { FifteenPuzzle } from "15-puzzle";
import { range } from "./utils";
import { io, Socket } from 'socket.io-client';

type Point2D = [number, number];

export class PuzzleManager {
  public puzzleInstance: FifteenPuzzle;

  public socket: Socket;
  public constructor(private onUpdate: () => any = () => {}) {
    this.clean();
    this.puzzleInstance = FifteenPuzzle.generateRandom();
    this.socket = io("http://kazukazu123123.f5.si");
    this.socket.on("puzzle", (arr: number[]) => {
      this.puzzleInstance.numbers = arr;
      this.updateSolvedState();
      this.onUpdate();
    });
  }

  public setOnUpdate(onUpdate: () => any): this {
    this.onUpdate = onUpdate;
    return this;
  }
  
  public isSolved = false;
  private clean() {
    this.isSolved = false;
  }

  private updateSolvedState() {
    this.isSolved = this.puzzleInstance.isSolved();
  }

  public generate(): this {
    this.clean();
    this.socket.emit("reset");
    return this;
  }

  public tap(coord: Point2D): boolean {
    if (this.isSolved) return false;
    const succeeded = this.puzzleInstance.tap(coord);
    if (!succeeded) return false;
    this.updateSolvedState();
    this.onUpdate();
    return true;
  }

  public getNumbers() {
    const puzzle = this.puzzleInstance;
    return range(puzzle.columns * puzzle.rows)
      .map(number => {
        const coord = puzzle.getPointFromValue(number);
        const index = puzzle.pointUtil.convertPointToIndex(coord);
        return { coord, number, isCorrect: number == index + 1 };
      });
  }

  // public forceSolve() {
  //   const puzzle = this.puzzleInstance;
  //   puzzle.numbers = [...Array(puzzle.columns * puzzle.rows - 1)].map((_, i) => i + 1).concat(0);
  //   this.onUpdate();
  // }
}
`
<html>
<head>
	<title>15puzzle-multiplayer</title>
	<meta charset="utf-8">
	<script src="socket.io/socket.io.js" type="text/javascript"></script>
	<style>
		body {
			background: #333;
		}
		.puzzle {
			width: 300px;
			height: 300px;
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-auto-rows: 1fr;
		}
		.piece {
			background: #222;
			color: #ccc;
			margin: 5%;
			width: 90%;
			height: 90%;
			user-select: none;
			font-size: 24pt;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.piece.correct {
			filter: invert(1);
		}
	</style>
</head>
<body>
	<div class="puzzle"></div>
	<script>
		const getPoint = (index, columns = 4) => [index % columns, Math.floor(index / columns)];
		const keyMap = {
			4:[0,0], 5:[1,0], 6:[2,0], 7:[3,0],
			r:[0,1], t:[1,1], y:[2,1], u:[3,1],
			f:[0,2], g:[1,2], h:[2,2], j:[3,2],
			v:[0,3], b:[1,3], n:[2,3], m:[3,3],
		};
		const socket = io();
		socket.on("disconnect", () => {
			const puzzleElement = document.querySelector(".puzzle");
			[...puzzleElement.children].forEach(e => e.remove());
		});
		socket.on("puzzle", async function(puzzle) {
			const puzzleElement = document.querySelector(".puzzle");
			[...puzzleElement.children].forEach(e => e.remove());
			puzzle.forEach((pz, index) => {
				const coord = getPoint(index);
				const puzzlepiece = document.createElement("div");
				puzzlepiece.className = "piece";
				if (pz == index + 1) puzzlepiece.classList.add("correct");
				puzzlepiece.textContent = pz;
				puzzlepiece.addEventListener("mousedown", () => socket.emit("tap", coord));
				if (pz == 0) puzzlepiece.style = "transform: scale(0)";
				puzzleElement.appendChild(puzzlepiece);
			});
		});
		
		document.addEventListener("DOMContentLoaded", () =>
			document.addEventListener("keydown", ({key}) => {
				if (key == " ") return socket.emit("reset");
				const p = keyMap[key.toLowerCase()];
				if (Array.isArray(p)) socket.emit("tap", p);
			})
		);
	</script>
</body>
</html>
`;
