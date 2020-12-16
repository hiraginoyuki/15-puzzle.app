import React from "react";
import { FifteenPuzzle } from "./fifteen-puzzle";
import { FlexCenteringContainer } from "./utils";

const puzzle = FifteenPuzzle.generateRandom(4);
Object.defineProperties(window, {
  FifteenPuzzle: { value: FifteenPuzzle },
  puzzle: { value: puzzle }
});

export function App() {
  return <>
    <FlexCenteringContainer>
      <FifteenPuzzle.Renderer puzzle={puzzle} />
    </FlexCenteringContainer>
  </>;
}
