# Application-specific utilities
# ------------------------------

# Delegate to Chaplin’s utils module.
utils = Chaplin.utils.beget Chaplin.utils

Backbone.utils.extend utils,
  toggle: (elem, visible) ->
    elem.style.display = (if visible then '' else 'none')

# Prevent creating new properties and stuff.
Object.seal? utils

module.exports = utils
