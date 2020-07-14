# Changelog

# v1.4.0 - 2019-09-01

* Merged https://github.com/FullHuman/purgecss/commit/bc9f3b5b9d670832f0d1cca7bc7facfb253fb60b, ensure classes beginning with numbers are properly purged
* Merged https://github.com/FullHuman/purgecss/pull/214, fix font-face processing
* update dependencies

# v1.3.0 - 2019-04-20

* Merged https://github.com/FullHuman/purgecss/pull/183, adding `defaultExtractor` option
* remove ignore comment once purged, issue https://github.com/FullHuman/purgecss/issues/121

# v1.2.0 - 2019-04-05

* fix issue https://github.com/FullHuman/purgecss/issues/148, so the default extract is used for any file type that is not specified
* Merged https://github.com/FullHuman/purgecss/pull/167, fixing issue #166
* Merged https://github.com/FullHuman/purgecss/pull/176, fixing invalid json output by the CLI
* Update dependencies
* Update dev dependencies, including babel 7

# v1.1.0 - 2018-08-21

* fix issue #92 where value between rounded brackets for nth-child and nth-of-type pseudo-class gets purged if it starts with 'n' or '-n'
* Update dependencies, including PostCSS 7

# v1.0.0 - 2018-05-22

* Merge https://github.com/FullHuman/purgecss/pull/81, fixing https://github.com/FullHuman/purgecss/issues/80
* Change default extractor, does not return error for empty file anymore
* Remove legacy option
* Add rejected option https://github.com/FullHuman/purgecss/issues/55
* Add range ignore comment (`purgecss start ignore` and `purgecss end ignore`) https://github.com/FullHuman/purgecss/issues/66

# v0.20.0 - 2018-01-31

* https://github.com/FullHuman/purgecss/pull/48, fix https://github.com/FullHuman/purgecss/issues/41
* New option `fontFace` to remove unused font-face declaration
* Remove unused vendor-prefixed keyframes rules
* Update dependencies



# v.0.19.0 - 2018-01-14

* https://github.com/FullHuman/purgecss/pull/34, fix https://github.com/FullHuman/purgecss/issues/33
* Update dependencies
* Modify Rollup configuration: remove commonjs plugin and add glob as external dependency

# v0.18.0 - 2018-01-05

* Change default extractor regex, fixing https://github.com/FullHuman/purgecss/issues/37
* Update dependencies
* Use files property in package.json: importing only necessary files.

# v0.16.0 - 2017-12-18

* `keyframes` option set to `false` by default, `keyframes: true` causing issue with bootstrap https://github.com/FullHuman/purgecss/issues/33
* Update dependencies.

# v0.14.0 - 2017-12-07

* Merge PR https://github.com/FullHuman/purgecss/pull/29 by @jsnanigans: add
  `raw` for content option to pass a raw string instead of a filepath.
* Fix incorrect logic that removes attributes selectors.
* Update dependencies.
