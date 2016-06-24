export function configure(aurelia) {
	aurelia.use
		.standardConfiguration();

	aurelia.start().then(a => a.setRoot());
}
