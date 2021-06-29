# bin-up

> Finds an installed tool in node_modules/.bin folders from current up to the git root

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]
[![renovate-app badge][renovate-badge]][renovate-app]

## Problem

In you have a monorepo with multiple packages and want to share a tool, like
`eslint`, you need to encode relative paths because NPM does not search bin
aliases. Thus every nested `package.json` ends up with

```json
{
  "scripts": {
    "test": "../../../node_modules/.bin/eslint *.js"
  }
}
```

Nasty!

## Solution

Just like `$(npm bin)/<name>` returns the relative path to the bin alias
*in the current folder*, this tool `bin-up` looks in the
current folder and up the folder chain until it reaches repo root folder
or file system root. `bin-up` checks each `node_modules/.bin` on the way
to see if has the tool alias `<name>`. If it finds one, it returns it and
it can be executed. So any inner package can just install `npm i -D bin-up`
and use it to find tools from parent folders by name

```json
{
  "scripts": {
    "test": "$(bin-up eslint) *.js"
  }
}
```

See [bahmutov/bin-up-demo](https://github.com/bahmutov/bin-up-demo) for
a demo project.

## Run found tool without arguments

You can run the found tool without arguments

```sh
bin-up --run <tool name>
```

## Run found tool with arguments

If you provide arguments to the tool itself, you can omit `--run`

```sh
bin-up <tool name> --verbose --another-arg
```

## Install

Requires [Node](https://nodejs.org/en/) version 6 or above.

```sh
npm install --save-dev bin-up
```

## Windows

If you shell does not support nested calls like `$(bin-up eslint) src/*.js` you can
pass the arguments to the tool directly. `bin-up` will execute the found tool with them.
So you can lint on Windows like this `bin-up eslint src/*.js`

## Debugging

Run this tool with `VERBOSE=1` environment variable

```text
$ $(./bin/bin-up standard) --version
10.0.2

$ VERBOSE=1 npm t
Found /Users/gleb/git/bin-up/node_modules/.bin/standard
10.0.2
```

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2017

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/bin-up/issues) on Github

## MIT License

Copyright (c) 2017 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/bin-up.svg?downloads=true
[npm-url]: https://npmjs.org/package/bin-up
[ci-image]: https://travis-ci.org/bahmutov/bin-up.svg?branch=master
[ci-url]: https://travis-ci.org/bahmutov/bin-up
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
