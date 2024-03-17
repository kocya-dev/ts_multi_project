import type { Assertion, AsymmetricMatchersContaining } from "vitest";

export interface CustomMatchers<R = unknown> {
  toThrowTestError(a: any): R;
}

declare module "vitest" {
  /*
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
    */
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
//export interface CustomMatchers<R = unknown> {
//  toThrowTestError(a: any): R;
//}
//
//declare global {
//  namespace jest {
//    interface Expect extends CustomMatchers {}
//    interface Matchers<R> extends CustomMatchers<R> {}
//    interface InverseAsymmetricMatchers extends CustomMatchers {}
//  }
//}
//
