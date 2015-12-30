/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider', 'sap/ui/thirdparty/hasher'],
	function(jQuery, EventProvider, hasher) {
	"use strict";

	/**
	 * @class Class for manipulating and receiving changes of the browserhash with the hasher framework.
	 * Fires a "hashChanged" event if the browser hash changes.
	 * @extends sap.ui.base.EventProvider
	 *
	 * @public
	 * @alias sap.ui.core.routing.HashChanger
	 */
	var HashChanger = EventProvider.extend("sap.ui.core.routing.HashChanger", {

		constructor : function() {

			EventProvider.apply(this);

		}

	});

	/**
	 * Will start listening to hashChanges with the parseHash function.
	 * This will also fire a hashchanged event with the initial hash.
	 *
	 * @public
	 * @return false if it was initialized before, true if it was initialized the first time
	 */
	HashChanger.prototype.init = function() {
		if (this._initialized) {
			jQuery.sap.log.info("this HashChanger instance has already been initialized.");
			return false;
		}

		this._initialized = true;

		hasher.changed.add(this.fireHashChanged, this); //parse hash changes

		if (!hasher.isActive()) {
			hasher.initialized.addOnce(this.fireHashChanged, this); //parse initial hash
			hasher.init(); //start listening for history change
		} else {
			this.fireHashChanged(hasher.getHash());
		}

		return this._initialized;
	};

	/**
	 * Fires the hashchanged event, may be extended to modify the hash before fireing the event
	 * @param {string} newHash the new hash of the browser
	 * @param {string} oldHash - the previous hash
	 * @protected
	 */
	HashChanger.prototype.fireHashChanged = function(newHash, oldHash) {
		this.fireEvent("hashChanged",{ newHash : newHash, oldHash : oldHash });
	};

	/**
	 * Sets the hash to a certain value. When using the set function a browser history  entry is written.
	 * If you do not want to have an entry in the browser history, please use set replaceHash function.
	 * @param {string} sHash the hash
	 * @public
	 */
	HashChanger.prototype.setHash = function(sHash) {
		this.fireEvent("hashSet", { sHash : sHash });
		hasher.setHash(sHash);
	};

	/**
	 * Replaces the hash to a certain value. When using the replace function no browser history is written.
	 * If you want to have an entry in the browser history, please use set setHash function.
	 * @param {string} sHash the hash
	 * @public
	 */
	HashChanger.prototype.replaceHash = function(sHash) {
		this.fireEvent("hashReplaced", { sHash : sHash });
		hasher.replaceHash(sHash);
	};

	/**
	 * Gets the current hash
	 *
	 * @return {string} the current hash
	 * @public
	 */
	HashChanger.prototype.getHash = function() {
		return hasher.getHash();
	};

	/**
	 * Cleans the event registration
	 * @see sap.ui.base.Object.prototype.destroy
	 * @protected
	 */
	HashChanger.prototype.destroy = function() {
		hasher.changed.remove(this.fireHashChanged, this);
		EventProvider.prototype.destroy.apply(this, arguments);
	};

	(function() {

		var _oHashChanger = null;

		/**
		 * Gets a global singleton of the HashChanger. The singleton will get created when this function is invoked for the first time.
		 * @public
		 * @static
		 */
		HashChanger.getInstance = function() {
			if (!_oHashChanger) {
				_oHashChanger = new HashChanger();
			}
			return _oHashChanger;
		};

		function extendHashChangerEvents (oHashChanger) {
			var sEventName,
				aExistingEventListeners,
				aNewEventListeners;

			for (sEventName in _oHashChanger.mEventRegistry) {
				// only modify the new event registry if the old one contains the entry
				if (_oHashChanger.mEventRegistry.hasOwnProperty(sEventName)) {

					aExistingEventListeners = _oHashChanger.mEventRegistry[sEventName];
					aNewEventListeners = oHashChanger.mEventRegistry[sEventName];

					if (aNewEventListeners) {
						// Both instances have the same event: merge the arrays
						oHashChanger.mEventRegistry[sEventName] = aExistingEventListeners.concat(aNewEventListeners);
					} else {
						// Only the previous hashchanger has the event - add it to the new hashCHanger
						oHashChanger.mEventRegistry[sEventName] = aExistingEventListeners;
					}
				}
			}
		}

		/**
		 * Sets the hashChanger to a new instance, destroys the old one and copies all its event listeners to the new one
		 * @param {sap.ui.core.routing.HashChanger} oHashChanger the new instance for the global singleton
		 * @protected
		 */
		HashChanger.replaceHashChanger = function(oHashChanger) {
			if (_oHashChanger && oHashChanger) {

				var fnGetHistoryInstance = jQuery.sap.getObject("sap.ui.core.routing.History.getInstance"),
					oHistory;

				if (fnGetHistoryInstance) {
					oHistory = fnGetHistoryInstance();
					// unregister the hashChanger so the events don't get fired twice
					oHistory._unRegisterHashChanger();
				}

				extendHashChangerEvents(oHashChanger);
				_oHashChanger.destroy();

				if (oHistory) {
					// check if the history got loaded yet - if not there is no need to replace its hashchanger since it will ask for the global one
					oHistory._setHashChanger(oHashChanger);
				}
			}

			_oHashChanger = oHashChanger;
		};

	}());

	return HashChanger;

});
