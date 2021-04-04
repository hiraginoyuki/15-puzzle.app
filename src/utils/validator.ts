export class Validator {
  public validator: this = this;
  public result = true;
  public expect = <T>(value: T) => new Expect<T>(this, value);
}

class Expect<T> {
  public constructor(
    public readonly validator: Validator,
    public readonly value: any
  ) {}

  public toSatisfy(validate: (value: T) => boolean) {
    if (this.validator.result) {
      this.validator.result = validate(this.value);
    }
    return {
      and: this,
      then: Object.assign(
        (callback: () => any) => void (this.validator.result && callback()),
        { expect: this.validator.expect }
      )
    };
  }

  public toBe           (value: T     ) { return this.toSatisfy(() => this.value === value); }
  public toBeGreaterThan(value: number) { return this.toSatisfy(() => this.value >   value); }
  public toBeSmallerThan(value: number) { return this.toSatisfy(() => this.value <   value); }
  public toBeTrue                    () { return this.toSatisfy(() => this.value === true ); }
  public toBeFalse                   () { return this.toSatisfy(() => this.value === false); }
  public toBeAnArray                 () { return this.toSatisfy(Array.isArray); }
  public toBeAnInteger               () { return this.toSatisfy(Number.isInteger); }
  public toBeANumber                 () { return this.toSatisfy(() => typeof this.value === "number"); }
  public toBeAString                 () { return this.toSatisfy(() => typeof this.value === "string"); }
  public toBeNullOrUndefined         () { return this.toSatisfy(() => this.value === null || this.value === undefined); }
}
