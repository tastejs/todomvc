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
  string: 'framework',
  alias: {
    framework: 'f'
  }
})

if (typeof args.framework === 'string') {
  args.framework = [args.framework]
}

const examplesFolder = path.join(__dirname, '..', 'examples')
const names = fs.readdirSync(examplesFolder)
const filteredNames = R.difference(names, excludedFrameworks)

const frameworksToTest = args.framework ? args.framework : filteredNames
if (R.isEmpty(frameworksToTest)) {
  console.log('nothing to test ⚠️')
  process.exit(1)
}
console.log('testing %s', pluralize('framework', frameworksToTest.length, true))

const testFramework = framework => {
  console.log(
    figlet.textSync(framework, {
      font: 'Varsity'
    })
  )

  const addInfo = testResults => {
    delete testResults.screenshots
    delete testResults.video
    delete testResults.version
    delete testResults.duration
    testResults.framework = framework
    return testResults
  }

  const addColors = testResults => {
    testResults.failures = testResults.failures
      ? chalk.red(testResults.failures)
      : chalk.green(testResults.failures)
    return testResults
  }

  return cypress
    .run({
      env: {
        framework
      }
    })
    .then(addInfo)
    .then(addColors)
}

Promise.mapSeries(frameworksToTest, testFramework)
  .then(results => {
    console.table('TodoMVC results', results)
  })
  .catch(e => {
    console.error('problem testing frameworks')
    console.error(e)
  })
