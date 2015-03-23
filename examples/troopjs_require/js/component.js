define([
	'troopjs-compose/factory',
	'troopjs-hub/component',
	'troopjs-dom/component'
], function (Factory, HUBComponent, DOMComponent) {
	'use strict';
	return Factory(HUBComponent, DOMComponent);
});
