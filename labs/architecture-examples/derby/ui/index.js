function ui(derby, options) {
	derby.createLibrary({
		filename: __filename,
		styles: '../styles/ui',
		scripts: {
			connectionAlert: require('./connectionAlert')
		}
	}, options);
}

module.exports = ui;
ui.decorate = 'derby';
