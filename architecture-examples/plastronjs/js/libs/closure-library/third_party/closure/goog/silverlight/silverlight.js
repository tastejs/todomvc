/**
 * @license
 * Portions of this code are from Silverlight.js under the Ms-PL license and
 * modified by The Closure Authors.
 *
 * Silverlight.js                      version 4.0.50401.0
 *
 * This file is provided by Microsoft as a helper file for websites that
 * incorporate Silverlight Objects. This file is provided under the Microsoft
 * Public License available at
 * http://code.msdn.microsoft.com/silverlightjs/Project/License.aspx.
 * You may not use or distribute this file or the code in this file except as
 * expressly permitted under that license.
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 */

/**
 * @fileoverview Modified version of Silverlight.js to work with
 * the compiler's advanced modes. The API should be the same, except
 * that they're namespaced under goog.silverlight instead of Silverlight.
 *
 * We've also modified this so that the silverlight bootstrapper
 * does not run by default. If you need to start up silverlight, you
 * should explicitly call goog.silverlight.startup().
 *
 * @author nicksantos@google.com (Nick Santos) (ported to Closure)
 */

goog.provide('goog.silverlight');


/**
 * Counter of globalized event handlers
 * @type {number}
 */
goog.silverlight._silverlightCount = 0;


/**
 * Prevents onSilverlightInstalled from being called multiple
 * times
 * @type {boolean}
 */
goog.silverlight.__onSilverlightInstalledCalled = false;


/**
 * Prefix for fwlink URL's
 * @type {string}
 */
goog.silverlight.fwlinkRoot = 'http://go2.microsoft.com/fwlink/?LinkID=';


/**
 * Ensures that only one Installation State event is fired.
 * @type {boolean}
 */
goog.silverlight.__installationEventFired = false;


/**
 * Called by goog.silverlight.getSilverlight to notify the page that a user
 * has requested the Silverlight installer
 * @type {Function}
 */
goog.silverlight.onGetSilverlight = null;


/**
 * Called by Silverlight.waitForInstallCompletion when the page detects
 * that Silverlight has been installed. The event handler is not called
 * in upgrade scenarios.
 */
goog.silverlight.onSilverlightInstalled = function() {
  window.location.reload(false);
};


/**
 * Checks to see if the correct version is installed.
 * @param {?string=} version The silverlight version.
 * @return {boolean} Whether silverlight is installed.
 */
goog.silverlight.isInstalled = function(version) {
  if (version == undefined)
    version = null;

  var isVersionSupported = false;
  var container = null;

  try {
    var control = null;
    var tryNS = false;
    if (typeof ActiveXObject == 'undefined') {
      try {
        control = new ActiveXObject('AgControl.AgControl');
        if (version === null) {
          isVersionSupported = true;
        } else if (control.isVersionSupported(version)) {
          isVersionSupported = true;
        }
        control = null;
      } catch (e) {
        tryNS = true;
      }
    } else {
      tryNS = true;
    }
    if (tryNS) {
      var plugin = navigator.plugins['Silverlight Plug-In'];
      if (plugin) {
        if (version === null) {
          isVersionSupported = true;
        } else {
          var actualVer = plugin.description;
          if (actualVer === '1.0.30226.2')
            actualVer = '2.0.30226.2';
          var actualVerArray = actualVer.split('.');
          while (actualVerArray.length > 3) {
            actualVerArray.pop();
          }
          while (actualVerArray.length < 4) {
            actualVerArray.push(0);
          }
          var reqVerArray = version.split('.');
          while (reqVerArray.length > 4) {
            reqVerArray.pop();
          }

          var requiredVersionPart;
          var actualVersionPart;
          var index = 0;


          do {
            requiredVersionPart = parseInt(reqVerArray[index], 10);
            actualVersionPart = parseInt(actualVerArray[index], 10);
            index++;
          }
          while (index < reqVerArray.length &&
                 requiredVersionPart === actualVersionPart);

          if (requiredVersionPart <= actualVersionPart &&
              !isNaN(requiredVersionPart)) {
            isVersionSupported = true;
          }
        }
      }
    }
  } catch (e) {
    isVersionSupported = false;
  }

  return isVersionSupported;
};


