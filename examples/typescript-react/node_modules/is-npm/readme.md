# is-npm [![Build Status](https://travis-ci.com/sindresorhus/is-npm.svg?branch=master)](https://travis-ci.com/sindresorhus/is-npm)

> Check if your code is running as an [npm](https://docs.npmjs.com/misc/scripts) or [yarn](https://yarnpkg.com/lang/en/docs/cli/run/) script

## Install

```
$ npm install is-npm
```

## Usage

```js
const {isNpmOrYarn, isNpm, isYarn} = require('is-npm');

console.table({isNpmOrYarn, isNpm, isYarn});
```

```sh
$ node foo.js
# ┌─────────────┬────────┐
# │   (index)   │ Values │
# ├─────────────┼────────┤
# │ isNpmOrYarn │ false  │
# │    isNpm    │ false  │
# │   isYarn    │ false  │
# └─────────────┴────────┘
$ npm run foo
# ┌─────────────┬────────┐
# │   (index)   │ Values │
# ├─────────────┼────────┤
# │ isNpmOrYarn │  true  │
# │    isNpm    │  true  │
# │   isYarn    │ false  │
# └─────────────┴────────┘
$ yarn run foo
# ┌─────────────┬────────┐
# │   (index)   │ Values │
# ├─────────────┼────────┤
# │ isNpmOrYarn │  true  │
# │    isNpm    │ false  │
# │   isYarn    │  true  │
# └─────────────┴────────┘
```

## Related

- [is-npm-cli](https://github.com/sindresorhus/is-npm-cli) - CLI for this module

---

<div align="center">
	<b>
		<a href="https://tidelift.com/subscription/pkg/npm-is-npm?utm_source=npm-is-npm&utm_medium=referral&utm_campaign=readme">Get professional support for this package with a Tidelift subscription</a>
	</b>
	<br>
	<sub>
		Tidelift helps make open source sustainable for maintainers while giving companies<br>assurances about security, maintenance, and licensing for their dependencies.
	</sub>
</div>
