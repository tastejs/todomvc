<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# vinyl-fs

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]

[Vinyl][vinyl] adapter for the file system.

## What is Vinyl?

[Vinyl][vinyl] is a very simple metadata object that describes a file. When you think of a file, two attributes come to mind: `path` and `contents`. These are the main attributes on a [Vinyl][vinyl] object. A file does not necessarily represent something on your computer’s file system. You have files on S3, FTP, Dropbox, Box, CloudThingly.io and other services. [Vinyl][vinyl] can be used to describe files from all of these sources.

## What is a Vinyl Adapter?

While Vinyl provides a clean way to describe a file, we now need a way to access these files. Each file source needs what we call a "Vinyl adapter". A Vinyl adapter simply exposes a `src(globs)` and a `dest(folder)` method. Each return a stream. The `src` stream produces Vinyl objects, and the `dest` stream consumes Vinyl objects. Vinyl adapters can expose extra methods that might be specific to their input/output medium, such as the `symlink` method `vinyl-fs` provides.

## Usage

```javascript
var map = require('map-stream');
var vfs = require('vinyl-fs');

var log = function(file, cb) {
  console.log(file.path);
  cb(null, file);
};

vfs.src(['./js/**/*.js', '!./js/vendor/*.js'])
  .pipe(map(log))
  .pipe(vfs.dest('./output'));
```

## API

### `src(globs[, options])`

Takes a glob string or an array of glob strings as the first argument and an options object as the second.
Returns a stream of [vinyl] `File` objects.

__Note: UTF-8 BOM will be removed from all UTF-8 files read with `.src` unless disabled in the options.__

#### Globs

Globs are executed in order, so negations should follow positive globs.

For example:

```js
fs.src(['!b*', '*'])
```

would not exclude any files, but the following would exclude all files starting with "b":

```js
fs.src(['*', '!b*'])
```

#### Options

- Values passed to the options must be of the expected type, otherwise they will be ignored.
- All options can be passed a function instead of a value. The function will be called with the [vinyl] `File` object as its only argument and must return a value of the expected type for that option.

##### `options.buffer`

Whether or not you want to buffer the file contents into memory. Setting to `false` will make `file.contents` a paused Stream.

Type: `Boolean`

Default: `true`

##### `options.read`

Whether or not you want the file to be read at all. Useful for stuff like removing files. Setting to `false` will make `file.contents = null` and will disable writing the file to disk via `.dest()`.

Type: `Boolean`

Default: `true`

##### `options.since`

Only streams files that have been modified since the time specified.

Type: `Date` or `Number`

Default: `undefined`

##### `options.removeBOM`

Causes the BOM to be removed on UTF-8 encoded files. Set to `false` if you need the BOM for some reason.

Type: `Boolean`

Default: `true`

##### `options.sourcemaps`

Enables sourcemap support on files passed through the stream.  Will load inline sourcemaps and resolve sourcemap links from files.

Type: `Boolean`

Default: `false`

##### `options.resolveSymlinks`

Whether or not to recursively resolve symlinks to their targets. Set to `false` to preserve them as symlinks and make `file.symlink` equal the original symlink's target path.

Type: `Boolean`

Default: `true`

##### `options.dot`

Whether or not you want globs to match on dot files (e.g. `.gitignore`).

__Note: This option is not resolved from a function because it is passed verbatim to node-glob.__

Type: `Boolean`

Default: `false`

##### other

Any glob-related options are documented in [glob-stream] and [node-glob] and are forwarded verbatim.

### `dest(folder[, options])`

Takes a folder path string or a function as the first argument and an options object as the second. If given a function, it will be called with each [vinyl] `File` object and must return a folder path.
Returns a stream that accepts [vinyl] `File` objects, writes them to disk at the folder/cwd specified, and passes them downstream so you can keep piping these around.

Once the file is written to disk, an attempt is made to determine if the `stat.mode`, `stat.mtime` and `stat.atime` of the [vinyl] `File` object differ from the file on the filesystem.
If they differ and the running process owns the file, the corresponding filesystem metadata is updated.
If they don't differ or the process doesn't own the file, the attempt is skipped silently.
__This functionality is disabled on Windows operating systems or any other OS that doesn't support `process.getuid` or `process.geteuid` in node. This is due to Windows having very unexpected results through usage of `fs.fchmod` and `fs.futimes`.__

__Note: The `fs.futimes()` method internally converts `stat.mtime` and `stat.atime` timestamps to seconds; this division by `1000` may cause some loss of precision in 32-bit Node.js.__

If the file has a `symlink` attribute specifying a target path, then a symlink will be created.

__Note: The file will be modified after being written to this stream.__
  - `cwd`, `base`, and `path` will be overwritten to match the folder.
  - `stat` will be updated to match the file on the filesystem.
  - `contents` will have it's position reset to the beginning if it is a stream.

#### Options

- Values passed to the options must be of the expected type, otherwise they will be ignored.
- All options can be passed a function instead of a value. The function will be called with the [vinyl] `File` object as its only argument and must return a value of the expected type for that option.

##### `options.cwd`

The working directory the folder is relative to.

Type: `String`

Default: `process.cwd()`

##### `options.mode`

The mode the files should be created with. This option is only resolved if the [vinyl] `File` is not symbolic.

Type: `Number`

Default: The `mode` of the input file (`file.stat.mode`) if any, or the process mode if the input file has no `mode` property.

##### `options.dirMode`

The mode directories should be created with.

