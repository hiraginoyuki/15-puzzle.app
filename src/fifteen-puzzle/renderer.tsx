import React from 'react';
import { FifteenPuzzle } from './fifteen-puzzle';
import styles from './renderer.module.scss';

export interface FifteenPuzzleRendererProps {
  puzzle: FifteenPuzzle;
}
export function FifteenPuzzleRenderer(props: FifteenPuzzleRendererProps) {
  return <div className={styles.fifteenPuzzleRenderer} data-columns={props.puzzle.columns} data-rows={props.puzzle.rows}>
    
  </div>;
}
