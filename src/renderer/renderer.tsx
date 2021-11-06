import React, { CSSProperties, useCallback, useMemo, useRef, useState } from 'react';
import { useForceUpdate, joinClassNames as join, defineOnGlobal, useKeydown, range } from '../utils';
import styles from './renderer.scss';
import { Puzzle, PuzzleManager } from '../puzzle-manager';
import { useCanvas } from '../utils/use-canvas';
import { useStateRef } from '../utils/use-state-ref';
import { Vec2 } from '15-puzzle/dist/vec2';
import { TapData } from '15-puzzle/dist/15-puzzle';

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 80;
const CANVAS_SCALE = 4;

function getSolveTime(puzzle: Puzzle, time: number) {
  if (puzzle.isSolved) {
    return puzzle.timeSolved! - puzzle.timeStarted!;
  } else if (puzzle.isSolving) {
    return time - puzzle.timeStarted!;
  } else return 0;
}

function fixDigit(number: number, integerDigit: number, decimalDigit: number) {
  return [
    String(Math.floor(number)).padStart(integerDigit, "0"),
    String(Math.round(number % 1 * 10 ** decimalDigit)).padEnd(decimalDigit, "0"),
  ] as const;
}

function parseTime(time: number, splitters: number[] = [1000]): number[] {
  time = Math.round(time);
  return splitters
    .map(splitter => {
      const i = time % splitter;
      time /= splitter;
      return i;
    })
    .concat(time)
    .map(Math.floor);
}

