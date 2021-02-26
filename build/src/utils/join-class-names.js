export function joinClassNames() {
    var classNames = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classNames[_i] = arguments[_i];
    }
    return classNames
        .filter(function (str) { return typeof str === "string"; })
        .map(function (str) { return str.trim(); })
        .filter(function (str) { return str.length; })
        .join(" ");
}
//# sourceMappingURL=join-class-names.js.map