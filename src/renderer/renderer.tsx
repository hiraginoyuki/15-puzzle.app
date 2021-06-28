import React, { CSSProperties, useCallback, useMemo, useRef, useState } from 'react';
import { useForceUpdate, joinClassNames as join, defineOnGlobal, useKeydown, range } from '../utils';
import styles from './renderer.scss';
import { Puzzle, PuzzleManager } from '../puzzle-manager';
import { useCanvas } from '../utils/use-canvas';
import { useStateRef } from '../utils/use-state-ref';
import { Vec2 } from '15-puzzle/dist/vec2';
import { TapData } from '15-puzzle/dist/15-puzzle';

function getSolveTime(puzzle: Puzzle, time: number) {
  if (puzzle.isSolved) {
    return puzzle.timeSolved! - puzzle.timeStarted!;
  } else if (puzzle.isSolving) {
    return time - puzzle.timeStarted!;
  } else return 0;
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

  defineOnGlobal({ puzzleManager, forceUpdate, sizeRef, keyMap });

  const ref = useCanvas((ctx, time) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const distance = (a: Vec2, b: Vec2) => {
      const v = a.add(b.mul(-1));
      return Math.abs(v.x) + Math.abs(v.y);
    };
    const taps = puzzle.taps?.length || 0;
    const moves = (puzzle.taps as any)?.reduce(
      ([prevTap, prevCount]: [Vec2, number], tap: TapData) => [new Vec2(tap.x, tap.y), prevCount + distance(prevTap, new Vec2(tap.x, tap.y))],
      [Puzzle.generateRandom(puzzle.seed).getPiece(0)!.toVec2(), 0]
    )?.[1] || 0;

    ctx.fillStyle = `#ffffff${puzzle.isSolved?"f":"b"}f`;
    ctx.font = "20px 'Roboto Mono'";
    ctx.fillText(String(taps),  200 - (20 /2 * 43/72) * (String(taps).length),  64);
    ctx.fillText(String(moves), 120 - (20 /2 * 43/72) * (String(moves).length), 64);

    ctx.fillStyle = "#ffffff";
    const [ms, s] = parseTime(getSolveTime(puzzle, time), [1000]).map(String);
    ctx.font = "36px 'Roboto Mono'";
    ctx.fillText(s.padStart(2, "0"), 160 - 5.5 - (36 * 43/72) * Math.max(2, s.length), 32);
    ctx.font = "24px 'Roboto Mono'";
    ctx.fillText(ms.padStart(3, "0"), 160 + 6, 32);

    ctx.beginPath();
    ctx.ellipse(160, 32, 1.5, 1.5, 0, 0, 360);
    ctx.closePath();
    ctx.fill();
  }, [puzzle], 30);

  const toVec2 = (index: number, width: number) => new Vec2(index % puzzle.width, Math.floor(index / puzzle.width));

  return <>
    <div style={{ "--columns": width, "--rows": height } as CSSProperties}
         className={styles.fifteenPuzzleRenderer}>
      <canvas className={styles.timerCanvas}
              width={320} height={80} ref={ref} />
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
