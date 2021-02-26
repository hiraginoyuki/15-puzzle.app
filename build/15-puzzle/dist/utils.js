var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
export var chooseRandomIndex = function (array) { return Math.floor(Math.random() * array.length); };
export var chooseRandom = function (array) { return array[chooseRandomIndex(array)]; };
export var flip = function (e, i, a) { return a[a.length - 1 - i]; };
export function range() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    switch (args.length) {
        case 1:
            return range(0, args[0], 1);
        case 2:
            return range(args[0], args[1], 1);
        default:
            var start_1 = args[0], end = args[1], step_1 = args[2];
            return __spreadArray([], Array(Math.ceil((end - start_1) / step_1))).map(function (v, i) { return start_1 + i * step_1; });
    }
}
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map