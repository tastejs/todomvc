var config = {
  filename: __filename
, styles: '../styles/ui'
, scripts: {
    connectionAlert: require('./connectionAlert')
  }
};

module.exports = ui
ui.decorate = 'derby'

function ui(derby, options) {
  derby.createLibrary(config, options)
}
