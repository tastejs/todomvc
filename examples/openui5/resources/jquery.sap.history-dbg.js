/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'jquery.sap.strings'],
	function(jQuery/* , jQuerySap1 */) {
	"use strict";

	(function($, window){ // TODO remove inner scope function, rename jQuery to $
			//suffix of virtual hash 
		var skipSuffix = "_skip",
		
			//the regular expression for matching the unique id in the hash
			rIdRegex = /\|id-[0-9]+-[0-9]+/,
			
			//the regular expression for matching the suffix in the hash
			skipRegex = new RegExp(skipSuffix + "[0-9]*$"),
			
			//array of routes
			routes = [],
			
			//array represents the current history stack
			hashHistory = [],
			
			//mark if the change of the hash is from the code or from pressing the back or forward button
			mSkipHandler = {},
			
			//index of the skip suffix
			skipIndex = 0,
			
			//the current hash of the history handling
			currentHash,
			
			//the hash format separator
			sIdSeperator = "|",
			
			//array that buffers the changed to the hash in order to make them handled one by one
			aHashChangeBuffer = [],
			
			//marker if the handling hash change is in processing
			bInProcessing = false,
			
			//default handler which will be called when url contains an empty hash
			defaultHandler,
			
			//avoid calling the history initialization twice
			bInitialized = false;
		
		
		/** 
		 * jQuery.sap.history is deprecated. Please use {@link sap.ui.core.routing.Route} instead.
		 *
		 * Initialize the history handling and set the routes and default handler.
		 * This should be only called once with the mSettings set in the right format. If the mSettings is not an object,
		 * you have another chance to call this function again to initialize the history handling. But once the mSettings
		 * is set with an object, you can only call the addRoute and setDefaultHandler to set the data.
		 *
		 * @deprecated since 1.19.1. Please use {@link sap.ui.core.routing.Route} instead.
		 * @param {object} mSettings The map that contains data in format:
		 * <pre>
		 * {
		 *	routes: [{
		 * 		path: string //identifier for one kind of hash
		 *		handler: function	//function what will be called when the changed hash is matched against the path.
		 *							//first parameter: the json data passed in when calling the addHistory
		 *							//second parameter: the type of the navigation {@link jQuery.sap.history.NavType}
		 *		}],
		 *		defaultHandler: function	//this function will be called when empty hash is matched
		 *									//first parameter: the type of the navigation {@link jQuery.sap.history.NavType}
		 * }
		 * </pre>
		 * @public
		 * @name jQuery.sap.history
		 * @class Enables the back and forward buttons in browser to navigate back or forth through the browser history stack.<br/><br/>
		 * 
		 * It also supports adding virtual history which used only to mark some intermediate state in order to navigate back to the previous state. 
		 * And this state will be skipped from the browser history stack immediately after a new history state is added to the history stack after this state <br/><br/>
		 * 
		 * By providing the hash saved from the return value of calling jQuery.sap.history.addHistory, jQuery.sap.history.backToHash will navigate back directly to the
		 * history state with the same hash. <br/><br/>
		 * 
		 * Please use jQuery.sap.history.back() to go one step back in the history stack instead of using window.history.back(), because it handles the empty history stack
		 * situation and will call the defaultHandler for this case. <br/><br/>
		 * 
		 *
		 * Example for the usage of history handling:
		 * <pre>
		 *	//Initialization
		 *	jQuery.sap.history({
		 *		routes: [], //please refer to the jQuery.sap.history function comment for the format. 
		 *		defaultHandler: function(){
		 *			//code here
		 *		}
		 *	});
		 *   
		 *	//add history
		 *	var hash = jQuery.sap.history.addHistory("IDENTIFIER", jsonData);
		 *   
		 *	//add virtual history
		 *	jQuery.sap.history.addVirtualHistory();
		 *   
		 *	//back to hash
		 *	jQuery.sap.history.backToHash(hash);
		 *   
		 *	//back one step along the history stack
		 *	jQuery.sap.history.back();
		 * </pre>
		 * 
		 */
		$.sap.history = function(mSettings){
			//if mSetting is not a object map, return
			if (!jQuery.isPlainObject(mSettings)) {
				return;
			}
			
			
			if (!bInitialized) {
				var jWindowDom = $(window),
					//using href instead of hash to avoid the escape problem in firefox
					sHash = (window.location.href.split("#")[1] || "");
				
				jWindowDom.bind('hashchange', detectHashChange);
				
				if ($.isArray(mSettings.routes)) {
					var i, route;
					for (i = 0 ; i < mSettings.routes.length ; i++) {
						route = mSettings.routes[i];
						if (route.path && route.handler) {
							$.sap.history.addRoute(route.path, route.handler);
						}
					}
				}
		
				if (jQuery.isFunction(mSettings.defaultHandler)) {
					defaultHandler = mSettings.defaultHandler;
				}
				
				//push the current hash to the history stack
				hashHistory.push(sHash);
				
				//goes in from bookmark
				if (sHash.length > 1) {
					jWindowDom.trigger("hashchange", [true]);
				} else {
					currentHash = sHash;
				}
				
				bInitialized = true;
			}
		};
		
		/**
		 * This function adds a history record. It will not trigger the related handler of the routes, the changes have to be done by the
		 * developer. Normally, a history record should be added when changes are done already. 
		 * 
		 * @param {string} sIdf The identifier defined in the routes which will be matched in order to call the corresponding handler
		 * @param {object} oStateData The object passed to the corresponding handler when the identifier is matched with the url hash
		 * @param {boolean} bBookmarkable Default value is set to true. If this is set to false, the default handler will be called when this identifier and data are matched
		 * @param {boolean} [bVirtual] This states if the history is a virtual history that should be skipped when going forward or backward in the history stack.
		 * @returns {string} sHash The complete hash string which contains the identifier, stringified data, optional uid, and bookmarkable digit. This hash can be passed into 
		 *     the backToHash function when navigating back to this state is intended.
		 * 
		 * @function
		 * @public
		 * @name jQuery.sap.history#addHistory
		 */
		$.sap.history.addHistory = function(sIdf, oStateData, bBookmarkable, bVirtual){
			var uid, sHash;
			if (bBookmarkable === undefined) {
				bBookmarkable = true;
			}
			
			if (!bVirtual) {
				sHash = preGenHash(sIdf, oStateData);
				uid = getAppendId(sHash);
				if (uid) {
					sHash += (sIdSeperator + uid);
				}
				sHash += (sIdSeperator + (bBookmarkable ? "1" : "0"));
				
			} else {
				sHash = getNextSuffix(currentHash);
			}
			aHashChangeBuffer.push(sHash);
			mSkipHandler[sHash] = true;
			window.location.hash = sHash;
			
			return sHash;
		};
		
		
		/**
		 * This function adds a virtual history record based on the current hash. A virtual record is only for marking the current state of the application, 
		 * and when the back button clicked it will return to the previous state. It is used when the marked state shouldn't be seen by the user when user click
		 * the back or forward button of the browser. For example, when showing a context menu a virtual history record should be added and this record will be skipped
		 * when user navigates back and it will return directly to the previous history record. If you avoid adding the virtual history record, it will return to one
		 * history record before the one your virtual record is based on. That's why virtual record is necessary.
		 * 
		 * @function
		 * @public
		 * @name jQuery.sap.history#addVirtualHistory
		 */
		$.sap.history.addVirtualHistory = function(){
			$.sap.history.addHistory("", undefined, false, true);
		};
		
		
		/**
		 * Adds a route to the history handling.
		 * 
		 * @param {string} sIdf The identifier that is matched with the hash in the url in order to call the corresponding handler.
		 * @param {function} fn The function that will be called when the identifier is matched with the hash.
		 * @param {object} [oThis] If oThis is provided, the fn function's this keyword will be bound to this object.
		 * 
		 * @returns {object} It returns the this object to enable chaining.
		 * 
		 * @function
		 * @public
		 * @name jQuery.sap.history#addRoute
		 */
		$.sap.history.addRoute = function(sIdf, fn, oThis){
			if (oThis) {
				fn = jQuery.proxy(fn, oThis);
			}
			
			var oRoute = {};
			oRoute.sIdentifier = sIdf;
			oRoute['action'] = fn;
			
			routes.push(oRoute);
			return this;
		};
		
		/**
		 * Set the default handler which will be called when there's an empty hash in the url.
		 * 
		 * @param {function} fn The function that will be set as the default handler
		 * @public
		 * 
		 * @function
		 * @name jQuery.sap.history#setDefaultHandler
		 */
		$.sap.history.setDefaultHandler = function(fn){
			defaultHandler = fn;
		};
		
		$.sap.history.getDefaultHandler = function(){
			return defaultHandler;
		};
		
		
		
		/**
		 * This function calculate the number of back steps to the specific sHash passed as parameter,
		 * and then go back to the history state with this hash.
		 * 
		 * @param {string} sHash The hash string needs to be navigated. This is normally returned when you call the addhistory method.
		 * @public
		 * 
		 * @function
		 * @name jQuery.sap.history#backToHash
		 */
		$.sap.history.backToHash = function(sHash){
			sHash = sHash || "";
			var iSteps;
			
			//back is called directly after restoring the bookmark. Since there's no history stored, call the default handler.
			if (hashHistory.length === 1) {
				if ($.isFunction(defaultHandler)) {
					defaultHandler();
				}
			} else {
				iSteps = calculateStepsToHash(currentHash, sHash);
				if (iSteps < 0) {
					window.history.go(iSteps);
				} else {
					jQuery.sap.log.error("jQuery.sap.history.backToHash: " + sHash + "is not in the history stack or it's after the current hash");
				}
			}
		};
		
		/**
		 * This function will navigate back to the recent history state which has the sPath identifier. It is usually used to navigate back along one
		 * specific route and jump over the intermediate history state if there are any.
		 * 
		 * @param {string} sPath The route identifier to which the history navigates back.
		 * @public
		 * 
		 * @function
		 * @name jQuery.sap.history#backThroughPath
		 */
		$.sap.history.backThroughPath = function(sPath){
			sPath = sPath || "";
			sPath = window.encodeURIComponent(sPath);
			var iSteps;
			
			//back is called directly after restoring the bookmark. Since there's no history stored, call the default handler.
			if (hashHistory.length === 1) {
				if ($.isFunction(defaultHandler)) {
					defaultHandler();
				}
			} else {
				iSteps = calculateStepsToHash(currentHash, sPath, true);
				if (iSteps < 0) {
					window.history.go(iSteps);
				} else {
					jQuery.sap.log.error("jQuery.sap.history.backThroughPath: there's no history state which has the " + sPath + " identifier in the history stack before the current hash");
				}
			}
		};
		
		/**
		 * This function navigates back through the history stack. The number of steps is set by the parameter iSteps. It also handles the situation when it's called while there's nothing in the history stack.
		 * Normally this happens when the application is restored from the bookmark. If there's nothing in the history stack, the default handler will be called with NavType jQuery.sap.history.NavType.Back.
		 * 
		 * @param {int} [iSteps] how many steps you want to go back, by default the value is 1.
		 * @public
		 * 
		 * @function
		 * @name jQuery.sap.history#back
		 */
		$.sap.history.back = function(iSteps){
			
			//back is called directly after restoring the bookmark. Since there's no history stored, call the default handler.
			if (hashHistory.length === 1) {
				if ($.isFunction(defaultHandler)) {
					defaultHandler($.sap.history.NavType.Back);
				}
			} else {
				if (!iSteps) {
					iSteps = 1;
				}
				window.history.go(-1 * iSteps);
			}
		};
		
		/**
		 * @public
		 * @name jQuery.sap.history.NavType
		 * @namespace
		 * @static
		 */
		$.sap.history.NavType = {};
		
		/**
		 * This indicates that the new hash is achieved by pressing the back button.
		 * @type {string}
		 * @public
		 * @constant
		 * @name jQuery.sap.history.NavType.Back
		 */
		$.sap.history.NavType.Back = "_back";
		
		/**
		 * This indicates that the new hash is achieved by pressing the forward button.
		 * @type {string}
		 * @public
		 * @constant
		 * @name jQuery.sap.history.NavType.Forward
		 */
		$.sap.history.NavType.Forward = "_forward";
		
		/**
		 * This indicates that the new hash is restored from the bookmark.
		 * @type {string}
		 * @public
		 * @constant
		 * @name jQuery.sap.history.NavType.Bookmark
		 */
		$.sap.history.NavType.Bookmark = "_bookmark";
		
		/**
		 * This indicates that the new hash is achieved by some unknown direction.
		 * This happens when the user navigates out of the application and then click on the forward button
		 * in the browser to navigate back to the application.
		 * @type {string}
		 * @public
		 * @constant
		 * @name jQuery.sap.history.NavType.Unknown
		 */
		$.sap.history.NavType.Unknown = "_unknown";
		
		/**
		 * This function calculates the number of steps from the sCurrentHash to sToHash. If the sCurrentHash or the sToHash is not in the history stack, it returns 0.
		 * 
		 * @private
		 */
		function calculateStepsToHash(sCurrentHash, sToHash, bPrefix){
			var iCurrentIndex = $.inArray(sCurrentHash, hashHistory),
				iToIndex,
				i,
				tempHash;
			if (iCurrentIndex > 0) {
				if (bPrefix) {
					for (i = iCurrentIndex - 1; i >= 0 ; i--) {
						tempHash = hashHistory[i];
						if (tempHash.indexOf(sToHash) === 0 && !isVirtualHash(tempHash)) {
							return i - iCurrentIndex;
						}
					}
				} else {
					iToIndex = $.inArray(sToHash, hashHistory);
					
					//When back to home is needed, and application is started with nonempty hash but it's nonbookmarkable
					if ((iToIndex === -1) && sToHash.length === 0) {
						return -1 * iCurrentIndex;
					}
					
					if ((iToIndex > -1) && (iToIndex < iCurrentIndex)) {
						return iToIndex - iCurrentIndex;
					}
				}
			}
			
			return 0;
		}
		
		
		
		/**
		 * This function is bound to the window's hashchange event, and it detects the change of the hash.
		 * When history is added by calling the addHistory or addVirtualHistory function, it will not call the real onHashChange function
		 * because changes are already done. Only when a hash is navigated by clicking the back or forward buttons in the browser,
		 * the onHashChange will be called.
		 * 
		 * @private
		 */
		function detectHashChange(oEvent, bManual){
			//Firefox will decode the hash when it's set to the window.location.hash,
			//so we need to parse the href instead of reading the window.location.hash
			var sHash = (window.location.href.split("#")[1] || "");
			sHash = formatHash(sHash);
			
			if (bManual || !mSkipHandler[sHash]) {
				aHashChangeBuffer.push(sHash);
			}
			
			if (!bInProcessing) {
				bInProcessing = true;
				if (aHashChangeBuffer.length > 0) {
					var newHash = aHashChangeBuffer.shift();
				
					if (mSkipHandler[newHash]) {
						reorganizeHistoryArray(newHash);
						delete mSkipHandler[newHash];
					} else {
						onHashChange(newHash);
					}
					currentHash = newHash;
				}
				bInProcessing = false;
			}
		}
		
		/**
		 * This function removes the leading # sign if there's any. If the bRemoveId is set to true, it will also remove the unique
		 * id inside the hash.
		 * 
		 * @private
		 */
		function formatHash(hash, bRemoveId){
			var sRes = hash, iSharpIndex = hash ? hash.indexOf("#") : -1;
			
			if (iSharpIndex === 0) {
				sRes = sRes.slice(iSharpIndex + 1);
			}
			
			if (bRemoveId) {
				sRes = sRes.replace(rIdRegex, "");
			}
			
			return sRes;
		}
		
		/**
		 * This function returns a hash with suffix added to the end based on the sHash parameter. It handles as well when the current
		 * hash is already with suffix. It returns a new suffix with an unique number in the end.
		 * 
		 * @private
		 */
		function getNextSuffix(sHash){
			var sPath = sHash ? sHash : "";
			
			if (isVirtualHash(sPath)) {
				var iIndex = sPath.lastIndexOf(skipSuffix);
				sPath = sPath.slice(0, iIndex);
			}
			
			return sPath + skipSuffix + skipIndex++;
		}
		
		/**
		 * This function encode the identifier and data into a string.
		 * 
		 * @private
		 */
		function preGenHash(sIdf, oStateData){
			var sEncodedIdf = window.encodeURIComponent(sIdf);
			var sEncodedData = window.encodeURIComponent(window.JSON.stringify(oStateData));
			return sEncodedIdf + sIdSeperator + sEncodedData;
		}
		
		/**
		 * This function checks if the combination of the identifier and data is unique in the current history stack.
		 * If yes, it returns an empty string. Otherwise it returns an unique id.
		 * 
		 * @private
		 */
		function getAppendId(sHash){
			var iIndex = $.inArray(currentHash, hashHistory),
				i, sHistory;
			if (iIndex > -1) {
				for (i = 0 ; i < iIndex + 1 ; i++) {
					sHistory = hashHistory[i];
					if (sHistory.slice(0, sHistory.length - 2) === sHash) {
						return jQuery.sap.uid();
					}
				}
			}
			
			return "";
		}
		
		/**
		 * This function manages the internal array of history records.
		 * 
		 * @private 
		 */
		function reorganizeHistoryArray(sHash){
			var iIndex = $.inArray(currentHash, hashHistory);
				
			if ( !(iIndex === -1 || iIndex === hashHistory.length - 1) ) {
				hashHistory.splice(iIndex + 1, hashHistory.length - 1 - iIndex);
			}
			hashHistory.push(sHash);
		}
	
		/**
		 * This method judges if a hash is a virtual hash that needs to be skipped.
		 * 
		 * @private
		 */
		function isVirtualHash(sHash){
			return skipRegex.test(sHash);
		}
		
		/**
		 * This function calculates the steps forward or backward that need to skip the virtual history states.  
		 * 
		 * @private
		 */
		function calcStepsToRealHistory(sCurrentHash, bForward){
			var iIndex = $.inArray(sCurrentHash, hashHistory),
				i;
			
			if (iIndex !== -1) {
				if (bForward) {
					for (i = iIndex ; i < hashHistory.length ; i++) {
						if (!isVirtualHash(hashHistory[i])) {
							return i - iIndex;
						}
					}
				} else {
					for (i = iIndex ; i >= 0 ; i--) {
						if (!isVirtualHash(hashHistory[i])) {
							return i - iIndex;
						}
					}
					return -1 * (iIndex + 1);
				}
			}
		}
		
		
		/**
		 * This is the main function that handles the hash change event.
		 * 
		 * @private
		 */
		function onHashChange(sHash){
			var oRoute, iStep, oParsedHash, iNewHashIndex, sNavType;
			
			//handle the nonbookmarkable hash
			if (currentHash === undefined) {
				//url with hash opened from bookmark
				oParsedHash = parseHashToObject(sHash);
				
				if (!oParsedHash || !oParsedHash.bBookmarkable) {
					if (jQuery.isFunction(defaultHandler)) {
						defaultHandler($.sap.history.NavType.Bookmark);
					}
					return;
				}
			}
			
			if (sHash.length === 0) {
				if (jQuery.isFunction(defaultHandler)) {
					defaultHandler($.sap.history.NavType.Back);
				}
			} else {
				//application restored from bookmark with non-empty hash, and later navigates back to the first hash token
				//the defaultHandler should be triggered
				iNewHashIndex = jQuery.inArray(sHash, hashHistory);
				if (iNewHashIndex === 0) {
					oParsedHash = parseHashToObject(sHash);
					if (!oParsedHash || !oParsedHash.bBookmarkable) {
						if (jQuery.isFunction(defaultHandler)) {
							defaultHandler($.sap.history.NavType.Back);
						}
						return;
					}
				}
				
				//need to handle when iNewHashIndex equals -1.
				//This happens when user navigates out the current application, and later navigates back.
				//In this case, the hashHistory is an empty array.
				
				
				if (isVirtualHash(sHash)) {
					//this is a virtual history, should do the skipping calculation
					if (isVirtualHash(currentHash)) {
						//go back to the first one that is not virtual
						iStep = calcStepsToRealHistory(sHash, false);
						window.history.go(iStep);
					} else {
						var sameFamilyRegex = new RegExp(jQuery.sap.escapeRegExp(currentHash + skipSuffix) + "[0-9]*$");
						if (sameFamilyRegex.test(sHash)) {
							//going forward
							//search forward in history for the first non-virtual hash
							//if there is, change to that one window.history.go
							//if not, stay and return false
							iStep = calcStepsToRealHistory(sHash, true);
							if (iStep) {
								window.history.go(iStep);
							} else {
								window.history.back();
							}
							
						} else {
							//going backward
							//search backward for the first non-virtual hash and there must be one
							iStep = calcStepsToRealHistory(sHash, false);
							window.history.go(iStep);
						}
					}
				} else {
					if (iNewHashIndex === -1) {
						sNavType = $.sap.history.NavType.Unknown;
						hashHistory.push(sHash);
					} else {
						if (jQuery.inArray(currentHash, hashHistory, iNewHashIndex + 1) === -1) {
							sNavType = $.sap.history.NavType.Forward;
						} else {
							sNavType = $.sap.history.NavType.Back;
						}
					}
					
					
					oParsedHash = parseHashToObject(sHash);
					if (oParsedHash) {
						oRoute = findRouteByIdentifier(oParsedHash.sIdentifier);
						
						if (oRoute) {
							oRoute.action.apply(null, [oParsedHash.oStateData, sNavType]);
						}
					} else {
						jQuery.sap.log.error("hash format error! The current Hash: " + sHash);
					}
					
				}
			}
		}
	
		/**
		 * This function returns the route object matched by the identifier passed as parameter.
		 * @private
		 */
		function findRouteByIdentifier(sIdf){
			var i;
			for (i = 0 ; i < routes.length ; i++) {
				if (routes[i].sIdentifier === sIdf) {
					return routes[i];
				}
			}
		}
	
		/**
		 * This function parses the hash from the url to a concrete project in the format:
		 * {
		 * 		sIdentifier: string,
		 * 		oStateData: object,
		 * 		uid: string (optional),
		 * 		bBookmarkable: boolean
		 * 		
		 * }
		 * @private
		 */
		function parseHashToObject(sHash){
			if (isVirtualHash(sHash)) {
				var i = sHash.lastIndexOf(skipSuffix);
				sHash = sHash.slice(0, i);
			}
			
			
			var aParts = sHash.split(sIdSeperator), oReturn = {};
			if (aParts.length === 4 || aParts.length === 3) {
				oReturn.sIdentifier = window.decodeURIComponent(aParts[0]);
				oReturn.oStateData = window.JSON.parse(window.decodeURIComponent(aParts[1]));
				if (aParts.length === 4) {
					oReturn.uid = aParts[2];
				}
				
				oReturn.bBookmarkable = aParts[aParts.length - 1] === "0" ? false : true;
				
				return oReturn;
			} else {
				//here can be empty hash only with a skipable suffix
				return null;
			}
		}
		
	})(jQuery, this);

	return jQuery;

});
