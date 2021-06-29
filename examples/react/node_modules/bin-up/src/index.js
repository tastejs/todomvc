'use strict'

const exists = require('fs').existsSync
const {join, normalize} = require('path')

// TODO: respect npm prefix
// https://docs.npmjs.com/files/folders
const prefix = join('node_modules', '.bin')

function isGitRootFolder (folder) {
  const gitRoot = '.git'
  const full = join(folder, gitRoot)
  return exists(full)
}

const toFullAlias = (name) => (folder) =>
  join(folder, prefix, name)

function binUp (programName, startFolder = process.cwd()) {
  const toFoundPath = toFullAlias(programName)

  let currentFolder = startFolder
  let found

  while (true) {
    const inFolder = toFoundPath(currentFolder)
    if (exists(inFolder)) {
      if (process.env.VERBOSE) {
        console.error('Found %s', inFolder)
      }
      found = inFolder
      break
    }
    if (isGitRootFolder(currentFolder)) {
      console.error('reached git root folder %s', currentFolder)
      console.error('but could not find tool %s', programName)
      break
    }
    const parent = normalize(join(currentFolder, '..'))
    if (parent === currentFolder) {
      console.error('reached top level folder %s', currentFolder)
      console.error('but could not find tool %s', programName)
      break
    }
    currentFolder = parent
  }
  return found
}

module.exports = binUp
