import React from "react";
import { FifteenPuzzle } from "15-puzzle";
import { FifteenPuzzleRenderer } from "../renderer";
import { FlexCenter, defineOnGlobal } from "../utils";
import styles from './app.scss';

defineOnGlobal({ FifteenPuzzle });
export function App() {
  return <>
    <FlexCenter>
      <FifteenPuzzleRenderer />
    </FlexCenter>
    <div className={styles.credit}>
      <a href="https://github.com/hiraginoyuki/webpack.15-puzzle.app"> Made by Yuki Hiragino </a>
    </div>
  </>;
}
