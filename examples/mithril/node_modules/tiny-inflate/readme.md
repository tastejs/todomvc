# tiny-inflate

This is a port of Joergen Ibsen's [tiny inflate](https://bitbucket.org/jibsen/tinf) to JavaScript.
Minified it is about 3KB, or 1.3KB gzipped. While being very small, it is also reasonably fast
(about 30% - 50% slower than [pako](https://github.com/nodeca/pako) on average), and should be 
good enough for many applications. If you need the absolute best performance, however, you'll
need to use a larger library such as pako that contains additional optimizations.

## Installation

    npm install tiny-inflate

## Example

To use tiny-inflate, you need two things: a buffer of data compressed with deflate,
and the decompressed size (often stored in a file header) to allocate your output buffer.
Input and output buffers can be either node `Buffer`s, or `Uint8Array`s.

```javascript
var inflate = require('tiny-inflate');

var compressedBuffer = new Bufer([ ... ]);
var decompressedSize = ...;
var outputBuffer = new Buffer(decompressedSize);

inflate(compressedBuffer, outputBuffer);
```

## License

MIT