/**
 * Occasionally checks for Silverlight installation status. If it
 * detects that Silverlight has been installed then it calls
 * Silverlight.onSilverlightInstalled();. This is only supported
 * if Silverlight was not previously installed on this computer.
 */
goog.silverlight.waitForInstallCompletion = function() {
  if (!goog.silverlight.isBrowserRestartRequired &&
      goog.silverlight.onSilverlightInstalled) {
    try {
      navigator.plugins.refresh();
    } catch (e) {
    }
    if (goog.silverlight.isInstalled(null) &&
        !goog.silverlight.__onSilverlightInstalledCalled) {
      goog.silverlight.onSilverlightInstalled();
      goog.silverlight.__onSilverlightInstalledCalled = true;
    } else {
      setTimeout(goog.silverlight.waitForInstallCompletion, 3000);
    }
  }
};


/**
 * Performs startup tasks.
 */
goog.silverlight.startup = function() {
  navigator.plugins.refresh();
  goog.silverlight.isBrowserRestartRequired =
      goog.silverlight.isInstalled(null);
  if (!goog.silverlight.isBrowserRestartRequired) {
    goog.silverlight.waitForInstallCompletion();
    if (!goog.silverlight.__installationEventFired) {
      goog.silverlight.onInstallRequired();
      goog.silverlight.__installationEventFired = true;
    }
  } else if (window.navigator.mimeTypes) {
    var mimeSL2 = navigator.mimeTypes['application/x-silverlight-2'];
    var mimeSL2b2 = navigator.mimeTypes['application/x-silverlight-2-b2'];
    var mimeSL2b1 = navigator.mimeTypes['application/x-silverlight-2-b1'];
    var mimeHighestBeta = mimeSL2b1;
    if (mimeSL2b2)
      mimeHighestBeta = mimeSL2b2;

    if (!mimeSL2 && (mimeSL2b1 || mimeSL2b2)) {
      if (!goog.silverlight.__installationEventFired) {
        goog.silverlight.onUpgradeRequired();
        goog.silverlight.__installationEventFired = true;
      }
    } else if (mimeSL2 && mimeHighestBeta) {
      if (mimeSL2.enabledPlugin &&
          mimeHighestBeta.enabledPlugin) {
        if (mimeSL2.enabledPlugin.description !=
            mimeHighestBeta.enabledPlugin.description) {
          if (!goog.silverlight.__installationEventFired) {
            goog.silverlight.onRestartRequired();
            goog.silverlight.__installationEventFired = true;
          }
        }
      }
    }
  }
};


/**
 * Inserts a Silverlight <object> tag or installation experience into
 * the HTML DOM based on the current installed state of
 * goog.silverlight.
 * @param {string} source The source file.
 * @param {Element} parentElement The place to render the tag.
 * @param {(string|null)=} opt_id A DOM id for the tag.
 * @param {Object=} opt_properties Properties for the tag. One of these should
 *     be version, to get the correct version of silverlight.
 * @param {Array.<Function>=} opt_events An array of functions, keyed by
 *     the name of the event that they should be listening on (e.g.,
 *     "onload"). What a weird API. The keys should be quoted if you're
 *     compiling with property renaming on.
 * @param {string=} opt_initParams The initParams property of SilverlightPlugin.
 * @param {Object=} opt_userContext Context to fire the events in. doesn't
 *     really work correctly. Use goog.bind instead.
 * @return {?string} The html for the object, if no rendering parent
 *     was specified.
 */
