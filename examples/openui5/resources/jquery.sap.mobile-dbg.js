/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides common helper functions for the mobile version of UI5 
sap.ui.define(['jquery.sap.global', 'sap/ui/Device', 'jquery.sap.dom', 'jquery.sap.events'],
	function(jQuery, Device/* , jQuerySap1, jQuerySap2 */) {
	"use strict";


	(function($) { // TODO get rid of inner scope function, rename $ to jQuery
		var FAKE_OS_PATTERN = /(?:\?|&)sap-ui-xx-fakeOS=([^&]+)/;
	
		$.sap.simulateMobileOnDesktop = false;
	
		// OS overriding mechanism
		if ((Device.browser.webkit || (Device.browser.msie && Device.browser.version >= 10)) && !jQuery.support.touch) { // on non-touch webkit browsers and IE10 we are interested in overriding
	
			var result = document.location.search.match(FAKE_OS_PATTERN);
			var resultUA = result && result[1] || jQuery.sap.byId("sap-ui-bootstrap").attr("data-sap-ui-xx-fakeOS");
	
			if (resultUA) {
	
				$.sap.simulateMobileOnDesktop = true;
	
				var ua = { // for "ios"/"android"/"blackberry" we have defined fake user-agents; these will affect all other browser/platform detection mechanisms
						ios: "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0_1 like Mac OS X) AppleWebKit/534.48 (KHTML, like Gecko) Version/5.1 Mobile/9A406 Safari/7534.48.3",
						iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0_1 like Mac OS X) AppleWebKit/534.48 (KHTML, like Gecko) Version/5.1 Mobile/9A406 Safari/7534.48.3",
						ipad: "Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206",
						android: "Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; GT-I9100 Build/IML74K) AppleWebKit/534.46 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.46",
						android_phone: "Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; GT-I9100 Build/IML74K) AppleWebKit/534.46 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.46",
						android_tablet: "Mozilla/5.0 (Linux; Android 4.1.2; Nexus 7 Build/JZ054K) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Safari/535.19",
						blackberry: "Mozilla/5.0 (BB10; Touch) AppleWebKit/537.10+ (KHTML, like Gecko) Version/10.0.9.2372 Mobile Safari/537.10+",
						winphone: "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)"
				}[resultUA];
	
				if (ua &&
						(Device.browser.webkit && resultUA !== "winphone" || Device.browser.msie && resultUA === "winphone")) { // only for the working combinations
	
					// code for modifying the real user-agent
					if (Device.browser.safari) {
						var __originalNavigator = window.navigator;
						window.navigator = {};
						/*eslint-disable no-proto */
						window.navigator.__proto__ = __originalNavigator;
						/*eslint-enable no-proto */
						window.navigator.__defineGetter__('userAgent', function(){ return ua; });
					} else { // Chrome, IE10
						Object.defineProperty(navigator, "userAgent", {
							get: function() {
								return ua;
							}
						});
					}
	
					if (Device.browser.webkit) {
	
						// all downstream checks will be fine with the faked user-agent.
						// But now we also need to adjust the wrong upstream settings in jQuery:
						jQuery.browser.msie = jQuery.browser.opera = jQuery.browser.mozilla = false;
						jQuery.browser.webkit = true;
						jQuery.browser.version = "534.46"; // this is not exactly true for all UAs, but there are much bigger shortcomings of this approach than a minor version of the browser, so giving the exact value is not worth the effort
					} // else in IE10 with winphone emulation, jQuery.browser has already the correct information
	
					// update the sap.ui.Device.browser.* information
					Device._update($.sap.simulateMobileOnDesktop);
				}
			}
		}
	
		/**
		 * Holds information about the current operating system
		 * 
		 * @name jQuery.os
		 * @namespace
		 * @deprecated since 1.20: use sap.ui.Device.os
		 * @public
		 */
		$.os = $.extend(/** @lends jQuery.os */ {
	
			/**
			 * The name of the operating system; currently supported are: "ios", "android", "blackberry"
			 * @type {string}
			 * @deprecated since 1.20: use sap.ui.Device.os.name
			 * @public
			 */
			os: Device.os.name,
	
			/**
			 * The version of the operating system as a string (including minor versions)
			 * @type {string}
			 * @deprecated since 1.20: use sap.ui.Device.os.versionStr
			 * @public
			 */
			version: Device.os.versionStr,
	
			/**
			 * The version of the operating system parsed as a float (major and first minor version)
			 * @type {float}
			 * @deprecated since 1.20: use sap.ui.Device.os.version
			 * @public
			 */
			fVersion: Device.os.version
		}, $.os);
	
		$.os[Device.os.name] = true;
	
		/**
		 * Whether the current operating system is Android
		 * @type {boolean}
		 * @public
		 * @deprecated since 1.20: use sap.ui.Device.os.android
		 * @name jQuery.os.android
		 */
	
		/**
		 * Whether the current operating system is BlackBerry
		 * @type {boolean}
		 * @public
		 * @deprecated since 1.20: use sap.ui.Device.os.blackberry
		 * @name jQuery.os.blackberry
		 */
	
		/**
		 * Whether the current operating system is Apple iOS
		 * @type {boolean}
		 * @public
		 * @deprecated since 1.20: use sap.ui.Device.os.ios
		 * @name jQuery.os.ios
		 */
		
		/**
		 * Whether the current operating system is Windows Phone
		 * @type {boolean}
		 * @public
		 * @deprecated since 1.20: use sap.ui.Device.os.winphone
		 * @name jQuery.os.winphone
		 */
	
	
		// feature and state detection
		$.extend( $.support, {
	
			/**
			 * Whether the device has a retina display (window.devicePixelRatio >= 2)
			 * @type {boolean}
			 * @public
			 */
			retina: window.devicePixelRatio >= 2
		});
	
		
		/**
		 * @name jQuery.device
		 * @namespace
		 * @deprecated since 1.20: use the respective functions of sap.ui.Device
		 * @public
		 */
		$.device = $.extend({}, $.device);
	
		/**
		 * Holds information about the current device and its state
		 * 
		 * @name jQuery.device.is
		 * @namespace
		 * @deprecated since 1.20: use the respective functions of sap.ui.Device
		 * @public
		 */
		$.device.is = $.extend( /** @lends jQuery.device.is */ {
	
			/**
			 * Whether the application runs in standalone mode without browser UI (launched from the iOS home screen)
			 * @type {boolean}
			 * @deprecated since 1.20: use window.navigator.standalone
			 * @public
			 */
			standalone: window.navigator.standalone,
	
			/**
			 * Whether the device is in "landscape" orientation (also "true" when the device does not know about the orientation)
			 * @type {boolean}
			 * @deprecated since 1.20: use sap.ui.Device.orientation.landscape
			 * @public
			 */
			landscape: Device.orientation.landscape,
	
			/**
			 * Whether the device is in portrait orientation
			 * @type {boolean}
			 * @deprecated since 1.20: use sap.ui.Device.orientation.portrait
			 * @public
			 */
			portrait: Device.orientation.portrait,
	
			/**
			 * Whether the application runs on an iPhone
			 * @type {boolean}
			 * @deprecated since 1.20: shouldn't do device specific coding; if still needed, use sap.ui.Device.os.ios &amp;&amp; sap.ui.Device.system.phone
			 * @public
			 */
			iphone: Device.os.ios && Device.system.phone,
	
			/**
			 * Whether the application runs on an iPad
			 * @type {boolean}
			 * @deprecated since 1.20: shouldn't do device specific coding; if still needed, use sap.ui.Device.os.ios &amp;&amp; sap.ui.Device.system.tablet
			 * @public
			 */
			ipad: Device.os.ios && Device.system.tablet,
	
			/**
			 * Whether the application runs on an Android phone - based not on screen size but user-agent (so this is not guaranteed to be equal to jQuery.device.is.phone on Android)
			 * https://developers.google.com/chrome/mobile/docs/user-agent
			 * Some device vendors however do not follow this rule
			 * @deprecated since 1.17.0: use sap.ui.Device.system.phone &amp;&amp; sap.ui.Device.os.android  instead
			 * @type {boolean}
			 * @public
			 */
			android_phone: Device.system.phone && Device.os.android,
	
			/**
			 * Whether the application runs on an Android tablet - based not on screen size but user-agent (so this is not guaranteed to be equal to jQuery.device.is.tablet on Android)
			 * https://developers.google.com/chrome/mobile/docs/user-agent
			 * Some device vendors however do not follow this rule
			 * @type {boolean}
			 * @deprecated since 1.17.0: use sap.ui.Device.system.tablet &amp;&amp; sap.ui.Device.os.android  instead
			 * @public
			 */
			android_tablet: Device.system.tablet && Device.os.android,
	
			/**
			 * Whether the running device is a tablet.
			 * If a desktop browser runs in mobile device simulation mode (with URL parameter sap-ui-xx-fakeOS or sap-ui-xx-test-mobile), 
			 * this property will also be set according to the simulated platform.
			 * This property will be false when runs in desktop browser.
			 * @type {boolean}
			 * @deprecated since 1.17.0: use sap.ui.Device.system.tablet instead
			 * @public
			 */
			tablet: Device.system.tablet,
	
			/**
			 * Whether the running device is a phone.
			 * If a desktop browser runs in mobile device simulation mode (with URL parameter sap-ui-xx-fakeOS or sap-ui-xx-test-mobile), 
			 * this property will also be set according to the simulated platform.
			 * This property will be false when runs in desktop browser.
			 * @type {boolean}
			 * @deprecated since 1.17.0: use sap.ui.Device.system.phone instead
			 * @public
			 */
			phone: Device.system.phone,
	
			/**
			 * Whether the running device is a desktop browser.
			 * If a desktop browser runs in mobile device simulation mode (with URL parameter sap-ui-xx-fakeOS or sap-ui-xx-test-mobile), 
			 * this property will be false.
			 * @type {boolean}
			 * @deprecated since 1.17.0: use sap.ui.Device.system.desktop instead
			 * @public
			 */
			desktop: Device.system.desktop
		},$.device.is);

		// Windows Phone specific handling
		if (Device.os.windows_phone) {
			var oTag;
			// Disable grey highlights over tapped areas.
			// This meta tag works since Windows 8.1.
			// Write in-place, otherwise IE ignores it:
			oTag = document.createElement("meta");
			oTag.setAttribute("name", "msapplication-tap-highlight");
			oTag.setAttribute("content", "no");
			document.head.appendChild(oTag);

			// Style for correct viewport size and scale definition.
			// It works correctly since Windows 8.1.
			// Older 8.0 patches return wrong device-width:
			oTag = document.createElement("style");
			oTag.appendChild(document.createTextNode('@-ms-viewport{width:device-width;}'));
			document.head.appendChild(oTag);
		}

		var _bInitMobileTriggered = false;
		/**
		 * Does some basic modifications to the HTML page that make it more suitable for mobile apps.
		 * Only the first call to this method is executed, subsequent calls are ignored. Note that this method is also called by the constructor of toplevel controls like sap.m.App, sap.m.SplitApp and sap.m.Shell.
		 * Exception: if no homeIcon was set, subsequent calls have the chance to set it.
		 *
		 * The "options" parameter configures what exactly should be done.
		 *
		 * It can have the following properties:
		 * <ul>
		 * <li>viewport: whether to set the viewport in a way that disables zooming (default: true)</li>
		 * <li>statusBar: the iOS status bar color, "default", "black" or "black-translucent" (default: "default")</li>
		 * <li>hideBrowser: whether the browser UI should be hidden as far as possible to make the app feel more native (default: true)</li>
		 * <li>preventScroll: whether native scrolling should be disabled in order to prevent the "rubber-band" effect where the whole window is moved (default: true)</li>
		 * <li>preventPhoneNumberDetection: whether Safari Mobile should be prevented from transforming any numbers that look like phone numbers into clickable links; this should be left as "true", otherwise it might break controls because Safari actually changes the DOM. This only affects all page content which is created after initMobile is called.</li>
		 * <li>rootId: the ID of the root element that should be made fullscreen; only used when hideBrowser is set (default: the document.body)</li>
		 * <li>useFullScreenHeight: a boolean that defines whether the height of the html root element should be set to 100%, which is required for other elements to cover the full height (default: true)</li>
		 * <li>homeIcon: deprecated since 1.12, use jQuery.sap.setIcons instead.
		 * </ul>
		 *
		 * @param {object}  [options] configures what exactly should be done
		 * @param {boolean} [options.viewport=true] whether to set the viewport in a way that disables zooming
		 * @param {string}  [options.statusBar='default'] the iOS status bar color, "default", "black" or "black-translucent"
		 * @param {boolean} [options.hideBrowser=true] whether the browser UI should be hidden as far as possible to make the app feel more native
		 * @param {boolean} [options.preventScroll=true] whether native scrolling should be disabled in order to prevent the "rubber-band" effect where the whole window is moved
		 * @param {boolean} [options.preventPhoneNumberDetection=true] whether Safari mobile should be prevented from transforming any numbers that look like phone numbers into clickable links
		 * @param {string}  [options.rootId] the ID of the root element that should be made fullscreen; only used when hideBrowser is set. If not set, the body is used
		 * @param {boolean} [options.useFullScreenHeight=true] whether the height of the html root element should be set to 100%, which is required for other elements to cover the full height
		 * @param {string}  [options.homeIcon=undefined] deprecated since 1.12, use jQuery.sap.setIcons instead.
		 * @param {boolean} [options.homeIconPrecomposed=false] deprecated since 1.12, use jQuery.sap.setIcons instead.
		 * @param {boolean} [options.mobileWebAppCapable=true] whether the Application will be loaded in full screen mode after added to home screen on mobile devices. The default value for this property only enables the full screen mode when runs on iOS device.
		 * 
		 * @name jQuery.sap.initMobile
		 * @function
		 * @public
		 */
		$.sap.initMobile = function(options) {
			var $head = $("head");
	
			if (!_bInitMobileTriggered) { // only one initialization per HTML page
				_bInitMobileTriggered = true;
	
				options = $.extend({}, { // merge in the default values
					viewport: true,
					statusBar: "default",
					hideBrowser: true,
					preventScroll: true,
					preventPhoneNumberDetection: true,
					useFullScreenHeight: true,
					homeIconPrecomposed: false,
					mobileWebAppCapable: "default"
				}, options);
	
				// en-/disable automatic link generation for phone numbers
				if (Device.os.ios && options.preventPhoneNumberDetection) {
					$head.append($('<meta name="format-detection" content="telephone=no">')); // this only works for all DOM created afterwards
				} else if (Device.browser.msie) {
					$head.append($('<meta http-equiv="cleartype" content="on">'));
					$head.append($('<meta name="msapplication-tap-highlight" content="no">'));
				}
	
				var bIsIOS7Safari = Device.os.ios && Device.os.version >= 7 && Device.os.version < 8 && Device.browser.name === "sf";
				// initialize viewport
				if (options.viewport) {
					var sMeta;
					if (bIsIOS7Safari && Device.system.phone) {
						//if the softkeyboard is open in orientation change, we have to do this to solve the zoom bug on the phone -
						//the phone zooms into the view although it shouldn't so these two lines will zoom out again see orientation change below
						//the important part seems to be removing the device width
						sMeta = 'minimal-ui, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
					} else if (bIsIOS7Safari && Device.system.tablet) {
						//remove the width = device width since it will not work correctly if the webside is embedded in a webview
						sMeta = 'initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
					} else if ($.device.is.iphone && (Math.max(window.screen.height, window.screen.width) === 568)) {
						// iPhone 5
						sMeta = "user-scalable=0, initial-scale=1.0";
					} else if (Device.os.android && Device.os.version < 3) {
						sMeta = "width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
					} else {
						// all other devices
						sMeta = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
					}
					$head.append($('<meta name="viewport" content="' + sMeta + '">'));
				}
				
				if (options.mobileWebAppCapable === "default") {
					if (Device.os.ios) {
						// keep the old behavior for compatibility
						// enable fullscreen mode only when runs on iOS devices
						$head.append($('<meta name="apple-mobile-web-app-capable" content="yes">')); // since iOS 2.1
					}
				} else {
					$.sap.setMobileWebAppCapable(options.mobileWebAppCapable);
				}
	
				if (Device.os.ios) {
					// set the status bar style on Apple devices
					$head.append($('<meta name="apple-mobile-web-app-status-bar-style" content="' + options.statusBar + '">')); // "default" or "black" or "black-translucent", since iOS 2.1
	
					// splash screen
					//<link rel="apple-touch-startup-image" href="/startup.png">
				}
	
				if (options.preventScroll && !sap.ui.Device.os.blackberry) {
					$(window).bind("touchmove", function sapInitMobileTouchMoveHandle(oEvent) {
						if (!oEvent.isMarked()) {
							oEvent.preventDefault(); // prevent the rubber-band effect
						}
					});
				}
	
				if (options.useFullScreenHeight) {
					$(function() {
						document.documentElement.style.height = "100%"; // set html root tag to 100% height
					});
				}
			}

			if (options && options.homeIcon) {
				var oIcons;

				if (typeof options.homeIcon === "string") {
					oIcons = { phone: options.homeIcon };
				} else {
					oIcons = $.extend({}, options.homeIcon);
				}

				oIcons.precomposed = options.homeIconPrecomposed || oIcons.precomposed;
				oIcons.favicon = options.homeIcon.icon || oIcons.favicon;
				oIcons.icon = undefined;
				$.sap.setIcons(oIcons);
			}
		};

		/**
		 * Sets the bookmark icon for desktop browsers and the icon to be displayed on the home screen of iOS devices after the user does "add to home screen".
		 *
		 * Only call this method once and call it early when the page is loading: browsers behave differently when the favicon is modified while the page is alive.
		 * Some update the displayed icon inside the browser but use an old icon for bookmarks.
		 * When a favicon is given, any other existing favicon in the document will be removed.
		 * When at least one home icon is given, all existing home icons will be removed and new home icon tags for all four resolutions will be created.
		 *
		 * The home icons must be in PNG format and given in different sizes for iPad/iPhone with and without retina display.
		 * The favicon is used in the browser and for desktop shortcuts and should optimally be in ICO format:
		 * PNG does not seem to be supported by Internet Explorer and ICO files can contain different image sizes for different usage locations. E.g. a 16x16px version
		 * is used inside browsers.
		 *
		 * All icons are given in an an object holding icon URLs and other settings. The properties of this object are:
		 * <ul>
		 * <li>phone: a 57x57 pixel version for non-retina iPhones</li>
		 * <li>tablet: a 72x72 pixel version for non-retina iPads</li>
		 * <li>phone@2: a 114x114 pixel version for retina iPhones</li>
		 * <li>tablet@2: a 144x144 pixel version for retina iPads</li>
		 * <li>precomposed: whether the home icons already have some glare effect (otherwise iOS will add it) (default: false)</li>
		 * <li>favicon: the ICO file to be used inside the browser and for desktop shortcuts</li>
		 * </ul>
		 *
		 * One example is:
		 * <pre>
		 * {
		 *    'phone':'phone-icon_57x57.png',
		 *    'phone@2':'phone-retina_117x117.png',
		 *    'tablet':'tablet-icon_72x72.png',
		 *    'tablet@2':'tablet-retina_144x144.png',
		 *    'precomposed':true,
		 *    'favicon':'desktop.ico'
		 * }
		 * </pre>
		 * If one of the sizes is not given, the largest available alternative image will be used instead for this size.
		 * On Android these icons may or may not be used by the device. Apparently chances can be improved by using icons with glare effect, so the "precomposed" property can be set to "true". Some Android devices may also use the favicon for bookmarks instead of the home icons.</li>
		 * 
		 * @param {object} oIcons
		 * @name jQuery.sap.setIcons
		 * @function
		 * @public
		 */
		$.sap.setIcons = function(oIcons) {
	
			if (!oIcons || (typeof oIcons !== "object")) {
				$.sap.log.warning("Call to jQuery.sap.setIcons() has been ignored because there were no icons given or the argument was not an object.");
				return;
			}
	
			var $head = $("head"),
				precomposed = oIcons.precomposed ? "-precomposed" : "",
				getBestFallback = function(res) {
					return oIcons[res] || oIcons['tablet@2'] || oIcons['phone@2'] || oIcons['phone'] || oIcons['tablet']; // fallback logic
				},
				mSizes = {
					"phone": "",
					"tablet": "72x72",
					"phone@2": "114x114",
					"tablet@2": "144x144"
				};
	
			// desktop icon
			if (oIcons["favicon"]) {
	
				// remove any other favicons
				var $fav = $head.find("[rel^=shortcut]"); // cannot search for "shortcut icon"
	
				$fav.each(function(){
					if (this.rel === "shortcut icon") {
						$(this).remove();
					}
				});
	
				// create favicon
				$head.append($('<link rel="shortcut icon" href="' + oIcons["favicon"] + '" />'));
			}
	
			// mobile home screen icons
			if (getBestFallback("phone")) {
	
				// if any home icon is given remove old ones
				$head.find("[rel=apple-touch-icon]").remove();
				$head.find("[rel=apple-touch-icon-precomposed]").remove();
			}
	
			for (var platform in mSizes) {
				oIcons[platform] = oIcons[platform] || getBestFallback(platform);
				if (oIcons[platform]) {
					var size = mSizes[platform];
					$head.append($('<link rel="apple-touch-icon' + precomposed + '" ' + (size ? 'sizes="' + size + '"' : "") + ' href="' + oIcons[platform] + '" />'));
				}
			}
		};

		/**
		 * Sets the "apple-mobile-web-app-capable" and "mobile-web-app-capable" meta information which defines whether the application is loaded
		 * in full screen mode (browser address bar and toolbar are hidden) after the user does "add to home screen" on mobile devices. Currently
		 * this meta tag is only supported by iOS Safari and mobile Chrome from version 31.
		 * 
		 * If the application opens new tabs because of attachments, url and so on, setting this to false will let the user be able to go from the
		 * new tab back to the application tab after the application is added to home screen.
		 * 
		 * Note: this function only has effect when the application runs on iOS Safari and mobile Chrome from version 31.
		 * 
		 * @param {boolean} bValue whether the Application will be loaded in full screen mode after added to home screen from iOS Safari or mobile Chrome from version 31.
		 * @name jQuery.sap.setMobileWebAppCapable
		 * @function
		 * @public
		 */
		$.sap.setMobileWebAppCapable = function(bValue) {
			if (!Device.system.tablet && !Device.system.phone) {
				return;
			}

			var $Head = $("head"),
				aPrefixes = ["", "apple"],
				sNameBase = "mobile-web-app-capable",
				sContent = bValue ? "yes" : "no",
				i, sName, $WebAppMeta;

			for (i = 0 ; i < aPrefixes.length ; i++) {
				sName = aPrefixes[i] ? (aPrefixes[i] + "-" + sNameBase) : sNameBase;
				$WebAppMeta = $Head.children('meta[name="' + sName + '"]');
				if ($WebAppMeta.length) {
					$WebAppMeta.attr("content", sContent);
				} else {
					$Head.append($('<meta name="' + sName + '" content="' + sContent + '">'));
				}
			}
		};
	})(jQuery);
	
	return jQuery;
	
});
