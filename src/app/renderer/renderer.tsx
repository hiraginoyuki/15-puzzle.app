import React, { CSSProperties, PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { useForceUpdate, joinClassNames as join, isMobile, defineOnGlobal, range } from '../../utils';
import styles from './renderer.scss';
import { PuzzleManager } from '../../puzzle-manager';

type Point2D = [number, number];

const keyMap = {
  4:[0,0], 5:[1,0], 6:[2,0], 7:[3,0],
  r:[0,1], t:[1,1], y:[2,1], u:[3,1],
  f:[0,2], g:[1,2], h:[2,2], j:[3,2],
  v:[0,3], b:[1,3], n:[2,3], m:[3,3],
} as { [key: string]: Point2D };

const TAP_EVENT = isMobile ? "onTouchStart" : "onMouseDown";

export function FifteenPuzzleRenderer() {
  const forceUpdate = useForceUpdate();
  const puzzleManager = useMemo(() => new PuzzleManager(forceUpdate), []);
  const { isSolved, currentPuzzle } = puzzleManager;
  const { columns, rows, pointUtil } = currentPuzzle;

  const reset = useCallback(() => puzzleManager.reset(), [puzzleManager]);
  const onTap = useCallback((point: Point2D) => (
    (puzzleManager.isSolved && point[0] == columns - 1 && point[1] == rows - 1)
      ? reset()
      : puzzleManager.tap(point)
  ), [puzzleManager, reset]);
  const onKeyDown = useCallback((key: string) => {
    if (key == " ") reset();
    const point = keyMap[key.toLowerCase()];
    if (Array.isArray(point)) onTap(point);
  }, [onTap]);

  useEffect(() => {
    defineOnGlobal({ puzzleManager, forceUpdate });
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", ({ key }) => onKeyDown(key));
  }, [onKeyDown]);

  const pieces = puzzleManager.getNumbers().map(({ coord, number, isCorrect }) => (
    <Piece hidden={number == 0 && !isSolved} correct={isCorrect} coord={coord} key={number}>
      <div className={styles.content}>
        { number == 0 ? "R" : number }
      </div>
    </Piece>
  ));

  const listeners = range(columns * rows).map(index => (
    <div className={styles.listener} key={index}
         {...{ [TAP_EVENT]: () => {
           console.log("nooooo");
           onTap(pointUtil.convertIndexToPoint(index));
         }}}>
      test
    </div>
  ));

  return (
    <div className={styles.fifteenPuzzleRenderer}
         style={{ "--columns": columns, "--rows": rows } as CSSProperties}>
      { pieces }
      <div className={styles.tapListeners} aria-hidden>
        { listeners }
      </div>
    </div>
  );
}

interface PieceProps {
  correct: boolean;
  hidden: boolean;
  coord: Point2D;
}
function Piece(props: PropsWithChildren<PieceProps>) {
  const [x, y] = props.coord;
  return (
    <div className={join(styles.piece,
                         props.correct && styles.correct,
                         props.hidden && styles.hidden)}
         style={{ "--x": x, "--y": y } as CSSProperties}>
      { props.children }
    </div>
  );
}
