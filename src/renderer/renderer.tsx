import React, { CSSProperties, PropsWithChildren, useCallback, useMemo, useRef, useState } from 'react';
import { useForceUpdate, joinClassNames as join, isMobile, defineOnGlobal, range, useKeydown } from '../utils';
import styles from './renderer.scss';
import { Game, PuzzleManager, Vec2 } from '../puzzle-manager';
import { useCanvas } from '../utils/use-canvas';

const TAP_EVENT = isMobile ? "onTouchStart" : "onMouseDown";
const equals = (p1: Vec2, p2: Vec2) => p1[0] === p2[0] && p1[1] === p2[1];

function getSolveTime(game: Game, time: number) {
  if (game.isSolved) {
    return (game.timeSolved as number) - (game.timeStarted as number)
  } else if (game.isSolving) {
    return time - (game.timeStarted as number);
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
  } as { [key: string]: Vec2 });

  const forceUpdate = useForceUpdate();
  const [ isConfirming, setConfirming ] = useState(false);
  const [ size, setSize ] = useState<Vec2>([4, 4]);

  const puzzleManager = useMemo(() => new PuzzleManager().on("update", forceUpdate).new(...size), [size]);
  const { columns, rows, pointUtil, isSolving, isSolved } = puzzleManager.current;

  const reset = useCallback(() => puzzleManager.new(...size), [size]);
  const tryToReset = useCallback(() => {
    if (!isSolving) return void setConfirming(false), reset();
    if (!isConfirming) return void setConfirming(true);
    setConfirming(false);
    reset();
  }, [ isSolving, isConfirming, reset ]);

  const tap = useCallback((coord: Vec2, mouseMove: boolean = false) => {
    if (puzzleManager.current.isSolved && equals(coord, puzzleManager.current.size.map(c => c - 1) as Vec2) && !mouseMove) {
      tryToReset();
    } else {
      const result = puzzleManager.tap(coord);
      if (result) setConfirming(false);
    }
  }, [ puzzleManager, tryToReset ]);

  useKeydown(document, ({ key }) => {
    if (key == " ") tryToReset();
    const point = keyMap.current[key.toLowerCase()];
    if (Array.isArray(point)) tap(point);
  }, [ tap ]);

  defineOnGlobal({ puzzleManager, forceUpdate, setSize, keyMap });

  const ref = useCanvas((ctx, time) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(160, 32, 1.5, 1.5, 0, 0, 360);
    ctx.closePath();
    ctx.fill();

    const [ms, s] = parseTime(getSolveTime(puzzleManager.current, time), [1000]).map(String);
    ctx.font = "36px 'Roboto Mono'";
    ctx.fillText(s.padStart(2, "0"), 160 - 5.5 - (36 * 43 / 72) * Math.max(2, s.length), 32);
    ctx.font = "24px 'Roboto Mono'";
    ctx.fillText(ms.padStart(3, "0"), 160 + 6, 32);
  }, [puzzleManager], 30);

  return <>
    <div style={{ "--columns": columns, "--rows": rows } as CSSProperties}
         className={styles.fifteenPuzzleRenderer}>
      <canvas className={styles.timerCanvas}
              width={320} height={80} ref={ref} />
      {
        puzzleManager.getNumbers().map(({ coord, number, isCorrect }) => (
          <Piece hidden={number == 0 && !isSolved} correct={isCorrect} coord={coord} key={number}>
            <div className={styles.content}>
              { number == 0 ? "R" : number }
            </div>
          </Piece>
        ))
      }
      <div className={styles.tapListeners} aria-hidden>
        { useMemo(() => range(columns * rows).map(index => (
            <div {...{ [TAP_EVENT]: () => tap(pointUtil.convertIndexToPoint(index))}}
                  className={styles.listener} key={index} />
          )), [columns, rows])}
      </div>
    </div>
  </>;
}

interface PieceProps {
  correct: boolean;
  hidden: boolean;
  coord: Vec2;
}
function Piece(props: PropsWithChildren<PieceProps>) {
  const [x, y] = props.coord;
  return (
    <div style={{ "--x": x, "--y": y } as CSSProperties}
         className={join(styles.piece,
                         props.correct && styles.correct,
                         props.hidden && styles.hidden)}>
      { props.children }
    </div>
  );
}
