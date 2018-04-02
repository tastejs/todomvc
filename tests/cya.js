require('console.table')

const path = require('path')
const fs = require('fs')
const figlet = require('figlet')
const chalk = require('chalk')
const cypress = require('cypress')
const Promise = require('bluebird')
const pluralize = require('pluralize')
const R = require('ramda')
const excludedFrameworks = require('./excluded')

const args = require('minimist')(process.argv.slice(2), {
  string: ['framework', 'browser'],
  number: 'times',
  boolean: 'main', // run list of main apps
  boolean: 'problems', // run list of problematic apps
  alias: {
    framework: 'f',
    times: 't',
    problems: 'p'
  },
  default: {
    times: 1
  }
})

if (typeof args.framework === 'string') {
  args.framework = [args.framework]
}

const examplesFolder = path.join(__dirname, '..', 'examples')
const names = fs.readdirSync(examplesFolder)
const allFrameworks = R.difference(names, excludedFrameworks)

const mainFrameworks = [
  'backbone',
  'dojo',
  'react',
  'vue',
  'angularjs',
  'knockback',
  'mithril',
  'backbone_marionette',
  'emberjs',
  'canjs',
  'ampersand',
  'troopjs_require',
  'knockoutjs',
  'polymer',
  'flight'
]

const problematicFrameworks = ['scalajs-react', 'js_of_ocaml', 'flight']

const frameworksToTest = args.framework
  ? args.framework
  : args.main
      ? mainFrameworks
      : args.problems ? problematicFrameworks : allFrameworks
if (R.isEmpty(frameworksToTest)) {
  console.log('nothing to test ⚠️')
  process.exit(1)
}
console.log('testing %s', pluralize('framework', frameworksToTest.length, true))
if (args.times) {
  console.log('running all tests %s', pluralize('time', args.times, true))
}
if (args.browser) {
  console.log('in browser %s', args.browser)
}

const testApp = app => {
  console.log(
    figlet.textSync(app, {
      font: 'Varsity'
    })
  )

  const colorFailures = n => (n ? chalk.red(n) : chalk.green(n))
  const addColors = R.over(R.lensProp('failures'), colorFailures)

  return cypress
    .run({
      browser: args.browser,
      record: true,
      key: '6f32e649-6348-4d6e-8ec0-4b57774965d1',
      env: {
        framework: app,
        times: args.times
      }
    })
    .then(R.omit(['screenshots', 'video', 'version']))
    .then(R.set(R.lensProp('app'), app))
    .then(addColors)
}

Promise.mapSeries(frameworksToTest, testApp)
  .then(results => {
    console.table('TodoMVC results', results)
  })
  .catch(e => {
    console.error('problem testing frameworks')
    console.error(e)
  })
