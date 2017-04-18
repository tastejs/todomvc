
# browser-split

Cross browser String#split implementation.

[![browser support](https://ci.testling.com/juliangruber/browser-split.png)](https://ci.testling.com/juliangruber/browser-split)

## Usage

```js
var split = require('browser-split');

// Basic use
split('a b c d', ' ');
// => ['a', 'b', 'c', 'd']

// With limit
split('a b c d', ' ', 2);
// => ['a', 'b']

// Backreferences in result array
split('..word1 word2..', /([a-z]+)(\d+)/i);
// => ['..', 'word', '1', ' ', 'word', '2', '..']
```

## API

### split(string, seperator[, limit])

Splits a string into an array of strings using a regex or string separator. Matches of the
separator are not included in the result array. However, if `separator` is a regex that contains
capturing groups, backreferences are spliced into the result each time `separator` is matched.
Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
cross-browser.

* `string` is the String to split.
* `seperator` is a RegExp or String to split by.
* `limit` is the optional maximum number of items included in the result Array.

## Installation

With [npm](http://npmjs.org) do

```bash
$ npm install browser-split
```

With [component](https://github.com/component/component) do

```bash
$ component install juliangruber/browser-split
```

## License

(MIT)

Copyright (c) 2013 Julian Gruber &lt;julian@juliangruber.com&gt; 

Copyright 2007-2012 Steven Levithan &lt;stevenlevithan.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
