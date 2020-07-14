# Change log for stream

- [Upcoming](#upcoming)
- [v2.0.0](#v200)
- [v1.1.0](#v110)

### Upcoming...

### 2.0.0
- when a stream conditionally returns HALT, dependant stream will also end ([#2200](https://github.com/MithrilJS/mithril.js/pull/2200), [#2369](https://github.com/MithrilJS/mithril.js/pull/2369))
- Add `stream.lift` as a user-friendly alternative to `merge -> map` or `combine` ([#1944](https://github.com/MithrilJS/mithril.js/issues/1944))
- renamed HALT to SKIP ([#2207](https://github.com/MithrilJS/mithril.js/pull/2207))
- rewrote implementation ([#2207](https://github.com/MithrilJS/mithril.js/pull/2207))
- Removed `valueOf` & `toString` methods ([#2150](https://github.com/MithrilJS/mithril.js/pull/2150))
- fixed `stream.end` propagation ([#2369](https://github.com/MithrilJS/mithril.js/pull/2369))

### 1.1.0
- Move the "use strict" directive inside the IIFE [#1831](https://github.com/MithrilJS/mithril.js/issues/1831) ([#1893](https://github.com/MithrilJS/mithril.js/pull/1893))
