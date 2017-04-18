# Console

##### Drop-in replacement for `console` - a cross-environment fix for missing methods.

## Installation

Just include the script. The host `console` object is automagically updated in your environment. No need for `new` or any other sort of initialization. 

### Browser

``` html
<script src="console.js"></script>
```

### Node.js

Or, if you're using console with Node.js

``` sh
$ npm [-g] install console
```

Then require the "console" module:

``` javascript
var console = require("console");
```