goog.silverlight.createObject =
    function(source, parentElement, opt_id, opt_properties,
             opt_events, opt_initParams, opt_userContext) {
  var slPluginHelper = {};
  var slProperties = opt_properties;
  var slEvents = opt_events;

  slPluginHelper.version = slProperties.version;
  slProperties.source = source;
  slPluginHelper.alt = slProperties.alt;

  // Rename properties to their tag property names. For backwards compatibility
  // with goog.silverlight.js version 1.0
  if (opt_initParams)
    slProperties.initParams = opt_initParams;
  if (slProperties.isWindowless && !slProperties.windowless)
    slProperties.windowless = slProperties.isWindowless;
  if (slProperties.framerate && !slProperties.maxFramerate)
    slProperties.maxFramerate = slProperties.framerate;
  if (opt_id && !slProperties.id)
    slProperties.id = opt_id;

  // remove elements which are not to be added to the instantiation tag
  delete slProperties.ignoreBrowserVer;
  delete slProperties.inplaceInstallPrompt;
  delete slProperties.version;
  delete slProperties.isWindowless;
  delete slProperties.framerate;
  delete slProperties.data;
  delete slProperties.src;
  delete slProperties.alt;


  // detect that the correct version of Silverlight is installed, else
  // display install
  var slPluginHtml;
  if (goog.silverlight.isInstalled(slPluginHelper.version)) {
    // move unknown events to the slProperties array
    for (var name in slEvents) {
      if (slEvents[name]) {
        if (name == 'onLoad' && typeof slEvents[name] == 'function' &&
            slEvents[name].length != 1) {
          var onLoadHandler = slEvents[name];
          slEvents[name] = function(sender) {
            return onLoadHandler(
                document.getElementById(/** @type {string} */ (opt_id)),
                opt_userContext,
                sender);
          };
        }
        var handlerName = goog.silverlight.getHandlerName(slEvents[name]);
        if (handlerName != null) {
          slProperties[name] = handlerName;
          slEvents[name] = null;
        } else {
          throw 'typeof events.' + name + " must be 'function' or 'string'";
        }
      }
    }
    slPluginHtml = goog.silverlight.buildHtml(slProperties);
  } else {
    // The control could not be instantiated. Show the installation prompt
    slPluginHtml = goog.silverlight.buildPromptHtml(slPluginHelper);
  }

  // insert or return the HTML
  if (parentElement) {
    parentElement.innerHTML = slPluginHtml;
  } else {
    return slPluginHtml;
  }
  return null;
};


/**
 * Create HTML that instantiates the control
 * @param {Object} slProperties The properties of the object.
 * @return {string} The HTML for the object.
 */
goog.silverlight.buildHtml = function(slProperties) {
  var htmlBuilder = [];

  htmlBuilder.push(
      '<object type=\"application/x-silverlight\" ' +
      'data="data:application/x-silverlight,"');
  if (slProperties.id != null) {
    htmlBuilder.push(
        ' id="' +
        goog.silverlight.htmlAttributeEncode(slProperties.id) + '"');
  }
  if (slProperties.width != null) {
    htmlBuilder.push(' width="' + slProperties.width + '"');
  }
  if (slProperties.height != null) {
    htmlBuilder.push(' height="' + slProperties.height + '"');
  }
  htmlBuilder.push(' >');

  delete slProperties.id;
  delete slProperties.width;
  delete slProperties.height;

  for (var name in slProperties) {
    if (slProperties[name]) {
      htmlBuilder.push(
          '<param name="' + goog.silverlight.htmlAttributeEncode(name) +
          '" value="' +
          goog.silverlight.htmlAttributeEncode(slProperties[name]) +
          '" />');
    }
  }
  htmlBuilder.push('<\/object>');
  return htmlBuilder.join('');
};


/**
 * takes a single parameter of all createObject
 * parameters enclosed in {}
 * @param {{source: string,
 *          parentElement: Element,
 *          id: string,
 *          properties: Object,
 *          events: Array.<Function>,
 *          initParams: string,
 *          context: Object}} params Named parameters of createObject.
 * @return {?string} See #createObject.
 */
goog.silverlight.createObjectEx = function(params) {
  // stupid hack to make compiler stop complaining.
  var unused = {properties: 0, events: 0, context: 0};

  var parameters = params;
  var html = goog.silverlight.createObject(
      parameters.source, parameters.parentElement, parameters.id,
      parameters.properties, parameters.events, parameters.initParams,
      parameters.context);
  if (parameters.parentElement == null) {
    return html;
  }
  return null;
};


