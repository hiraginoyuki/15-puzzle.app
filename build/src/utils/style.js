import { kebab } from 'case';
function convertKeyCase(variables, converter) {
    return Object.fromEntries(Object.entries(variables).map(function (_a) {
        var key = _a[0], value = _a[1];
        return [converter(key), value];
    }));
}
var converter = function (s) { return "--" + kebab(s); };
var styleObjProto = {
    var: function (variables) {
        return Object.assign(style, variable(variables));
    }
};
export var variable = function (variables) { return convertKeyCase(variables, converter); };
export function style(style) {
    return Object.assign(Object.create(styleObjProto), style);
}
style.var = variable;
//# sourceMappingURL=style.js.map