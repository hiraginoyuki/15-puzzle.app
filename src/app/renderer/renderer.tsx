import React, { CSSProperties, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { useForceUpdate, joinClassNames as join, isMobile, defineOnGlobal, range, useOnKeyDown } from '../../utils';
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
  const [ isConfirming, setConfirming ] = useState(false);
  const puzzleManager = useMemo(() => new PuzzleManager(forceUpdate), []);
  const { isSolving, isSolved, currentPuzzle } = puzzleManager;
  const { columns, rows, pointUtil } = currentPuzzle;

  const tryToReset = useCallback(() => {
    if (!isSolving) return void setConfirming(false), puzzleManager.reset();
    if (!isConfirming) return void setConfirming(true);
    setConfirming(false);
    puzzleManager.reset();
  }, [ isSolving, isConfirming, puzzleManager ]);

  const onTap = useCallback((point: Point2D) => {
    if (puzzleManager.isSolved && currentPuzzle.getValueFromPoint(point) == 0) {
      setConfirming(false);
      tryToReset();
    } else {
      puzzleManager.tap(point);
    }
  }, [ puzzleManager, tryToReset ]);

  useOnKeyDown((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key == " ") tryToReset();
    const point = keyMap[key];
    if (Array.isArray(point)) onTap(point);
  }, [ onTap ]);

  useEffect(() => {
    defineOnGlobal({ puzzleManager, forceUpdate });
  }, []);

  const pieces = puzzleManager.getNumbers().map(({ coord, number, isCorrect }) => (
    <Piece hidden={number == 0 && !isSolved} correct={isCorrect} coord={coord} key={number}>
      <div className={styles.content}>
        { number == 0 ? "R" : number }
      </div>
    </Piece>
  ));

  const listeners = range(columns * rows).map(index => (
    <div className={styles.listener} key={index}
         {...{ [TAP_EVENT]: () => onTap(pointUtil.convertIndexToPoint(index))}}></div>
  ));

  return (
    <div className={join(styles.fifteenPuzzleRenderer)}
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