/**
 * Builds the HTML to prompt the user to download and install Silverlight
 *
 * @param {{version: string, alt: string}} slPluginHelper Alt is an alternate
 *     link to silverlight. If no alternate is specified, a default will
 *     be used with the given version number.
 * @return {string} The UI.
 */
goog.silverlight.buildPromptHtml = function(slPluginHelper) {
  var slPluginHtml = '';
  var urlRoot = goog.silverlight.fwlinkRoot;
  var version = slPluginHelper.version;
  if (slPluginHelper.alt) {
    slPluginHtml = slPluginHelper.alt;
  } else {
    if (!version) {
      version = '';
    }
    slPluginHtml =
        "<a href='javascript:goog.silverlight.getSilverlight(\"{1}\");' " +
        "style='text-decoration: none;'><img src='{2}' " +
        "alt='Get Microsoft Silverlight' style='border-style: none'/></a>";
    slPluginHtml = slPluginHtml.replace('{1}', version);
    slPluginHtml = slPluginHtml.replace('{2}', urlRoot + '108181');
  }

  return slPluginHtml;
};


/**
 * Navigates the browser to the appropriate Silverlight installer
 * @param {string} version The silverlight version.
 */
goog.silverlight.getSilverlight = function(version) {
  if (goog.silverlight.onGetSilverlight) {
    goog.silverlight.onGetSilverlight();
  }

  var shortVer = '';
  var reqVerArray = String(version).split('.');
  if (reqVerArray.length > 1) {
    var majorNum = parseInt(reqVerArray[0], 10);
    if (isNaN(majorNum) || majorNum < 2) {
      shortVer = '1.0';
    } else {
      shortVer = reqVerArray[0] + '.' + reqVerArray[1];
    }
  }

  var verArg = '';

  if (shortVer.match(/^\d+\056\d+$/)) {
    verArg = '&v=' + shortVer;
  }

  goog.silverlight.followFWLink('149156' + verArg);
};


/**
 * Navigates to a url based on fwlinkid
 * @param {string} linkid The link suffix.
 */
goog.silverlight.followFWLink = function(linkid) {
  top.location = goog.silverlight.fwlinkRoot + String(linkid);
};


/**
 * Encodes special characters in input strings as charcodes
 * @param {?string} strInput String to encode, or null. If null
 *     is passed, we give null right back.
 * @return {?string} The encoded string, or null.
 */
goog.silverlight.htmlAttributeEncode = function(strInput) {
  var c;
  var retVal = '';

  if (strInput == null) {
    return null;
  }

  for (var cnt = 0; cnt < strInput.length; cnt++) {
    c = strInput.charCodeAt(cnt);

    if (((c > 96) && (c < 123)) ||
        ((c > 64) && (c < 91)) ||
        ((c > 43) && (c < 58) && (c != 47)) ||
        (c == 95)) {
      retVal = retVal + String.fromCharCode(c);
    } else {
      retVal = retVal + '&#' + c + ';';
    }
  }

  return retVal;
};


/**
 * Default error handling function
 * @param {SilverlightDependencyObject} sender dep object.
 * @param {SilverlightErrorEventArgs} args The event.
 */
goog.silverlight.defaultErrorHandler = function(sender, args) {
  var iErrorCode;
  var errorType = args.errorType;

  iErrorCode = args.errorCode;

  var errMsg = '\nSilverlight error message     \n';

  errMsg += 'ErrorCode: ' + iErrorCode + '\n';


  errMsg += 'ErrorType: ' + errorType + '       \n';
  errMsg += 'Message: ' + args.errorMessage + '     \n';

  if (errorType == 'ParserError') {
    errMsg += 'XamlFile: ' + args.xamlFile + '     \n';
    errMsg += 'Line: ' + args.lineNumber + '     \n';
    errMsg += 'Position: ' + args.charPosition + '     \n';
  } else if (errorType == 'RuntimeError') {
    if (args.lineNumber != 0) {
      errMsg += 'Line: ' + args.lineNumber + '     \n';
      errMsg += 'Position: ' + args.charPosition + '     \n';
    }
    errMsg += 'MethodName: ' + args.methodName + '     \n';
  }
  alert(errMsg);
};


