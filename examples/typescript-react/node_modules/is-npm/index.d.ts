/**
Check if your code is running as an [npm](https://docs.npmjs.com/misc/scripts) or [yarn](https://yarnpkg.com/lang/en/docs/cli/run/) script.

@example
```
import {isNpmOrYarn} from 'is-npm';

if (isNpmOrYarn) {
	console.log('Running as an npm or yarn script!');
}
```
*/
export const isNpmOrYarn: boolean;

/**
Check if your code is running as an [npm](https://docs.npmjs.com/misc/scripts) script.

@example
```
import {isNpm} from 'is-npm';

if (isNpm) {
	console.log('Running as an npm script!');
}
```
*/
export const isNpm: boolean;

/**
Check if your code is running as a [yarn](https://yarnpkg.com/lang/en/docs/cli/run/) script.

@example
```
import {isYarn} from 'is-npm';

if (isYarn) {
	console.log('Running as a yarn script!');
}
```
*/
export const isYarn: boolean;
