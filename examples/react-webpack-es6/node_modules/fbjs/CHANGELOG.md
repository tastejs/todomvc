## [Unreleased]

## [0.6.1] - 2016-01-06

### Changed
- `getActiveElement`: no longer throws in non-browser environment (again)

## [0.6.0] - 2015-12-29

### Changed
- Flow: Original source files in `fbjs/flow/include` have been removed in favor of placing original files alongside compiled files in lib with a `.flow` suffix. This requires Flow version 0.19 or greater and a change to `.flowconfig` files to remove the include path.

## [0.5.1] - 2015-12-13

### Added
- `base62` module

## [0.5.0] - 2015-12-04

### Changed

- `getActiveElement`: No longer handles a non-existent `document`

## [0.4.0] - 2015-10-16

### Changed

- `invariant`: Message is no longer prefixed with "Invariant Violation: ".

## [0.3.2] - 2015-10-12

### Added
- Apply appropriate transform (`loose-envify`) when bundling with `browserify`

## [0.3.1] - 2015-10-01

### Fixed
- Ensure the build completes correctly before packaging

## [0.3.0] - 2015-10-01

### Added
- More modules: `memoizeStringOnly`, `joinClasses`
- `UserAgent`: Query information about current user agent

### Changed
- `fetchWithRetries`: Reject failure with an Error, not the response
- `getActiveElement`: no longer throws in non-browser environment
