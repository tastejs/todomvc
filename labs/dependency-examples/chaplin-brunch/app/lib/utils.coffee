Chaplin = require 'chaplin'

# Application-specific utilities
# ------------------------------

# Delegate to Chaplin’s utils module
utils = Chaplin.utils.beget Chaplin.utils

# _(utils).extend
#  someMethod: ->

module.exports = utils
