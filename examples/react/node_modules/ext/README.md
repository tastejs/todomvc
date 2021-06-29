# ext

_(Previously known as `es5-ext`)_

## JavaScript language extensions (with respect to evolving standard)

Non-standard or soon to be standard language utilities in a future proof, non-invasive form.

Doesn't enforce transpilation step. Where it's applicable utilities/extensions are safe to use in all ES3+ implementations.

### Installation

```bash
npm install ext
```

### Utilities

- [`globalThis`](docs/global-this.md)
- `Function`
  - [`identity`](docs/function/identity.md)
- `Math`
  - [`ceil10`](docs/math/ceil-10.md)
  - [`floor10`](docs/math/floor-10.md)
  - [`round10`](docs/math/round-10.md)
- `Object`
  - [`entries`](docs/object/entries.md)
- `String`
  - [`random`](docs/string/random.md)
- `String.prototype`
  - [`includes`](docs/string_/includes.md)
- `Thenable.prototype`
  - [`finally`](docs/thenable_/finally.md)
