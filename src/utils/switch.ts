export function _switch<T>(value: T) {
  return new Switch(value);
}
_switch.name = "switch";

class Switch<T> {
  private cases: {
    value: T;
    fn: (value: T) => any;
  }[] = [];
  constructor(
    public value: T
  ) {}

  public case(value: T, returnValue: any): this;
  public case(value: T, fn: (value: T) => any): this;
  public case(value: T, arg2: any): this {
    this.cases.push({ value, fn: typeof arg2 === "function" ? arg2 : () => arg2 });
    return this;
  }

  public run() {
    return this.cases.find(theCase => theCase.value === this.value)?.fn(this.value);
  }
}
