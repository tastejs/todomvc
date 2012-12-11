Chaplin = require 'chaplin'
Model = require 'models/base/model'

module.exports = class Collection extends Chaplin.Collection
  # Use the project base model per default, not Chaplin.Model
  model: Model

  # Mixin a synchronization state machine
  # _(@prototype).extend Chaplin.SyncMachine
