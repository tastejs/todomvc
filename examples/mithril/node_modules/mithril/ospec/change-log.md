# Change log for ospec

- [Upcoming](#upcoming)
- [4.0.0](#400)
- [3.1.0](#310)
- [3.0.1](#301)
- [3.0.0](#300)
- [2.1.0](#210)
- [2.0.0](#200)
- [1.4.1](#141)
- [1.4.0](#140)
- [1.3 and earlier](#13-and-earlier)

### Upcoming...
- Fix `require` with relative paths

### 4.0.0
- Pull ESM support out

### 3.1.0
- ospec: Test results now include `.message` and `.context` regardless of whether the test passed or failed. (#2227 @robertakarobin)
<!-- Add new lines here. Version number will be decided later -->
- Add `spy.calls` array property to get the `this` and `arguments` values for any arbitrary call. (#2221 @isiahmeadows)
- Added `.throws` and `.notThrows` assertions to ospec. (#2255 @robertakarobin)
- Update `glob` dependency.

### 3.0.1

#### Bug fix
- Move `glob` from `devDependencies` to `dependencies`, fix the test runner ([#2186](https://github.com/MithrilJS/mithril.js/pull/2186) [@porsager](https://github.com/porsager)

### 3.0.0

#### Breaking
- Better input checking to prevent misuses of the library. Misues of the library will now throw errors, rather than report failures. This may uncover bugs in your test suites. Since it is potentially a disruptive update this change triggers a semver major bump. ([#2167](https://github.com/MithrilJS/mithril.js/pull/2167))
- Change the reserved character for hooks and test suite meta-information from `"__"` to `"\x01"`. Tests whose name start with `"\0x01"` will be rejected ([#2167](https://github.com/MithrilJS/mithril.js/pull/2167))

#### Features
- Give async timeout a stack trace that points to the problematic test ([#2154](https://github.com/MithrilJS/mithril.js/pull/2154) [@gilbert](github.com/gilbert), [#2167](https://github.com/MithrilJS/mithril.js/pull/2167))
- deprecate the `timeout` parameter in async tests in favour of `o.timeout()` for setting the timeout delay. The `timeout` parameter still works for v3, and will be removed in v4 ([#2167](https://github.com/MithrilJS/mithril.js/pull/2167))
- add `o.defaultTimeout()` for setting the the timeout delay for the current spec and its children ([#2167](https://github.com/MithrilJS/mithril.js/pull/2167))
- adds the possibility to select more than one test with o.only ([#2171](https://github.com/MithrilJS/mithril.js/pull/2171))

#### Bug fixes
- Detect duplicate calls to `done()` properly [#2162](https://github.com/MithrilJS/mithril.js/issues/2162) ([#2167](https://github.com/MithrilJS/mithril.js/pull/2167))
- Don't try to report internal errors as assertion failures, throw them instead ([#2167](https://github.com/MithrilJS/mithril.js/pull/2167))
- Don't ignore, silently, tests whose name start with the test suite meta-information sequence (was `"__"` up to this version) ([#2167](https://github.com/MithrilJS/mithril.js/pull/2167))
- Fix the `done()` call detection logic [#2158](https://github.com/MithrilJS/mithril.js/issues/2158) and assorted fixes (accept non-English names, tolerate comments) ([#2167](https://github.com/MithrilJS/mithril.js/pull/2167))
- Catch exceptions thrown in synchronous tests and report them as assertion failures ([#2171](https://github.com/MithrilJS/mithril.js/pull/2171))
- Fix a stack overflow when using `o.only()` with a large test suite ([#2171](https://github.com/MithrilJS/mithril.js/pull/2171))

### 2.1.0

#### Features
- Pinpoint the `o.only()` call site ([#2157](https://github.com/MithrilJS/mithril.js/pull/2157))
- Improved wording, spacing and color-coding of report messages and errors ([#2147](https://github.com/MithrilJS/mithril.js/pull/2147), [@maranomynet](https://github.com/maranomynet))

#### Bug fixes
- Convert the exectuable back to plain ES5 [#2160](https://github.com/MithrilJS/mithril.js/issues/2160) ([#2161](https://github.com/MithrilJS/mithril.js/pull/2161))


### 2.0.0

- Added `--require` feature to the ospec executable ([#2144](https://github.com/MithrilJS/mithril.js/pull/2144), [@gilbert](https://github.com/gilbert))
- In Node.js, ospec only uses colors when the output is sent to a terminal ([#2143](https://github.com/MithrilJS/mithril.js/pull/2143))
- the CLI runner now accepts globs as arguments ([#2141](https://github.com/MithrilJS/mithril.js/pull/2141), [@maranomynet](https://github.com/maranomynet))
- Added support for custom reporters ([#2020](https://github.com/MithrilJS/mithril.js/pull/2020), [@zyrolasting](https://github.com/zyrolasting))
- Make ospec more [Flems](https://flems.io)-friendly ([#2034](https://github.com/MithrilJS/mithril.js/pull/2034))
    - Works either as a global or in CommonJS environments
    - the o.run() report is always printed asynchronously (it could be synchronous before if none of the tests were async).
    - Properly point to the assertion location of async errors [#2036](https://github.com/MithrilJS/mithril.js/issues/2036)
    - expose the default reporter as `o.report(results)`
    - Don't try to access the stack traces in IE9



### 1.4.1

- Identical to v1.4.0, but with UNIX-style line endings so that BASH is happy.



### 1.4.0

- Added support for async functions and promises in tests ([#1928](https://github.com/MithrilJS/mithril.js/pull/1928), [@StephanHoyer](https://github.com/StephanHoyer))
- Error handling for async tests with `done` callbacks supports error as first argument ([#1928](https://github.com/MithrilJS/mithril.js/pull/1928))
- Error messages which include newline characters do not swallow the stack trace [#1495](https://github.com/MithrilJS/mithril.js/issues/1495) ([#1984](https://github.com/MithrilJS/mithril.js/pull/1984), [@RodericDay](https://github.com/RodericDay))



### 1.3 and earlier

- Log using util.inspect to show object content instead of "[object Object]" ([#1661](https://github.com/MithrilJS/mithril.js/issues/1661), [@porsager](https://github.com/porsager))
- Shell command: Ignore hidden directories and files ([#1855](https://github.com/MithrilJS/mithril.js/pull/1855) [@pdfernhout)](https://github.com/pdfernhout))
- Library: Add the possibility to name new test suites ([#1529](https://github.com/MithrilJS/mithril.js/pull/1529))
