import React, { PropsWithChildren } from 'react';
import { FifteenPuzzle, Point2D } from '../../fifteen-puzzle';
import { useForceUpdate, joinClassNames, range, isMobile, style } from '../../utils';
import styles from './renderer.scss';

export interface FifteenPuzzleRendererProps {
  puzzle: FifteenPuzzle;
}
export function FifteenPuzzleRenderer(props: FifteenPuzzleRendererProps) {
  const TAP_EVENT = isMobile ? "onTouchStart" : "onMouseDown";
  const forceUpdate = useForceUpdate();
  const numbers = props.puzzle.numbers;
  return (
    <div className={styles.fifteenPuzzleRenderer}
         style={style.var({ columns: props.puzzle.columns, rows: props.puzzle.rows })}
    >
      { range(numbers.length).map((number) => {
        const point = props.puzzle.getPointFromValue(number);
        const index = props.puzzle.pointUtil.convertPointToIndex(point);
        const onTap = () => (props.puzzle.tap(point), console.log("tapped", point), forceUpdate());
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
function Piece<Z extends boolean>(props: PropsWithChildren<PieceProps<Z>>) {
  return <div className={joinClassNames(styles.piece, props.correct && styles.correct, props.zero && styles.zero)}
              style={style.var({ x: props.x, y: props.y })}
              key={props.key}
              {...{ [props.tapEvent]: props.onTap }}> { props.children } </div>;
}
