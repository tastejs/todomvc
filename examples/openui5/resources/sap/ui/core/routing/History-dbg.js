/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', './HashChanger'],
	function(jQuery, HashChanger) {
	"use strict";


	/**
	 * Used to determine the {@link sap.ui.core.HistoryDirection} of the current or a future navigation,
	 * done with a {@link sap.ui.core.routing.Router} or {@link sap.ui.core.routing.HashChanger}.
	 *
	 * <strong>ATTENTION:</strong> this class will not be accurate if someone does hash-replacement without the named classes above
	 * If you are manipulating the hash directly this class is not supported anymore.
	 *
	 * @param {sap.ui.core.routing.HashChanger} oHashChanger required, without a HashChanger this class cannot work. The class needs to be aware of the hash-changes.
	 * @public
	 * @class
	 * @alias sap.ui.core.routing.History
	 */
	var History = function(oHashChanger) {
		this._iHistoryLength = window.history.length;
		this.aHistory = [];
		this._bIsInitial = true;

		if (!oHashChanger) {
			jQuery.sap.log.error("sap.ui.core.routing.History constructor was called and it did not get a hashChanger as parameter");
		}

		this._setHashChanger(oHashChanger);

		this._reset();
	};

	/**
	 * Detaches all events and cleans up this instance
	 */
	History.prototype.destroy = function(sNewHash) {
		this._unRegisterHashChanger();
	};

	/**
	 * Determines what the navigation direction for a newly given hash would be
	 * It will say Unknown if there is a history foo - bar (current history) - foo
	 * If you now ask for the direction of the hash "foo" you get Unknown because it might be backwards or forwards.
	 * For hash replacements, the history stack will be replaced at this position for the history.
	 * @param {string} [sNewHash] optional, if this parameter is not passed the last hashChange is taken.
	 * @returns {sap.ui.core.routing.HistoryDirection} or undefined, if no navigation has taken place yet.
	 * @public
	 */
	History.prototype.getDirection = function(sNewHash) {
		//no navigation has taken place and someone asks for a direction
		if (sNewHash !== undefined && this._bIsInitial) {
			return undefined;
		}

		if (sNewHash === undefined) {
			return this._sCurrentDirection;
		}

		return this._getDirection(sNewHash);
	};

	/**
	 * gets the previous hash in the history - if the last direction was Unknown or there was no navigation yet, undefined will be returned
	 * @returns {string} or undefined
	 * @public
	 */
	History.prototype.getPreviousHash = function() {
		return this.aHistory[this.iHistoryPosition - 1];
	};

	History.prototype._setHashChanger = function(oHashChanger) {
		if (this._oHashChanger) {
			this._unRegisterHashChanger();
		}

		this._oHashChanger = oHashChanger;
		this._oHashChanger.attachEvent("hashChanged", this._onHashChange, this);
		this._oHashChanger.attachEvent("hashReplaced", this._hashReplaced, this);
		this._oHashChanger.attachEvent("hashSet", this._hashSet, this);
	};

	History.prototype._unRegisterHashChanger = function() {
		this._oHashChanger.detachEvent("hashChanged", this._onHashChange, this);
		this._oHashChanger.detachEvent("hashReplaced", this._hashReplaced, this);
		this._oHashChanger.detachEvent("hashSet", this._hashSet, this);

		this._oHashChanger = null;
	};


		/**
	 * Empties the history array, and sets the instance back to the unknown state.
	 * @private
	 */
	History.prototype._reset = function() {
		this.aHistory.length = 0;
		this.iHistoryPosition = 0;
		this._bUnknown = true;

		/*
		 * if the history is reset it should always get the current hash since -
		 * if you go from the Unknown to a defined state and then back is pressed we can be sure that the direction is backwards.
		 * Because the only way from unknown to known state is a new entry in the history.
		 */
		this.aHistory[0] = this._oHashChanger.getHash();
	};

		/**
		 * Determines what the navigation direction for a newly given hash would be
		 * @param {string} sNewHash the new hash
		 * @param bHistoryLengthIncreased if the history length has increased compared with the last check
		 * @param bCheckHashChangerEvents Checks if the hash was set or replaced by the hashchanger. When getDirection is called by an app this has to be false.
		 * @returns {sap.ui.core.routing.HistoryDirection}
		 * @private
		 */
	History.prototype._getDirection = function(sNewHash, bHistoryLengthIncreased, bCheckHashChangerEvents) {
		var oDirection = sap.ui.core.routing.HistoryDirection;

		//Next hash was set by the router - it has to be a new entry
		if (bCheckHashChangerEvents && this._oNextHash && this._oNextHash.sHash === sNewHash) {
			return oDirection.NewEntry;
		}


		//increasing the history length will add entries but we cannot rely on this as only criteria, since the history length is capped
		if (bHistoryLengthIncreased) {
			return oDirection.NewEntry;
		}

		//we have not had a direction yet and the application did not trigger navigation + the browser history does not increase
		//the user is navigating in his history but we cannot determine the direction
		if (this._bUnknown) {
			return oDirection.Unknown;
		}

		//At this point we know the user pressed a native browser navigation button

		//both directions contain the same hash we don't know the direction
		if (this.aHistory[this.iHistoryPosition + 1] === sNewHash && this.aHistory[this.iHistoryPosition - 1] === sNewHash) {
			return oDirection.Unknown;
		}

		if (this.aHistory[this.iHistoryPosition - 1] === sNewHash) {
			return oDirection.Backwards;
		}

		if (this.aHistory[this.iHistoryPosition + 1] === sNewHash) {
			return oDirection.Forwards;
		}

		//Nothing hit, return unknown since we cannot determine what happened
		return oDirection.Unknown;
	};

	History.prototype._onHashChange = function(oEvent) {
		this._hashChange(oEvent.getParameter("newHash"));
	};

	/**
	 * Handles a hash change and cleans up the History
	 * @private
	 */
	History.prototype._hashChange = function(sNewHash) {
		var oDirection = sap.ui.core.routing.HistoryDirection,
			actualHistoryLength = window.history.length,
			sDirection;

		//We don't want to record replaced hashes
		if (this._oNextHash && this._oNextHash.bWasReplaced && this._oNextHash.sHash === sNewHash) {
			//Since a replace has taken place, the current history entry is also replaced
			this.aHistory[this.iHistoryPosition] = sNewHash;
			this._oNextHash = null;
			return;
		}

		//a navigation has taken place so the history is not initial anymore.
		this._bIsInitial = false;

		sDirection = this._sCurrentDirection = this._getDirection(sNewHash, this._iHistoryLength < window.history.length, true);

		// Remember the new history length, after it has been taken into account by getDirection
		this._iHistoryLength = actualHistoryLength;

		//the next hash direction was determined - set it back
		if (this._oNextHash) {
			this._oNextHash = null;
		}

		//We don't know the state of the history, don't record it set it back to unknown, since we can't say what comes up until the app navigates again
		if (sDirection === oDirection.Unknown) {
			this._reset();
			return;
		}

		//We are at a known state of the history now, since we have a new entry / forwards or backwards
		this._bUnknown = false;

		//new history entry
		if (sDirection === oDirection.NewEntry) {
			//new item and there where x back navigations before - remove all the forward items from the history
			if (this.iHistoryPosition + 1 < this.aHistory.length) {
				this.aHistory = this.aHistory.slice(0, this.iHistoryPosition + 1);
			}

			this.aHistory.push(sNewHash);
			this.iHistoryPosition += 1;
			return;
		}

		if (sDirection === oDirection.Forwards) {
			this.iHistoryPosition++;
			return;
		}

		if (sDirection === oDirection.Backwards) {
			this.iHistoryPosition--;
		}
	};

	/**
	 * Handles a hash change and cleans up the History
	 * @private
	 */
	History.prototype._hashSet = function(oEvent) {
		this._hashChangedByApp(oEvent.getParameter("sHash"), false);
	};

	/**
	 * Handles a hash change and cleans up the History
	 * @private
	 */
	History.prototype._hashReplaced = function(oEvent) {
		this._hashChangedByApp(oEvent.getParameter("sHash"), true);
	};

	/**
	 * Sets the next hash that is going to happen in the hashChange function - used to determine if the app or the browserHistory/links triggered this navigation
	 * @param {string} sNewHash
	 * @param {boolean} bWasReplaced
	 */
	History.prototype._hashChangedByApp = function(sNewHash, bWasReplaced) {
		this._oNextHash = { sHash : sNewHash, bWasReplaced : bWasReplaced };
	};

	(function() {
		var instance = new History(HashChanger.getInstance());

		/**
		 * @alias sap.ui.core.routing.History#getInstance
		 * @public
		 * @returns { sap.ui.core.routing.History } a global singleton that gets created as soon as the sap.ui.core.routing.History is required
		 */
		History.getInstance = function() {
			return instance;
		};
	}());

	return History;

}, /* bExport= */ true);
