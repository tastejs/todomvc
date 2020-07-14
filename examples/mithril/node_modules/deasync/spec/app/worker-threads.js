let version = Number(process.version.match(/^v(\d+)/)[1])
if (version < 12) return

const { Worker, isMainThread } = require('worker_threads')

if (isMainThread) {
  new Worker(__filename)
} else {
  const deasync = require('../../index.js')
  deasync.sleep(100)
}
