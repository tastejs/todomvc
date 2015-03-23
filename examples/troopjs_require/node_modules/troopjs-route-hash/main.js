define('troopjs-route-hash/version',[], { 'toString': function () { return ; } });

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-route-hash/component',[
	"troopjs-compose/factory",
	"troopjs-dom/component",
	"troopjs-hub/component",
	"troopjs-hub/emitter",
	"mu-jquery-hashchange/jquery.hashchange"
], function (Factory, DOMComponent, HUBComponent, hub) {
	

	/**
	 * Component that attaches to the window object in order to handle `window.location.hash` changes.
	 * @class route.hash.component
	 * @extend dom.component
	 * @alias hash.component
	 */

	var $ELEMENT = "$element";
	var HASH = "_hash";
	var RE = /^#/;

	/**
	 * Hash change event (global)
	 * @localdoc Triggered when a {@link #$element} with {@link route.hash.component} attached to it changes its hash
	 * @event hub/hash/change
	 * @param {String} hash The new hash
	 */

	/**
	 * Hash change event (local)
	 * @localdoc Triggered when the attached {@link #$element} hash is changed
	 * @event dom/hashchange
	 * @preventable
	 * @param {Object} $event {@link jQuery} event
	 * @param {String} hash The new hash
	 */

	/**
	 * Hash set event (global)
	 * @localdoc Triggered when a component wants to change the hash of an {@link #$element}'s with {@link route.hash.component} attached to it
	 * @event hub/hash/set
	 * @param {String} hash The new hash
	 * @param {Boolean} [silent=false] Change the hash silently without triggering {@link route.hash.component#event-hub/hash/change} event.
	 */

	/**
	 * Hash set event (local)
	 * @localdoc Triggered when a component wants to change the attached {@link #$element} hash
	 * @event dom/hashset
	 * @preventable
	 * @param {Object} $event {@link jQuery} event
	 * @param {String} hash The new hash
	 * @param {Boolean} [silent=false] Change the hash silently without triggering {@link route.hash.component#event-dom/hashchange} event.
	 */

	/**
	 * Fires whenever the browser route has changed
	 * @event hub/route/change
	 * @preventable
	 * @param {String} hash The new hash
	 */

	/**
	 * Hash change handler (global)
	 * @inheritdoc #event-hub/hash/change
	 * @handler hub/hash/change
	 * @template
	 * @return {Promise}
	 */

	return Factory(HUBComponent, DOMComponent, {
		"displayName" : "route/hash/component",

		/**
		 * @inheritdoc
		 * @handler
		 */
		"sig/start" : function () {
			this[$ELEMENT].trigger("hashchange");
		},

		/**
		 * Hash change handler (local)
		 * @handler
		 * @inheritdoc #event-dom/hashchange
		 * @localdoc Handles changing hash of the attached {@link #$element}
		 * @param {Object} $event {@link jQuery} event
		 * @fires hub/route/change
		 */
		"dom/hashchange": function ($event) {
			var me = this;
			var hash = me[$ELEMENT].get(0).location.hash.replace(RE, "");

			// Did anything change?
			if (hash !== me[HASH]) {
				// Store and publish new hash
				hub.emit("route/change", me[HASH] = hash);
			}
			else {
				// Prevent further hashchange handlers from receiving this
				$event.stopImmediatePropagation();
			}
		},

		/**
		 * Hash set handler (local)
		 * @inheritdoc #event-dom/hashset
		 * @localdoc Handles setting hash of the attached {@link #$element}
		 * @handler
		 */
		"dom/hashset": function ($event, hash, silent) {
			hub.emit("route/set", hash, null, silent);
		},

		/**
		 * Route set handler (global), implicitly translates to {@link #event-dom/hashset} by setting the {@link #$element} hash
		 * @handler hub/route/set
		 * @return {Promise}
		 */
		"hub/route/set": function (path, data, silent) {
			var me = this;

			// If we are silent we update the local me[HASH] to prevent change detection
			if (silent === true) {
				me[HASH] = path;
			}

			me[$ELEMENT].get(0).location.hash = path;
		}
	});
});

define(['troopjs-route-hash/version'], function (version) {
	return version;
});