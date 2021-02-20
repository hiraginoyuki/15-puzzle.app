import React, { PropsWithChildren } from 'react';
import { FifteenPuzzle, Point2D } from '../../fifteen-puzzle';
import { useForceUpdate, joinClassNames, range, isMobile, style } from '../../utils';
import styles from './renderer.scss';

export interface FifteenPuzzleRendererProps {
  puzzle: FifteenPuzzle;
}
export function FifteenPuzzleRenderer({ puzzle }: FifteenPuzzleRendererProps) {
  const TAP_EVENT = isMobile ? "onTouchStart" : "onMouseDown";
  const forceUpdate = useForceUpdate();
  return (
    <div className={styles.fifteenPuzzleRenderer}
         style={style.var({ columns: puzzle.columns, rows: puzzle.rows })}
    >
      { range(puzzle.numbers.length).map((number) => {
        const point = puzzle.getPointFromValue(number);
        const index = puzzle.pointUtil.convertPointToIndex(point);
        const onTap = () => (puzzle.tap(point), console.log("tapped", point), forceUpdate());
        return <Piece key={number} zero={number == 0} correct={number == index + 1}
                      tapEvent={TAP_EVENT} onTap={onTap}
                      x={point[0]} y={point[1]}>
          <div className={styles.number}> {number} </div>
        </Piece>;
      }) }
    </div>
  );
}

interface PieceProps<Z extends boolean> {
  x: number;
  y: number;
  tapEvent: "onTouchStart" | "onMouseDown";
  onTap(point: Point2D): any;
  key: string | number;
  zero: Z;
  correct: Z extends true ? false : boolean;
}
function Piece<Z extends boolean>({ x, y, tapEvent, onTap, key, zero, correct, children }: PropsWithChildren<PieceProps<Z>>) {
  return <div className={joinClassNames(styles.piece, correct && styles.correct, zero && styles.zero)}
              style={style.var({ x, y })}
              key={key}
              {...{ [tapEvent]: onTap }}> { children } </div>;
}
