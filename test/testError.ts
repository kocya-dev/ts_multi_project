export class TestError extends Error {
  constructor(message: string, public value: number) {
    super(message);
  }
  override toString = (): string => `{ message: ${this.message}, value: ${this.value}}`;
}
