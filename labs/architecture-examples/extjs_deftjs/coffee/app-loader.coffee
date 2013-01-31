Ext.Loader.setConfig(
  enabled: true
  paths:
    "TodoDeftJS": "js"
)

# Force require of ExtJS classes that DeftJS depends on, for use in cases where ext-dev.js is used.
# Has no effect when using bootstrap.js or ext-all-dev.js
Ext.syncRequire( [ "Ext.Component", "Ext.ComponentManager", "Ext.ComponentQuery", ] )