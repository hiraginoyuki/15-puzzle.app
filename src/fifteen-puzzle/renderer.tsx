import React from 'react';
import { FifteenPuzzle } from './fifteen-puzzle';
import styles from './renderer.module.scss';
import { useForceUpdate } from '../utils';

export interface FifteenPuzzleRendererProps {
  puzzle: FifteenPuzzle;
}
export function FifteenPuzzleRenderer(props: FifteenPuzzleRendererProps) {
  const forceUpdate = useForceUpdate();

  const numbers = props.puzzle.getNumbers();
  return (
    <div className={styles.fifteenPuzzleRenderer}
         data-columns={props.puzzle.columns}
         data-rows={props.puzzle.rows}>
      { numbers.map((number, i) => {
        const point = props.puzzle.getPoint(i);
        return <div key={i}
                    data-x={point[0]}
                    data-y={point[1]}
                    onClick={() => (props.puzzle.tap(point), forceUpdate())}> {number} </div>;
      }) }
    </div>
  );
}
