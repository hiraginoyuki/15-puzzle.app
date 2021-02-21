import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { FifteenPuzzle, Point2D } from '../../fifteen-puzzle';
import { useForceUpdate, joinClassNames, range, isMobile, style, useComputedState, defineOnGlobal } from '../../utils';
import styles from './renderer.scss';

const keys = [
  "4", "5", "6", "7",
  "r", "t", "y", "u",
  "f", "g", "h", "j",
  "v", "b", "n", "m",
] as const;
const keyMap: { [key: string]: Point2D } = Object.fromEntries(
  (Object.entries(keys) as any as [number, string][]).map(([index, key]) => [key, [index % 4, Math.floor(index / 4)]])
);
console.log(keyMap);

function forceSolve(puzzle: FifteenPuzzle): FifteenPuzzle {
  puzzle.numbers = [...Array(puzzle.columns * puzzle.rows - 1)].map((_, i) => i + 1).concat(0);
  return puzzle;
}
defineOnGlobal({ forceSolve });

export function FifteenPuzzleRenderer() {
  const [ puzzle, setPuzzle ] = useState(FifteenPuzzle.generateRandom(4));
  const TAP_EVENT = isMobile ? "onTouchStart" : "onMouseDown";
  const forceUpdate = useForceUpdate();
  const listener = useRef<(event: KeyboardEvent) => any>();

  function reset() {
    setPuzzle(FifteenPuzzle.generateRandom());
  }

  function onTap(point: Point2D) {
    puzzle.tap(point);
    console.log("tapped", point);
    forceUpdate();
  };

  function onKeyDown(key: string) {
    if (key == " ") reset();
    const point = keyMap[key];
    console.log(key, point);
    if (Array.isArray(point)) onTap(point);
  }

  useEffect(() => defineOnGlobal({ puzzle, setPuzzle, forceUpdate }));
  useEffect(() => {
    document.removeEventListener("keydown", listener.current!);
    document.addEventListener("keydown", listener.current = ({ key }) => onKeyDown(key));
  }, [puzzle]);

  return (
    <div className={styles.fifteenPuzzleRenderer}
         style={style.var({ columns: puzzle.columns, rows: puzzle.rows })}
    >
      { range(puzzle.numbers.length).map((number) => {
        const point = puzzle.getPointFromValue(number);
        const index = puzzle.pointUtil.convertPointToIndex(point);
        const isZero = number == 0;
        const isSolved = useComputedState(() => puzzle.isSolved());
        return <Piece key={number} hidden={isZero && !isSolved.value} correct={number == index + 1}
                      tapEvent={TAP_EVENT} onTap={isZero && isSolved.value ? reset : onTap}
                      x={point[0]} y={point[1]}>
          { isZero
            ? <div className={styles.number}> R </div>
            : <div className={styles.number}> {number} </div>
          }
        </Piece>;
      }) }
    </div>
  );
}

interface PieceProps {
  x: number;
  y: number;
  hidden: boolean;
  tapEvent: "onTouchStart" | "onMouseDown";
  onTap(point: Point2D): any;
  key: string | number;
  correct: boolean;
}
function Piece({ x, y, hidden, tapEvent, onTap, key, correct, children }: PropsWithChildren<PieceProps>) {
  return <div className={joinClassNames(styles.piece, correct && styles.correct, hidden && styles.hidden)}
              style={style.var({ x, y })}
              key={key}
              {...{ [tapEvent]: () => onTap([x, y]) }}> { children } </div>;
}
