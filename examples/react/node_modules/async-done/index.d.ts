/**
 * Notes about these type definitions:
 *
 * - Callbacks returning multiple completion values using multiple arguments are not supported by these types.
 *   Prefer to use Node's style by grouping your values in a single object or array.
 *   Support for this kind of callback is blocked by Microsoft/TypeScript#5453
 *
 * - For ease of use, `asyncDone` lets you pass callback functions with a result type `T` instead of `T | undefined`.
 *   This matches Node's types but can lead to unsound code being typechecked.
 *
 *   The following code typechecks but fails at runtime:
 *   ```typescript
 *   async function getString(): Promise<string> {
 *     return "Hello, World!";
 *   }
 *
 *   async function evilGetString(): Promise<string> {
 *     throw new Error("Hello, World!");
 *   }
 *
 *   function cb(err: Error | null, result: string): void {
 *     // This is unsound because `result` is `undefined` when `err` is not `null`.
 *     console.log(result.toLowerCase());
 *   }
 *
 *   asyncDone(getString, cb); // Prints `hello, world!`
 *   asyncDone(evilGetString, cb); // Runtime error: `TypeError: Cannot read property 'toLowerCase' of undefined`
 *   ```
 *
 *   Enforcing stricter callbacks would require developers to use `result?: string` and assert the existence
 *   of the result either by checking it directly or using the `!` assertion operator after testing for errors.
 *   ```typescript
 *   function stricterCb1(err: Error | null, result?: string): void {
 *     if (err !== null) {
 *       console.error(err);
 *       return;
 *     }
 *     console.log(result!.toLowerCase());
 *   }
 *
 *   function stricterCb2(err: Error | null, result?: string): void {
 *     if (result === undefined) {
 *       console.error("Undefined result. Error:);
 *       console.error(err);
 *       return;
 *     }
 *     console.log(result.toLowerCase());
 *   }
 *   ```
 */
import { ChildProcess } from "child_process";
import { EventEmitter } from "events";
import { Stream } from "stream";

declare namespace asyncDone {

  /**
   * Represents a callback function used to signal the completion of a
   * task without any result value.
   */
  type VoidCallback = (err: Error | null) => void;

  /**
   * Represents a callback function used to signal the completion of a
   * task with a single result value.
   */
  interface Callback<T> {
    (err: null, result: T): void;

    // Use `result?: T` or `result: undefined` to require the consumer to assert the existence of the result
    // (even in case of success). See comment at the top of the file.
    (err: Error, result?: any): void;
  }

  /**
   * Minimal `Observable` interface compatible with `async-done`.
   *
   * @see https://github.com/ReactiveX/rxjs/blob/c3c56867eaf93f302ac7cd588034c7d8712f2834/src/internal/Observable.ts#L77
   */
  interface Observable<T = any> {
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): any;
  }

  /**
   * Represents an async operation.
   */
  export type AsyncTask<R = any> =
    ((done: VoidCallback) => void)
    | ((done: Callback<R>) => void)
    | (() => ChildProcess | EventEmitter | Observable<R> | PromiseLike<R> | Stream);
}

/**
 * Takes a function to execute (`fn`) and a function to call on completion (`callback`).
 *
 * @param fn Function to execute.
 * @param callback Function to call on completion.
 */
declare function asyncDone<R = any>(fn: asyncDone.AsyncTask<R>, callback: asyncDone.Callback<R>): void;

export = asyncDone;