/**
 * Releases event handler resources when the page is unloaded
 */
goog.silverlight.__cleanup = function() {
  for (var i = goog.silverlight._silverlightCount - 1; i >= 0; i--) {
    goog.global['__closure_slEvent' + i] = null;
  }
  goog.silverlight._silverlightCount = 0;
  if (window.removeEventListener) {
    window.removeEventListener('unload', goog.silverlight.__cleanup, false);
  } else {
    window.detachEvent('onunload', goog.silverlight.__cleanup);
  }
};


/**
 * Generates named event handlers for delegates.
 *
 * Attaches them to the global window with the name __closure_slEvent +
 * a unique id.
 *
 * @param {Function|string} handler A function to export.
 * @return {?string} The name of the handler.
 */
goog.silverlight.getHandlerName = function(handler) {
  var handlerName = '';
  if (typeof handler == 'string') {
    handlerName = handler;
  } else if (typeof handler == 'function') {
    if (goog.silverlight._silverlightCount == 0) {
      if (window.addEventListener) {
        window.addEventListener('unload', goog.silverlight.__cleanup, false);
      } else {
        window.attachEvent('onunload', goog.silverlight.__cleanup);
      }
    }
    var count = goog.silverlight._silverlightCount++;
    handlerName = '__closure_slEvent' + count;

    goog.global[handlerName] = handler;
  } else {
    handlerName = null;
  }
  return handlerName;
};


/**
 * Frees a handler created by getHandlerName.
 * @param {string} handlerName A handler name.
 */
goog.silverlight.disposeHandlerName = function(handlerName) {
  delete goog.global[handlerName];
};


/**
 * Called by version  verification control to notify the page that
 * an appropriate build of Silverlight is available. The page
 * should respond by injecting the appropriate Silverlight control
 */
goog.silverlight.onRequiredVersionAvailable = function() {

};


/**
 * Called by version verification control to notify the page that
 * an appropriate build of Silverlight is installed but not loaded.
 * The page should respond by injecting a clear and visible
 * "Thanks for installing. Please restart your browser and return
 * to mysite.com" or equivalent into the browser DOM
 */
goog.silverlight.onRestartRequired = function() {

};


/**
 * Called by version verification control to notify the page that
 * Silverlight must be upgraded. The page should respond by
 * injecting a clear, visible, and actionable upgrade message into
 * the DOM. The message must inform the user that they need to
 * upgrade Silverlight to use the page. They are already somewhat
 * familiar with the Silverlight product when they encounter this.
 * Silverlight should be mentioned so the user expects to see that
 * string in the installer UI. However, the Silverlight-powered
 * application should be the focus of the solicitation. The user
 * wants the app. Silverlight is a means to the app.
 *
 * The upgrade solicitation will have a button that directs
 * the user to the Silverlight installer. Upon click the button
 * should both kick off a download of the installer URL and replace
 * the Upgrade text with "Thanks for downloading. When the upgarde
 * is complete please restart your browser and return to
 * mysite.com" or equivalent.
 *
 * Note: For a more interesting upgrade UX we can use Silverlight
 * 1.0-style XAML for this upgrade experience. Contact PiotrP for
 * details.
 */
goog.silverlight.onUpgradeRequired = function() {

};