export function FifteenPuzzleRenderer() {
  const keyMap = useRef({
    4:[0,0], 5:[1,0], 6:[2,0], 7:[3,0],
    r:[0,1], t:[1,1], y:[2,1], u:[3,1],
    f:[0,2], g:[1,2], h:[2,2], j:[3,2],
    v:[0,3], b:[1,3], n:[2,3], m:[3,3],
  } as { [key: string]: [number, number] });

  const forceUpdate = useForceUpdate();
  const [ isConfirming, setConfirming ] = useState(false);
  const sizeRef = useStateRef<Vec2>(new Vec2(4, 4));

  const puzzleManager = useMemo(() => new PuzzleManager().on("update", forceUpdate).new(...sizeRef.current as [number, number]), []);
  const puzzle = puzzleManager.current;
  const { width, height } = puzzle;

  const isMouseDown  = useRef(false);
  const touchEndFlag = useRef(false);
  const swipeLock    = useRef(false);

  type TapSource = "mouse-click" | "mouse-swipe" | "touch-tap" | "touch-swipe" | "keyboard";
  const reset = useCallback(() => {
    puzzleManager.new(...sizeRef.current as [number, number]);
    swipeLock.current = true;
  }, []);
  const tryToReset = useCallback(() => {
    if (!puzzle.isSolving || puzzle.isSolved) return void setConfirming(false), reset();
    if (!isConfirming) return void setConfirming(true);
    setConfirming(false);
    reset();
  }, [ puzzle, isConfirming, reset ]);
  const tap = useCallback((x: number, y: number, tapSource: TapSource) => {
    if (puzzle.isSolved && puzzle[y][x].toVec2().equalTo(new Vec2(puzzle.width - 1, puzzle.height - 1)) && !(
      tapSource === "touch-swipe" || tapSource === "mouse-swipe"
    )) {
      tryToReset();
    } else {
      const result = puzzleManager.tap(x, y);
      if (result) setConfirming(false);
    }
  }, [ puzzleManager, tryToReset ]);

  useKeydown(document, ({ key }) => {
    if (key == " ") tryToReset();
    const point = keyMap.current[key.toLowerCase()];
    //@ts-ignore
    if (Array.isArray(point)) tap(...point, "keyboard");
  }, [ tap ]);

  const [FPS, setFPS] = useState(30);

  defineOnGlobal({ puzzleManager, forceUpdate, sizeRef, keyMap, FPS, setFPS });

  const ref = useCanvas((ctx, time) => {
    ctx.save()
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.scale(ctx.canvas.width / CANVAS_WIDTH, ctx.canvas.height / CANVAS_HEIGHT)

    const distance = (a: Vec2, b: Vec2) => {
      const v = a.add(b.mul(-1));
      return Math.abs(v.x) + Math.abs(v.y);
    };
    const solveTime = getSolveTime(puzzle, time);
    const [ms, s] = parseTime(solveTime, [1000]).map(String);
    const taps = puzzle.taps?.length || 0;
    const moves = (puzzle.taps as any)?.reduce(
      ([prevTap, prevCount]: [Vec2, number], tap: TapData) => [new Vec2(tap.x, tap.y), prevCount + distance(prevTap, new Vec2(tap.x, tap.y))],
      [Puzzle.generateRandom(puzzle.seed).getPiece(0)!.toVec2(), 0]
    )?.[1] || 0;
    const [tps_int, tps_dec] = fixDigit(taps  * 1000 / solveTime || 0, 2, 2);
    const [mps_int, mps_dec] = fixDigit(moves * 1000 / solveTime || 0, 2, 2);

    ctx.fillStyle = `#ffffff${puzzle.isSolved?"f":"b"}f`;
    ctx.font = "20px 'Roboto Mono'";
    ctx.fillText(String(taps),   260     - (20 * 43/72) /2 * (String(taps).length),   32);
    ctx.fillText(String(moves),   60     - (20 * 43/72) /2 * (String(moves).length),  32);
    ctx.fillText(String(tps_int),260 - 2 - (20 * 43/72)    * (String(tps_int).length),   52);
    ctx.fillText(String(tps_dec),260 + 2 + (20 * 43/72)    * (String(tps_dec).length-2), 52);
    ctx.fillText(String(mps_int), 60 - 2 - (20 * 43/72)    * (String(mps_int).length),   52);
    ctx.fillText(String(mps_dec), 60 + 2 + (20 * 43/72)    * (String(mps_dec).length-2), 52);

    ctx.fillStyle = "#ffffff";
    ctx.font = "36px 'Roboto Mono'";
    ctx.fillText(s.padStart(2, "0"), 160 - 5.5 - (36 * 43/72) * Math.max(2, s.length), 48);
    ctx.font = "24px 'Roboto Mono'";
    ctx.fillText(ms.padStart(3, "0"), 160 + 6, 48);

    ctx.beginPath();
    ctx.ellipse( 60, 52, 1.0, 1.0, 0, 0, 360);
    ctx.closePath();
    ctx.ellipse(160, 48, 1.5, 1.5, 0, 0, 360);
    ctx.closePath();
    ctx.ellipse(260, 52, 1.0, 1.0, 0, 0, 360);
    ctx.closePath();
    ctx.fill();

    ctx.restore()
  }, [puzzle], FPS);

  const toVec2 = (index: number, width: number) => new Vec2(index % puzzle.width, Math.floor(index / puzzle.width));

  return <>
    <div style={{ "--columns": width, "--rows": height } as CSSProperties}
         className={styles.fifteenPuzzleRenderer}>
      <canvas className={styles.timerCanvas} ref={ref}
              width={CANVAS_WIDTH * CANVAS_SCALE}
              height={CANVAS_HEIGHT * CANVAS_SCALE} />
      {
        puzzle.in1d.sort((p1, p2) => p1.id - p2.id).map(piece => (
          <div style={{ "--x": piece.x, "--y": piece.y } as CSSProperties}
               className={join(styles.piece,
                               piece.isCorrect() && styles.correct,
                               piece.id === 0 && !puzzle.isSolved && styles.hidden)}>
            <div className={styles.content}>
              { piece.id || "R" }
            </div>
          </div>
        ))
      }
      <div className={styles.tapListeners} aria-hidden>
        { useMemo(() => range(puzzle.width * puzzle.height)
          .map(i => toVec2(i, puzzle.width))
          .map(([x, y], i) => (
            <div
              className={styles.listener} key={i} data-index={i}
              onMouseDown={() => {
                isMouseDown.current = true;
                if (touchEndFlag.current) {
                  touchEndFlag.current = false;
                  return;
                }
                tap(x, y, "mouse-click");
              }}
              onMouseMove={() => { if (isMouseDown.current) tap(x, y, "mouse-swipe"); }}
              onMouseUp={() => { isMouseDown.current = false; }}

              onTouchStart={() => {
                swipeLock.current = false;
                tap(x, y, "touch-tap");
              }}
              onTouchMove={({ changedTouches: touches }) => {
                if (swipeLock.current) return;
                const touch = touches.item(0);
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                const [x, y] = toVec2(+(element as any).dataset.index, width);

                tap(x, y, "touch-swipe");
              }}
              onTouchEnd={() => { touchEndFlag.current = true; }}
            />
          )), [puzzle])}
      </div>
    </div>
  </>;
}
