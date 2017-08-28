# [Base62.js](http://libraries.io/npm/base62)
[![build status](https://secure.travis-ci.org/andrew/base62.js.svg)](http://travis-ci.org/andrew/base62.js)
[![npm version](https://badge.fury.io/js/base62.svg)](http://badge.fury.io/js/base62)
[![Dependency Status](https://david-dm.org/andrew/base62.js.svg?theme=shields.io)](https://david-dm.org/andrew/base62.js)
[![devDependency Status](https://david-dm.org/andrew/base62.js/dev-status.svg?theme=shields.io)](https://david-dm.org/andrew/base62.js#info=devDependencies)
[![Gitter chat](http://img.shields.io/badge/gitter-andrew/base62.js-brightgreen.svg)](https://gitter.im/andrew/base62.js)

A javascript Base62 encode/decoder for node.js

## Install

```bash
npm install base62
```

## Usage

### Default Character Set Example

```javascript
Base62 = require('base62')
Base62.encode(999)  // 'g7'
Base62.decode('g7') // 999
```

### Custom Character Set Example

The default character set is `0-9a-zA-Z`. This can be updated to a custom character set. Naturally, it must be 62 characters long.

Instead of the character set `0-9a-zA-Z` you want to use `0-9A-Za-z`, call the `setCharacterSet()` method on the Base62 object passing in the string `"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"`. Note that all characters must be unique.

```javascript
Base62 = require('base62')
Base62.setCharacterSet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
Base62.encode(999)  // 'G7'
Base62.decode('G7') // 999
```

## Development

Source hosted at [GitHub](http://github.com/andrew/base62.js).
Report Issues/Feature requests on [GitHub Issues](http://github.com/andrew/base62.js).

### Note on Patches/Pull Requests

 * Fork the project.
 * Make your feature addition or bug fix.
 * Add tests for it. This is important so I don't break it in a future version unintentionally.
 * Send me a pull request. Bonus points for topic branches.

## Copyright

Copyright (c) 2016 Andrew Nesbitt. See [LICENSE](https://github.com/andrew/base62.js/blob/master/LICENSE) for details.
