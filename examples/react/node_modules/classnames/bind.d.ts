export * from './index';
import { Argument } from './index';

export type Binding = { [key: string]: string };
export default function classNames(this: Binding | void, ...args: Argument[]): string;
