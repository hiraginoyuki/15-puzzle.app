import React from "react";
import { FifteenPuzzle } from "../fifteen-puzzle";
import { FifteenPuzzleRenderer } from "./renderer";
import { FlexCenteringContainer, defineOnGlobal } from "../utils";
import styles from './app.scss';
defineOnGlobal({ FifteenPuzzle: FifteenPuzzle });
export function App() {
    return React.createElement(React.Fragment, null,
        React.createElement(FlexCenteringContainer, null,
            React.createElement(FifteenPuzzleRenderer, null)),
        React.createElement("div", { className: styles.name }, "Made by Yuki Hiragino"));
}
//# sourceMappingURL=app.js.map