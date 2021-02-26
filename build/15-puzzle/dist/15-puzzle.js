import { flip, range, chooseRandomIndex, chooseRandom } from './utils';
var floor = Math.floor, abs = Math.abs;
var PointUtil = /** @class */ (function () {
    function PointUtil(columns) {
        this.columns = columns;
    }
    PointUtil.prototype.convertPointToIndex = function (point) { return point[0] + point[1] * this.columns; };
    PointUtil.prototype.convertIndexToPoint = function (index) { return [index % this.columns, floor(index / this.columns)]; };
    return PointUtil;
}());
var FifteenPuzzle = /** @class */ (function () {
    function FifteenPuzzle(n, numbers) {
        if (n === void 0) {
            n = 4;
        }
        if (numbers === void 0) {
            numbers = range(1, Array.isArray(n) ? n[0] * n[1] : Math.pow(n, 2)).concat(0);
        }
        this.numbers = numbers;
        if (Array.isArray(n))
            this.columns = n[0], this.rows = n[1];
        else
            this.columns = this.rows = n;
        this.pointUtil = new PointUtil(this.columns);
        if (!this.isCorrect())
            throw new RangeError("Invalid numbers");
    }
    FifteenPuzzle.generateRandom = function (columns, rows) {
        if (columns === void 0) {
            columns = 4;
        }
        if (rows === void 0) {
            rows = columns;
        }
        var length = rows * columns;
        var numbers = [];
        var unusedNumbers = range(1, length);
        for (var _i = 0, _a = range(length - 3); _i < _a.length; _i++) {
            var _ = _a[_i];
            numbers.push(unusedNumbers.splice(chooseRandomIndex(unusedNumbers), 1)[0]);
        }
        var puzzle = new this([columns, rows], numbers.concat(unusedNumbers, 0));
        if (!puzzle.isSolvable())
            puzzle = new this([columns, rows], numbers.concat(unusedNumbers.map(flip), 0));
        var horizontalFirst = chooseRandom([true, false]);
        puzzle.tap(horizontalFirst ? [chooseRandom(range(columns)), rows - 1] : [columns - 1, chooseRandom(range(rows))]);
        puzzle.tap(horizontalFirst ? [puzzle.getEmptyPoint()[0], chooseRandom(range(rows))] : [chooseRandom(range(columns)), puzzle.getEmptyPoint()[1]]);
        return puzzle;
    };
    Object.defineProperty(FifteenPuzzle.prototype, "length", {
        get: function () { return this.numbers.length; },
        enumerable: false,
        configurable: true
    });
    FifteenPuzzle.prototype.clone = function () { return new this.constructor([this.rows, this.columns], this.numbers.slice()); };
    FifteenPuzzle.prototype.equals = function (point1, point2) { return point1[0] === point2[0] && point1[1] === point2[1]; };
    FifteenPuzzle.prototype.setValueOfPoint = function (point, value) { this.numbers[this.pointUtil.convertPointToIndex(point)] = value; return this; };
    FifteenPuzzle.prototype.getValueFromPoint = function (point) { return this.numbers[this.pointUtil.convertPointToIndex(point)]; };
    FifteenPuzzle.prototype.getPointFromValue = function (value) { return this.pointUtil.convertIndexToPoint(this.numbers.findIndex(function (i) { return i === value; })); };
    FifteenPuzzle.prototype.getEmptyPoint = function () { return this.getPointFromValue(0); };
    FifteenPuzzle.prototype.isCorrect = function () {
        var _this = this;
        return this.numbers.length === this.columns * this.rows && range(this.numbers.length).every(function (i) { return _this.numbers.includes(i); });
    };
    /**
     * A puzzle is said to be solvable only when it can be solved by swapping two of the pieces even times.
     */
    FifteenPuzzle.prototype.isSolvable = function () {
        if (!this.isCorrect())
            return false;
        var cloned = this.clone();
        if (!cloned.equals(cloned.getPointFromValue(0), [cloned.columns, cloned.rows])) {
            cloned.tap([cloned.columns - 1, cloned.getPointFromValue(0)[1]]);
            cloned.tap([cloned.columns - 1, cloned.rows - 1]);
        }
        var swapCount = range(cloned.columns * cloned.rows - 1).reduce(function (acc, i) {
            var j = cloned.getPointFromValue(i + 1);
            if (i !== cloned.pointUtil.convertPointToIndex(j)) {
                cloned.swap(cloned.pointUtil.convertIndexToPoint(i), j);
                return acc + 1;
            }
            else
                return acc;
        });
        return swapCount % 2 === 0;
    };
    FifteenPuzzle.prototype.isSolved = function () {
        var _this = this;
        return this.isCorrect()
            && range(1, this.length).concat(0).every(function (n, i) { return _this.getValueFromPoint(_this.pointUtil.convertIndexToPoint(i)) == n; });
    };
    FifteenPuzzle.prototype.swap = function (point1, point2) {
        var value1 = this.getValueFromPoint(point1);
        var value2 = this.getValueFromPoint(point2);
        this.setValueOfPoint(point1, value2);
        this.setValueOfPoint(point2, value1);
        return true;
    };
    FifteenPuzzle.prototype.tap = function (point) {
        var _this = this;
        var emptyPoint = this.getEmptyPoint();
        if (this.equals(point, emptyPoint))
            return false;
        if (point[0] !== emptyPoint[0] && point[1] !== emptyPoint[1])
            return false;
        var isVertical = point[0] === emptyPoint[0];
        var axis = +isVertical;
        var distance = emptyPoint[axis] - point[axis];
        range(1, abs(distance) + 1)
            .map(function (i) { return distance > 0 ? i : -i; })
            .forEach(function (i) { return _this.swap(_this.getEmptyPoint(), isVertical ? [point[0], emptyPoint[1] - i] : [emptyPoint[0] - i, point[1]]); });
        return true;
    };
    return FifteenPuzzle;
}());
export { FifteenPuzzle };
//# sourceMappingURL=15-puzzle.js.map
//# sourceMappingURL=15-puzzle.js.map