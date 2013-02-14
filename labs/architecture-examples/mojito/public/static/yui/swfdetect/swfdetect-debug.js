/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('swfdetect', function (Y, NAME) {

/**
 * Utility for Flash version detection
 * @module swfdetect
 */

// Shortcuts and helper methods
var version = 0,
    uA = Y.UA,
    lG = Y.Lang,
    sF = "ShockwaveFlash",
    mF, eP, vS, ax6, ax;

function makeInt(n) {
    return parseInt(n, 10);
}

function parseFlashVersion (flashVer) {
    if (lG.isNumber(makeInt(flashVer[0]))) {
        uA.flashMajor = flashVer[0];
    }
    
    if (lG.isNumber(makeInt(flashVer[1]))) {
        uA.flashMinor = flashVer[1];
    }
    
    if (lG.isNumber(makeInt(flashVer[2]))) {
        uA.flashRev = flashVer[2];
    }
}

if (uA.gecko || uA.webkit || uA.opera) {
   if ((mF = navigator.mimeTypes['application/x-shockwave-flash'])) {
      if ((eP = mF.enabledPlugin)) {
         vS = eP.description.replace(/\s[rd]/g, '.').replace(/[A-Za-z\s]+/g, '').split('.');
         Y.log(vS[0]);
         parseFlashVersion(vS);
      }
   }
}
else if(uA.ie) {
    try
    {
        ax6 = new ActiveXObject(sF + "." + sF + ".6");
        ax6.AllowScriptAccess = "always";
    }
    catch (e)
    {
        if(ax6 !== null)
        {
            version = 6.0;
        }
    }
    if (version === 0) {
    try
    {
        ax = new ActiveXObject(sF + "." + sF);
        vS = ax.GetVariable("$version").replace(/[A-Za-z\s]+/g, '').split(',');
        parseFlashVersion(vS);
    } catch (e2) {}
    }
}

/** Create a calendar view to represent a single or multiple
  * month range of dates, rendered as a grid with date and
  * weekday labels.
  * 
  * @class SWFDetect
  * @constructor
  */

        
Y.SWFDetect = {

    /**
     * Returns the version of either the Flash Player plugin (in Mozilla/WebKit/Opera browsers),
     * or the Flash Player ActiveX control (in IE), as a String of the form "MM.mm.rr", where
     * MM is the major version, mm is the minor version, and rr is the revision.
     * @method getFlashVersion
     */ 
    
    getFlashVersion : function () {
        return (String(uA.flashMajor) + "." + String(uA.flashMinor) + "." + String(uA.flashRev));
    },

    /**
     * Checks whether the version of the Flash player installed on the user's machine is greater
     * than or equal to the one specified. If it is, this method returns true; it is false otherwise.
     * @method isFlashVersionAtLeast
     * @return {Boolean} Whether the Flash player version is greater than or equal to the one specified.
     * @param flashMajor {int} The Major version of the Flash player to compare against.
     * @param flashMinor {int} The Minor version of the Flash player to compare against.
     * @param flashRev {int} The Revision version of the Flash player to compare against.
     */ 
    isFlashVersionAtLeast : function (flashMajor, flashMinor, flashRev) {
        var uaMajor    = makeInt(uA.flashMajor),
            uaMinor    = makeInt(uA.flashMinor),
            uaRev      = makeInt(uA.flashRev);
            
        flashMajor = makeInt(flashMajor || 0);
        flashMinor = makeInt(flashMinor || 0);
        flashRev   = makeInt(flashRev || 0);

        if (flashMajor === uaMajor) {
            if (flashMinor === uaMinor) {
                return flashRev <= uaRev;
            }
            return flashMinor < uaMinor;
        }
        return flashMajor < uaMajor;
    }           
};


}, '3.7.3', {"requires": ["yui-base"]});
