derby = require 'derby'
{isProduction} = derby.util

module.exports = (root) ->
	staticPages = derby.createStatic root

	return (err, req, res, next) ->
		return next() unless err?

		console.log(if err.stack then err.stack else err)

		## Customize error handling here ##
		message = err.message || err.toString()
		status = parseInt message
		if status is 404
			staticPages.render '404', res, {url: req.url}, 404
		else
			res.send if 400 <= status < 600 then status else 500
