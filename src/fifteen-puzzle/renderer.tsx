import React, { CSSProperties } from 'react';
import { FifteenPuzzle } from './fifteen-puzzle';
import { useForceUpdate, joinClassNames, range, isMobile } from '../utils';
import styles from './renderer.module.scss';

export interface FifteenPuzzleRendererProps {
  puzzle: FifteenPuzzle;
}
export function FifteenPuzzleRenderer(props: FifteenPuzzleRendererProps) {
  const forceUpdate = useForceUpdate();
  const numbers = props.puzzle.getNumbers();
  return (
    <div className={styles.fifteenPuzzleRenderer}
         style={{ "--columns": props.puzzle.columns, "--rows": props.puzzle.rows } as CSSProperties}>
      <style>
      {`
        .flex-container {
          width: 100%;
          height: 100%;
          justify-content: center;
        }
        .flex-container > div {
          margin: auto auto;
        }
      `}
      </style>
      { range(numbers.length).map((number) => {
        const point = props.puzzle.getPoint(number);
        const index = props.puzzle.toIndex(point);
        const onTap = () => (props.puzzle.tap(point), console.log("tapped", point), forceUpdate());
        return <div className={joinClassNames(styles.piece, number === index + 1 && styles.isWhereItShouldBe, number === 0 && styles.zero)}
                    style={{ "--x": point[0], "--y": point[1] } as CSSProperties}
                    key={number}
                    {...{ [isMobile ? "onTouchStart" : "onMouseDown"]: onTap }}>
          <div className={styles.number}> {number} </div>
        </div>;
      }) }
    </div>
  );
}
