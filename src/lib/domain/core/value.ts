export class ValueType<T> {
  constructor(private readonly value: T) {}

  getValue(): T {
    return this.value;
  }

  toString(): string {
    return String(this.value);
  }
}