Type: `Number`

Default: The process `mode`.

##### `options.overwrite`

Whether or not existing files with the same path should be overwritten.

Type: `Boolean`

Default: `true` (always overwrite existing files)

##### `options.append`

Whether or not new data should be appended after existing file contents (if any).

Type: `Boolean`

Default: `false` (always replace existing contents, if any)

##### `options.sourcemaps`

Enables sourcemap support on files passed through the stream.  Will write inline soucemaps if specified as `true`.
Specifying a `String` path will write external sourcemaps at the given path.

Examples:

```js
// Write as inline comments
vfs.dest('./', { sourcemaps: true });

// Write as files in the same folder
vfs.dest('./', { sourcemaps: '.' });
```

Type: `Boolean` or `String`

Default: `undefined` (do not write sourcemaps)

##### `options.relativeSymlinks`

When creating a symlink, whether or not the created symlink should be relative. If `false`, the symlink will be absolute.

__Note: This option will be ignored if a `junction` is being created, as they must be absolute.__

Type: `Boolean`

Default: `false`

##### `options.useJunctions`

When creating a symlink, whether or not a directory symlink should be created as a `junction`.
This option is only relevant on Windows and ignored elsewhere. Please refer to the [Symbolic Links on Windows][symbolic-caveats] section below.

Type: `Boolean`

Default: `true`

### `symlink(folder[, options])`

Takes a folder path string or a function as the first argument and an options object as the second. If given a function, it will be called with each [vinyl] `File` object and must return a folder path.
Returns a stream that accepts [vinyl] `File` objects, creates a symbolic link (i.e. symlink) at the folder/cwd specified, and passes them downstream so you can keep piping these around.

__Note: The file will be modified after being written to this stream.__
  - `cwd`, `base`, and `path` will be overwritten to match the folder.
  - `stat` will be updated to match the symlink on the filesystem.
  - `contents` will be set to `null`.
  - `symlink` will be added or replaced to be the original path.

__Note: On Windows, directory links are created using Junctions by default. Use the `useJunctions` option to disable this behavior.__

#### Options

- Values passed to the options must be of the expected type, otherwise they will be ignored.
- All options can be passed a function instead of a value. The function will be called with the [vinyl] `File` object as its only argument and must return a value of the expected type for that option.

##### `options.cwd`

The working directory the folder is relative to.

Type: `String`

Default: `process.cwd()`

##### `options.dirMode`

The mode directories should be created with.

Type: `Number`

Default: The process mode.

##### `options.overwrite`

Whether or not existing files with the same path should be overwritten.

Type: `Boolean`

Default: `true` (always overwrite existing files)

##### `options.relativeSymlinks`

Whether or not the created symlinks should be relative. If `false`, the symlink will be absolute.

__Note: This option will be ignored if a `junction` is being created, as they must be absolute.__

Type: `Boolean`

Default: `false`

##### `options.useJunctions`

When creating a symlink, whether or not a directory symlink should be created as a `junction`.
This option is only relevant on Windows and ignored elsewhere. Please refer to the [Symbolic Links on Windows][symbolic-caveats] section below.

Type: `Boolean`

Default: `true`

#### Symbolic Links on Windows

When creating symbolic links on Windows, we pass a `type` argument to Node's
`fs` module which specifies the kind of target we link to (one of `'file'`,
`'dir'` or `'junction'`). Specifically, this will be `'file'` when the target
is a regular file, `'junction'` if the target is a directory, or `'dir'` if
the target is a directory and the user overrides the `useJunctions` option
default.

However, if the user tries to make a "dangling" link (pointing to a non-existent
target) we won't be able to determine automatically which type we should use.
In these cases, `vinyl-fs` will behave slightly differently depending on
whether the dangling link is being created via `symlink()` or via `dest()`.

For dangling links created via `symlink()`, the incoming vinyl represents the
target and so we will look to its stats to guess the desired type. In
particular, if `isDirectory()` returns false then we'll create a `'file'` type
link, otherwise we will create a `'junction'` or a `'dir'` type link depending
on the value of the `useJunctions` option.

For dangling links created via `dest()`, the incoming vinyl represents the link -
typically read off disk via `src()` with the `resolveSymlinks` option set to
false. In this case, we won't be able to make any reasonable guess as to the
type of link and we default to using `'file'`, which may cause unexpected behavior
if you are creating a "dangling" link to a directory. It is advised to avoid this
scenario.


[symbolic-caveats]: #symbolic-links-on-windows
[glob-stream]: https://github.com/gulpjs/glob-stream
[node-glob]: https://github.com/isaacs/node-glob
[gaze]: https://github.com/shama/gaze
[glob-watcher]: https://github.com/wearefractal/glob-watcher
[vinyl]: https://github.com/wearefractal/vinyl

[downloads-image]: http://img.shields.io/npm/dm/vinyl-fs.svg
[npm-url]: https://www.npmjs.com/package/vinyl-fs
[npm-image]: http://img.shields.io/npm/v/vinyl-fs.svg

[travis-url]: https://travis-ci.org/gulpjs/vinyl-fs
[travis-image]: http://img.shields.io/travis/gulpjs/vinyl-fs.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/gulpjs/vinyl-fs
[appveyor-image]: https://img.shields.io/appveyor/ci/gulpjs/vinyl-fs.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/gulpjs/vinyl-fs
[coveralls-image]: http://img.shields.io/coveralls/gulpjs/vinyl-fs/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.svg
