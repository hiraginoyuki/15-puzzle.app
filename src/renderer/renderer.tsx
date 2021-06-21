import React, { CSSProperties, useCallback, useMemo, useRef, useState } from 'react';
import { useForceUpdate, joinClassNames as join, isMobile, defineOnGlobal, useKeydown } from '../utils';
import styles from './renderer.scss';
import { Puzzle, PuzzleManager } from '../puzzle-manager';
import { useCanvas } from '../utils/use-canvas';
import { useStateRef } from '../utils/use-state-ref';
import { Vec2 } from '15-puzzle/dist/vec2';

const TAP_EVENT = isMobile ? "onTouchStart" : "onMouseDown";

function getSolveTime(puzzle: Puzzle, time: number) {
  if (puzzle.isSolved) {
    return (puzzle.timeSolved as number) - (puzzle.timeStarted as number)
  } else if (puzzle.isSolving) {
    return time - (puzzle.timeStarted as number);
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
  const { width, height, isSolving } = puzzle;

  const reset = useCallback(() => puzzleManager.new(...sizeRef.current as [number, number]), []);
  const tryToReset = useCallback(() => {
    if (!isSolving) return void setConfirming(false), reset();
    if (!isConfirming) return void setConfirming(true);
    setConfirming(false);
    reset();
  }, [ isSolving, isConfirming, reset ]);

  const tap = useCallback((coord: Vec2, mouseMove: boolean = false) => {
    if (puzzle.isSolved && puzzle.getPiece(coord)) {
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
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(160, 32, 1.5, 1.5, 0, 0, 360);
    ctx.closePath();
    ctx.fill();

    const [ms, s] = parseTime(getSolveTime(puzzle, time), [1000]).map(String);
    ctx.font = "36px 'Roboto Mono'";
    ctx.fillText(s.padStart(2, "0"), 160 - 5.5 - (36 * 43 / 72) * Math.max(2, s.length), 32);
    ctx.font = "24px 'Roboto Mono'";
    ctx.fillText(ms.padStart(3, "0"), 160 + 6, 32);
  }, [puzzleManager], 30);

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
        { useMemo(() => puzzle.in1d.map(piece => (
            <div {...{ [TAP_EVENT]: () => tap(piece.x, piece.y)}}
                  className={styles.listener} key={piece.index} />
          )), [width, height])}
      </div>
    </div>
  </>;
}
