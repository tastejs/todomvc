/**
 * @license
 * Portions of this code are from Silverlight.supportedUserAgent.js
 * under the Ms-PL license.
 *
 * Silverlight.supportedUserAgent.js    version 4.0.50401.0
 *
 * This file is provided by Microsoft as a helper file for websites that
 * incorporate Silverlight Objects. This file is provided under the Microsoft
 * Public License available at
 * http://code.msdn.microsoft.com/SLsupportedUA/Project/License.aspx.
 * You may not use or distribute this file or the code in this file except as
 * expressly permitted under that license.
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 */

/**
 * @fileoverview Modified version of Silverlight.supportedUserAgent.js
 * to work with the compiler's advanced modes. The API should be the same,
 * except that they're namespaced under goog.silverlight
 * instead of Silverlight.
 *
 * @author nicksantos@google.com (Nick Santos) (ported to Closure)
 */

goog.provide('goog.silverlight.supportedUserAgent');


/**
 * NOTE: This function is strongly tied to current implementations of web
 * browsers. The implementation of this function will change over time to
 * account for new Web browser developments. Visit
 * http://code.msdn.microsoft.com/SLsupportedUA often to ensure that you have
 * the latest version.
 *
 * Determines if the client browser is supported by Silverlight.
 *
 * @param {string} version
 *         determines if a particular version of Silverlight supports
 *         this browser. Acceptable values are "1.0" and "2.0".
 * @param {string=} userAgent
 *         optional. User Agent string to be analized. If null then the
 *         current browsers user agent string will be used.
 *
 * @return {boolean} Whether the user agent is supported.
 */
goog.silverlight.supportedUserAgent = function(version, userAgent) {
  try {
    var ua = null;

    if (userAgent) {
      ua = userAgent;
    } else {
      ua = window.navigator.userAgent;
    }

    var slua = {OS: 'Unsupported', Browser: 'Unsupported'};

    //Silverlight does not support pre-Windows NT platforms
    if (ua.indexOf('Windows NT') >= 0 ||
        ua.indexOf('Mozilla/4.0 (compatible; MSIE 6.0)') >= 0) {
      slua.OS = 'Windows';
    } else if (ua.indexOf('PPC Mac OS X') >= 0) {
      slua.OS = 'MacPPC';
    } else if (ua.indexOf('Intel Mac OS X') >= 0) {
      slua.OS = 'MacIntel';
    } else if (ua.indexOf('Linux') >= 0) {
      slua.OS = 'Linux';
    }

    if (slua.OS != 'Unsupported') {
      if (ua.indexOf('MSIE') >= 0) {
        if (navigator.userAgent.indexOf('Win64') == -1) {
          if (parseInt(ua.split('MSIE')[1], 10) >= 6) {
            slua.Browser = 'MSIE';
          }
        }
      } else if (ua.indexOf('Firefox') >= 0) {
        var versionArr = ua.split('Firefox/')[1].split('.');
        var major = parseInt(versionArr[0], 10);
        if (major >= 2) {
          slua.Browser = 'Firefox';
        } else {
          var minor = parseInt(versionArr[1], 10);
          if ((major == 1) && (minor >= 5)) {
            slua.Browser = 'Firefox';
          }
        }
      } else if (ua.indexOf('Chrome') >= 0) {
        slua.Browser = 'Chrome';
      } else if (ua.indexOf('Safari') >= 0) {
        slua.Browser = 'Safari';
      }
    }

    var sl_version = parseInt(version, 10);

    // detect all unsupported platform combinations (IE on Mac, Safari on Win)
    var supUA = (!(// Unsupported OS
                   slua.OS == 'Unsupported' ||
                   // Unsupported Browser
                   slua.Browser == 'Unsupported' ||
                   // Safari is not supported on Windows
                   (slua.OS == 'Windows' && slua.Browser == 'Safari') ||
                   // IE is not supported on Mac
                   (slua.OS.indexOf('Mac') >= 0 && slua.Browser == 'MSIE') ||
                   // Google Chrome is not supported on Mac
                   (slua.OS.indexOf('Mac') >= 0 && slua.Browser == 'Chrome')));

    // Detection of specific platform/versions

    // Google Chrome only on Windows and only in SL4+
    if ((slua.OS.indexOf('Windows') >= 0 &&
         slua.Browser == 'Chrome' && sl_version < 4)) {
      return false;
    }

    // detect unsupported MacPPC platforms (basically anything but 1.0)
    if ((slua.OS == 'MacPPC') && (sl_version > 1)) {
      return ((supUA && (slua.OS != 'MacPPC')));
    }

    // detect unsupported Linux platforms per Moonlight
    if ((slua.OS == 'Linux') && (sl_version > 2)) {
      return ((supUA && (slua.OS != 'Linux')));
    }

    // detect other unsupported 1.0 platforms (win2k)
    if (version == '1.0') {
      return (supUA && (ua.indexOf('Windows NT 5.0') < 0));
    } else {
      return (supUA);
    }
  } catch (e) {
    return false;
  }
};
