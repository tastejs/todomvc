http = require 'http'
path = require 'path'
express = require 'express'
gzippo = require 'gzippo'
derby = require 'derby'
todos = require '../todos'
serverError = require './serverError'

## SERVER CONFIGURATION ##

expressApp = express()
server = http.createServer expressApp
module.exports = server

store = derby.createStore
	listen: server
require('./queries')(store)

ONE_YEAR = 1000 * 60 * 60 * 24 * 365
root = path.dirname path.dirname __dirname
publicPath = path.join root, 'public'

expressApp
	.use(express.favicon())
	# Gzip static files and serve from memory
	.use(gzippo.staticGzip publicPath, maxAge: ONE_YEAR)
	# Gzip dynamically rendered content
	.use(express.compress())

	# Adds req.getModel method
	.use(store.modelMiddleware())
	# Creates an express middleware from the app's routes
	.use(todos.router())
	.use(expressApp.router)
	.use(serverError root)


## SERVER ONLY ROUTES ##

expressApp.all '*', (req) ->
	throw "404: #{req.url}"
