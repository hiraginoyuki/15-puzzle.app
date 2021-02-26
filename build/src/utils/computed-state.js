var ComputedState = /** @class */ (function () {
    function ComputedState(compute) {
        this.compute = compute;
    }
    Object.defineProperty(ComputedState.prototype, "value", {
        get: function () {
            if (this.isCached)
                return this.cachedValue;
            this.cachedValue = this.compute();
            this.isCached = true;
            return this.cachedValue;
        },
        enumerable: false,
        configurable: true
    });
    return ComputedState;
}());
export function useComputedState(compute) {
    return new ComputedState(compute);
}
//# sourceMappingURL=computed-state.js.map