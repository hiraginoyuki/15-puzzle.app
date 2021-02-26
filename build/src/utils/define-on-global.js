export function defineOnGlobal(o) {
    Object.entries(o).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (window.hasOwnProperty(key))
            delete window[key];
        Object.defineProperty(window, key, { value: value, configurable: true });
    });
}
//# sourceMappingURL=define-on-global.js.map