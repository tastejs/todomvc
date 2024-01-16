# Dynamic import support in acorn

This is plugin for [Acorn](http://marijnhaverbeke.nl/acorn/) - a tiny, fast JavaScript parser, written completely in JavaScript.

For more information, check out the [proposal repo](https://github.com/tc39/proposal-dynamic-import).

## Usage

Importing this module gives you a plugin that can be used to extend an Acorn parser:

```js
import Parser from 'acorn';
import dynamicImport from 'acorn-dynamic-import';

Parser.extend(dynamicImport).parse('import("something");');
```

To extend the AST walker for dynamic imports, you can injecting the new node type into [`acorn-walk`](https://www.npmjs.com/package/acorn-walk) like this:

```js
import inject from 'acorn-dynamic-import/lib/walk';
import * as acornWalk from 'acorn-walk';

const walk = inject(acornWalk);
```

## License

This plugin is issued under the [MIT license](./LICENSE).
