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
    <div className={styles.name}>Made by Yuki Hiragino</div>
  </>;
}
