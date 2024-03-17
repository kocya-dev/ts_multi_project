import { beforeAll, afterAll, beforeEach, afterEach, expect } from "vitest";
import { TestError } from "./test/testError";

beforeAll(() => {});
afterAll(() => {});
beforeEach(() => {});
afterEach(() => {});
/*
The return value of a matcher should be compatible with the following interface:

ts
interface MatcherResult {
  pass: boolean
  message: () => string
  // If you pass these, they will automatically appear inside a diff when
  // the matcher does not pass, so you don't need to print the diff yourself
  actual?: unknown
  expected?: unknown
}
*/

export const toThrowTestError = (receivedFunc: any, expectError: TestError) => {
  try {
    receivedFunc();
    return {
      message: () => `not thrown`,
      pass: false,
    };
  } catch (e: any) {
    const isEqualTestError = (e: any, expectError: TestError): boolean => {
      if (!(e instanceof TestError)) return false;
      const occured: TestError = e as TestError;
      if (occured.message != expectError.message) return false;
      if (occured.value != expectError.value) return false;
      return true;
    };
    const pass = isEqualTestError(e, expectError);
    if (pass) {
      return {
        message: () => `expected ${e} equal ${expectError}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${e} not equal ${expectError}`,
        pass: false,
      };
    }
  }
};
expect.extend({ toThrowTestError });