/**
 * Called by goog.silverlight.checkInstallStatus to notify the page
 * that Silverlight has not been installed by this user.
 * The page should respond by
 * injecting a clear, visible, and actionable upgrade message into
 * the DOM. The message must inform the user that they need to
 * download and install components needed to use the page.
 * Silverlight should be mentioned so the user expects to see that
 * string in the installer UI. However, the Silverlight-powered
 * application should be the focus of the solicitation. The user
 * wants the app. Silverlight is a means to the app.
 *
 * The installation solicitation will have a button that directs
 * the user to the Silverlight installer. Upon click the button
 * should both kick off a download of the installer URL and replace
 * the Upgrade text with "Thanks for downloading. When installation
 * is complete you may need to refresh the page to view this
 * content" or equivalent.
 */
goog.silverlight.onInstallRequired = function() {

};


/**
 * This function should be called at the beginning of a web page's
 * Silverlight error handler. It will determine if the required
 * version of Silverlight is installed and available in the
 * current process.
 *
 * During its execution the function will trigger one of the
 * Silverlight installation state events, if appropriate.
 *
 * Sender and Args should be passed through from  the calling
 * onError handler's parameters.
 *
 * The associated Sivlerlight <object> tag must have
 * minRuntimeVersion set and should have autoUpgrade set to false.
 *
 * @param {SilverlightDependencyObject} sender The sender.
 * @param {SilverlightErrorEventArgs} args The event arguments.
 * @return {boolean} Is the version available?
 */
goog.silverlight.isVersionAvailableOnError = function(sender, args) {
  var retVal = false;
  try {
    if (args.errorCode == 8001 && !goog.silverlight.__installationEventFired) {
      goog.silverlight.onUpgradeRequired();
      goog.silverlight.__installationEventFired = true;
    } else if (args.errorCode == 8002 &&
               !goog.silverlight.__installationEventFired) {
      goog.silverlight.onRestartRequired();
      goog.silverlight.__installationEventFired = true;
    }
    // this handles upgrades from 1.0. That control did not
    // understand the minRuntimeVerison parameter. It also
    // did not know how to parse XAP files, so would throw
    // Parse Error (5014). A Beta 2 control may throw 2106
    else if (args.errorCode == 5014 || args.errorCode == 2106) {
      if (goog.silverlight.__verifySilverlight2UpgradeSuccess(args.getHost())) {
        retVal = true;
      }
    } else {
      retVal = true;
    }
  } catch (e) {
  }
  return retVal;
};


/**
 * This function should be called at the beginning of a web page's
 * Silverlight onLoad handler. It will determine if the required
 * version of Silverlight is installed and available in the
 * current process.
 *
 * During its execution the function will trigger one of the
 * Silverlight installation state events, if appropriate.
 *
 * Sender should be passed through from the calling
 * onError handler's parameters.
 *
 * The associated Sivlerlight <object> tag must have
 * minRuntimeVersion set and should have autoUpgrade set to false.
 *
 * @param {SilverlightDependencyObject} sender The dep object.
 * @return {boolean} Is the version available?
 */
goog.silverlight.isVersionAvailableOnLoad = function(sender) {
  var retVal = false;
  try {
    if (goog.silverlight.__verifySilverlight2UpgradeSuccess(sender.getHost())) {
      retVal = true;
    }
  } catch (e) {
  }
  return retVal;
};


/**
 * This internal function helps identify installation state by
 * taking advantage of behavioral differences between the
 * 1.0 and 2.0 releases of goog.silverlight.
 * @param {SilverlightPlugin} host The dep object.
 * @return {boolean} If verification succeeded.
 */
goog.silverlight.__verifySilverlight2UpgradeSuccess = function(host) {
  var retVal = false;
  var version = '4.0.50401';
  var installationEvent = null;

  try {
    if (host.isVersionSupported(version + '.99')) {
      installationEvent = goog.silverlight.onRequiredVersionAvailable;
      retVal = true;
    } else if (host.isVersionSupported(version + '.0')) {
      installationEvent = goog.silverlight.onRestartRequired;
    } else {
      installationEvent = goog.silverlight.onUpgradeRequired;
    }

    if (installationEvent && !goog.silverlight.__installationEventFired) {
      installationEvent();
      goog.silverlight.__installationEventFired = true;
    }
  } catch (e) {
  }
  return retVal;
};
