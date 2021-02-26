var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
            return __spreadArrays(Array(Math.ceil((end - start_1) / step_1))).map(function (v, i) { return start_1 + i * step_1; });
    }
}
//# sourceMappingURL=range.js.map