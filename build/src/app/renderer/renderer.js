var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import React, { useEffect, useRef, useState } from 'react';
import { FifteenPuzzle } from '../../fifteen-puzzle';
import { useForceUpdate, joinClassNames as join, range, isMobile, style, useComputedState, defineOnGlobal } from '../../utils';
import styles from './renderer.scss';
var keyMap = {
    4: [0, 0], 5: [1, 0], 6: [2, 0], 7: [3, 0],
    r: [0, 1], t: [1, 1], y: [2, 1], u: [3, 1],
    f: [0, 2], g: [1, 2], h: [2, 2], j: [3, 2],
    v: [0, 3], b: [1, 3], n: [2, 3], m: [3, 3],
};
function forceSolve(puzzle) {
    puzzle.numbers = __spreadArrays(Array(puzzle.columns * puzzle.rows - 1)).map(function (_, i) { return i + 1; }).concat(0);
    return puzzle;
}
defineOnGlobal({ forceSolve: forceSolve });
export function FifteenPuzzleRenderer() {
    var _a = useState(FifteenPuzzle.generateRandom(4)), puzzle = _a[0], setPuzzle = _a[1];
    var TAP_EVENT = isMobile ? "onTouchStart" : "onMouseDown";
    var forceUpdate = useForceUpdate();
    var listener = useRef();
    function reset() {
        setPuzzle(FifteenPuzzle.generateRandom());
    }
    function onTap(point) {
        puzzle.tap(point);
        console.log("tapped", point);
        forceUpdate();
    }
    ;
    function onKeyDown(key) {
        if (key == " ")
            reset();
        var point = keyMap[key];
        console.log(key, point);
        if (Array.isArray(point))
            onTap(point);
    }
    useEffect(function () {
        document.removeEventListener("keydown", listener.current);
        document.addEventListener("keydown", listener.current = function (_a) {
            var key = _a.key;
            return onKeyDown(key);
        });
    }, [puzzle]);
    defineOnGlobal({ puzzle: puzzle, setPuzzle: setPuzzle, forceUpdate: forceUpdate });
    return (React.createElement("div", { className: styles.fifteenPuzzleRenderer, style: style.var({ columns: puzzle.columns, rows: puzzle.rows }) }, range(puzzle.numbers.length).map(function (number) {
        var coord = puzzle.getPointFromValue(number);
        var index = puzzle.pointUtil.convertPointToIndex(coord);
        var isZero = number == 0;
        var isSolved = useComputedState(function () { return puzzle.isSolved(); });
        var content = isZero
            ? React.createElement("div", { className: styles.number }, " R ")
            : React.createElement("div", { className: styles.number },
                " ",
                number,
                " ");
        return (React.createElement(Piece, { hidden: isZero && !isSolved.value, correct: number == index + 1, tapEvent: TAP_EVENT, onTap: isZero && isSolved.value ? reset : onTap, coord: coord, key: number }, content));
    })));
}
function Piece(props) {
    var _a;
    var _b = props.coord, x = _b[0], y = _b[1];
    return (React.createElement("div", __assign({ className: join(styles.piece, props.correct && styles.correct, props.hidden && styles.hidden), style: style.var({ x: x, y: y }) }, (_a = {}, _a[props.tapEvent] = function () { return props.onTap(props.coord); }, _a)), props.children));
}
//# sourceMappingURL=renderer.js.map