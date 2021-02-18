import React, { useState, useEffect } from "react";
import { FifteenPuzzle } from "../fifteen-puzzle";
import { FifteenPuzzleRenderer } from "./renderer";
import { FlexCenteringContainer, defineOnGlobal } from "../utils";
import styles from './app.scss';

defineOnGlobal({ FifteenPuzzle });
export function App() {
  const [ puzzle, setPuzzle ] = useState(FifteenPuzzle.generateRandom(4));
  useEffect(() => defineOnGlobal({ puzzle, setPuzzle }), [puzzle, setPuzzle]);

  return <>
    <FlexCenteringContainer>
      <FifteenPuzzleRenderer puzzle={puzzle} />
      {/* <div style={{backgroundColor:"#fff",width:"100px",height:"100px"}} onClick={() => setPuzzle(FifteenPuzzle.generateRandom(4))}>reset</div> */}
    </FlexCenteringContainer>
    <div className={styles.name}>Made by Yuki Hiragino</div>
  </>;
}
