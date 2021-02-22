class ComputedState<T> {
  public constructor(
    private compute: () => T
  ) {}

  private isCached: boolean;
  private cachedValue: T;

  public get value() {
    if (this.isCached) return this.cachedValue;
    this.cachedValue = this.compute();
    this.isCached = true;
    return this.cachedValue;
  }
}

export function useComputedState<T>(compute: () => T) {
  return new ComputedState(compute);
}
