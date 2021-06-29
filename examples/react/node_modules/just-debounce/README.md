# just-debounce

just a basic debounce function

# changes

- `1.1.0`: added typescript definitions

# Why?

I searched npm and the first 3 pages of results for "debounce" did not have a small correctly
implemented version of debounce

# Usage

### arguments

- `fn`: the function to debounce
- `delay`: debounce delay in ms
- `atStart:` if true, the function will be called at the beginning of the delay rather than the end
- `guarantee`: additional calls to debounced function will not reset they `delay`. This guarantees
  that if the function is called frequently, it will fire once every `delay` rather than waiting for
  a break in calls.

```javascript
var db = require('just-debounce');

var debounced = db(function (v) {
  console.log(v);
}, 100);

debounced('hi');
debounced('hi');
// logs 'hi' once after 100ms
```

```javascript
var db = require('just-debounce');

var debounced = db(
  function (v) {
    console.log(v);
  },
  100,
  true
);

debounced('hi');
debounced('hi');
// logs 'hi' once right away, but not a second time. calling after 100ms will log again
```

```javascript
var db = require('just-debounce');

var debounced = db(
  function (v) {
    console.log(v);
  },
  100,
  false,
  true
);

debounced('hi');
setTimeout(function () {
  debounced('hi2');
}, 80);

// logs 'hi2' once 100ms after the first call to debounced
```

# license

MIT
