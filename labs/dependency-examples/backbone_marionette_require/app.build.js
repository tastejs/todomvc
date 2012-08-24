

({
  baseUrl: "js/",
  mainConfigFile: 'js/main.js',
  out: "js/main.built.js",

  //The directory path to save the output. If not specified, then
  //the path will default to be a directory called "build" as a sibling
  //to the build file. All relative paths are relative to the build file.
  //  dir: "../some/path",
  locale: "en-us",
  optimize: "uglify",

  uglify: {
    toplevel: true,
    ascii_only: true,
    beautify: true,
    max_line_length: 1000
  },

  optimizeCss: "standard.keepLines",

  inlineText: true,
  useStrict: false,

  // Breaks anything that defines a 'require'
  //namespace: 'commit',
  skipPragmas: false,
  skipModuleInsertion: false,
  stubModules: ['text'],
  optimizeAllPluginResources: false,
  findNestedDependencies: false,
  removeCombined: false,
  include : 'main',

  fileExclusionRegExp: /^\./,

  preserveLicenseComments: true,

  logLevel: 0

})
