var excludedFrameworks = [
  // this implementation deviates from the specification to such an extent that they are
  // not worth testing via a generic mechanism
  'gwt',
  // these implementations cannot be run offline, because they are hosted
  'firebase-angular',
  'meteor',
  // YUI is a special case here, it is not hosted, but fetches JS files dynamically
  'yui',
  // these frameworks take a long time to start-up, and there is no easy way to determine when they are ready
  'cujo',
  // sammyjs fails intermittently, it would appear that its state is sometimes updated asynchronously?
  'sammyjs',
  // elm-html batches UI updates with requestAnimationFrame which the tests
  // don't wait for
  'elm',
  // these are examples that have been removed or are empty folders
  'emberjs_require',
  'dermis'
]
module.exports = excludedFrameworks
