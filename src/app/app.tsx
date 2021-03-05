import React from "react";
import { FifteenPuzzle } from "15-puzzle";
import { FifteenPuzzleRenderer } from "./renderer";
import { FlexCenteringContainer, defineOnGlobal } from "../utils";
import styles from './app.scss';

defineOnGlobal({ FifteenPuzzle });
export function App() {
  return <>
    <FlexCenteringContainer>
      <FifteenPuzzleRenderer />
    </FlexCenteringContainer>
    <div className={styles.credit}>
      <a href="https://github.com/HiraginoYuki/15-puzzle.app"> Made by Yuki Hiragino </a>
    </div>
  </>;
}
