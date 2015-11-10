define([
	'troopjs-compose/factory',
	'troopjs-hub/component',
	'troopjs-dom/component'
], function (Factory, HUBComponent, DOMComponent) {
	'use strict';

	/**
	 * Base component.
	 * Mixes `HUBComponent` and `DOMComponent`.
	 */

	return Factory(HUBComponent, DOMComponent);
});
