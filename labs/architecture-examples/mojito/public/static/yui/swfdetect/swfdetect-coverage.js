/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/swfdetect/swfdetect.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/swfdetect/swfdetect.js",
    code: []
};
_yuitest_coverage["build/swfdetect/swfdetect.js"].code=["YUI.add('swfdetect', function (Y, NAME) {","","/**"," * Utility for Flash version detection"," * @module swfdetect"," */","","// Shortcuts and helper methods","var version = 0,","    uA = Y.UA,","    lG = Y.Lang,","    sF = \"ShockwaveFlash\",","    mF, eP, vS, ax6, ax;","","function makeInt(n) {","    return parseInt(n, 10);","}","","function parseFlashVersion (flashVer) {","    if (lG.isNumber(makeInt(flashVer[0]))) {","        uA.flashMajor = flashVer[0];","    }","    ","    if (lG.isNumber(makeInt(flashVer[1]))) {","        uA.flashMinor = flashVer[1];","    }","    ","    if (lG.isNumber(makeInt(flashVer[2]))) {","        uA.flashRev = flashVer[2];","    }","}","","if (uA.gecko || uA.webkit || uA.opera) {","   if ((mF = navigator.mimeTypes['application/x-shockwave-flash'])) {","      if ((eP = mF.enabledPlugin)) {","         vS = eP.description.replace(/\\s[rd]/g, '.').replace(/[A-Za-z\\s]+/g, '').split('.');","         parseFlashVersion(vS);","      }","   }","}","else if(uA.ie) {","    try","    {","        ax6 = new ActiveXObject(sF + \".\" + sF + \".6\");","        ax6.AllowScriptAccess = \"always\";","    }","    catch (e)","    {","        if(ax6 !== null)","        {","            version = 6.0;","        }","    }","    if (version === 0) {","    try","    {","        ax = new ActiveXObject(sF + \".\" + sF);","        vS = ax.GetVariable(\"$version\").replace(/[A-Za-z\\s]+/g, '').split(',');","        parseFlashVersion(vS);","    } catch (e2) {}","    }","}","","/** Create a calendar view to represent a single or multiple","  * month range of dates, rendered as a grid with date and","  * weekday labels.","  * ","  * @class SWFDetect","  * @constructor","  */","","        ","Y.SWFDetect = {","","    /**","     * Returns the version of either the Flash Player plugin (in Mozilla/WebKit/Opera browsers),","     * or the Flash Player ActiveX control (in IE), as a String of the form \"MM.mm.rr\", where","     * MM is the major version, mm is the minor version, and rr is the revision.","     * @method getFlashVersion","     */ ","    ","    getFlashVersion : function () {","        return (String(uA.flashMajor) + \".\" + String(uA.flashMinor) + \".\" + String(uA.flashRev));","    },","","    /**","     * Checks whether the version of the Flash player installed on the user's machine is greater","     * than or equal to the one specified. If it is, this method returns true; it is false otherwise.","     * @method isFlashVersionAtLeast","     * @return {Boolean} Whether the Flash player version is greater than or equal to the one specified.","     * @param flashMajor {int} The Major version of the Flash player to compare against.","     * @param flashMinor {int} The Minor version of the Flash player to compare against.","     * @param flashRev {int} The Revision version of the Flash player to compare against.","     */ ","    isFlashVersionAtLeast : function (flashMajor, flashMinor, flashRev) {","        var uaMajor    = makeInt(uA.flashMajor),","            uaMinor    = makeInt(uA.flashMinor),","            uaRev      = makeInt(uA.flashRev);","            ","        flashMajor = makeInt(flashMajor || 0);","        flashMinor = makeInt(flashMinor || 0);","        flashRev   = makeInt(flashRev || 0);","","        if (flashMajor === uaMajor) {","            if (flashMinor === uaMinor) {","                return flashRev <= uaRev;","            }","            return flashMinor < uaMinor;","        }","        return flashMajor < uaMajor;","    }           ","};","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/swfdetect/swfdetect.js"].lines = {"1":0,"9":0,"15":0,"16":0,"19":0,"20":0,"21":0,"24":0,"25":0,"28":0,"29":0,"33":0,"34":0,"35":0,"36":0,"37":0,"41":0,"42":0,"44":0,"45":0,"49":0,"51":0,"54":0,"55":0,"57":0,"58":0,"59":0,"73":0,"83":0,"96":0,"100":0,"101":0,"102":0,"104":0,"105":0,"106":0,"108":0,"110":0};
_yuitest_coverage["build/swfdetect/swfdetect.js"].functions = {"makeInt:15":0,"parseFlashVersion:19":0,"getFlashVersion:82":0,"isFlashVersionAtLeast:95":0,"(anonymous 1):1":0};
_yuitest_coverage["build/swfdetect/swfdetect.js"].coveredLines = 38;
_yuitest_coverage["build/swfdetect/swfdetect.js"].coveredFunctions = 5;
_yuitest_coverline("build/swfdetect/swfdetect.js", 1);
YUI.add('swfdetect', function (Y, NAME) {

/**
 * Utility for Flash version detection
 * @module swfdetect
 */

// Shortcuts and helper methods
_yuitest_coverfunc("build/swfdetect/swfdetect.js", "(anonymous 1)", 1);
_yuitest_coverline("build/swfdetect/swfdetect.js", 9);
var version = 0,
    uA = Y.UA,
    lG = Y.Lang,
    sF = "ShockwaveFlash",
    mF, eP, vS, ax6, ax;

_yuitest_coverline("build/swfdetect/swfdetect.js", 15);
function makeInt(n) {
    _yuitest_coverfunc("build/swfdetect/swfdetect.js", "makeInt", 15);
_yuitest_coverline("build/swfdetect/swfdetect.js", 16);
return parseInt(n, 10);
}

_yuitest_coverline("build/swfdetect/swfdetect.js", 19);
function parseFlashVersion (flashVer) {
    _yuitest_coverfunc("build/swfdetect/swfdetect.js", "parseFlashVersion", 19);
_yuitest_coverline("build/swfdetect/swfdetect.js", 20);
if (lG.isNumber(makeInt(flashVer[0]))) {
        _yuitest_coverline("build/swfdetect/swfdetect.js", 21);
uA.flashMajor = flashVer[0];
    }
    
    _yuitest_coverline("build/swfdetect/swfdetect.js", 24);
if (lG.isNumber(makeInt(flashVer[1]))) {
        _yuitest_coverline("build/swfdetect/swfdetect.js", 25);
uA.flashMinor = flashVer[1];
    }
    
    _yuitest_coverline("build/swfdetect/swfdetect.js", 28);
if (lG.isNumber(makeInt(flashVer[2]))) {
        _yuitest_coverline("build/swfdetect/swfdetect.js", 29);
uA.flashRev = flashVer[2];
    }
}

_yuitest_coverline("build/swfdetect/swfdetect.js", 33);
if (uA.gecko || uA.webkit || uA.opera) {
   _yuitest_coverline("build/swfdetect/swfdetect.js", 34);
if ((mF = navigator.mimeTypes['application/x-shockwave-flash'])) {
      _yuitest_coverline("build/swfdetect/swfdetect.js", 35);
if ((eP = mF.enabledPlugin)) {
         _yuitest_coverline("build/swfdetect/swfdetect.js", 36);
vS = eP.description.replace(/\s[rd]/g, '.').replace(/[A-Za-z\s]+/g, '').split('.');
         _yuitest_coverline("build/swfdetect/swfdetect.js", 37);
parseFlashVersion(vS);
      }
   }
}
else {_yuitest_coverline("build/swfdetect/swfdetect.js", 41);
if(uA.ie) {
    _yuitest_coverline("build/swfdetect/swfdetect.js", 42);
try
    {
        _yuitest_coverline("build/swfdetect/swfdetect.js", 44);
ax6 = new ActiveXObject(sF + "." + sF + ".6");
        _yuitest_coverline("build/swfdetect/swfdetect.js", 45);
ax6.AllowScriptAccess = "always";
    }
    catch (e)
    {
        _yuitest_coverline("build/swfdetect/swfdetect.js", 49);
if(ax6 !== null)
        {
            _yuitest_coverline("build/swfdetect/swfdetect.js", 51);
version = 6.0;
        }
    }
    _yuitest_coverline("build/swfdetect/swfdetect.js", 54);
if (version === 0) {
    _yuitest_coverline("build/swfdetect/swfdetect.js", 55);
try
    {
        _yuitest_coverline("build/swfdetect/swfdetect.js", 57);
ax = new ActiveXObject(sF + "." + sF);
        _yuitest_coverline("build/swfdetect/swfdetect.js", 58);
vS = ax.GetVariable("$version").replace(/[A-Za-z\s]+/g, '').split(',');
        _yuitest_coverline("build/swfdetect/swfdetect.js", 59);
parseFlashVersion(vS);
    } catch (e2) {}
    }
}}

/** Create a calendar view to represent a single or multiple
  * month range of dates, rendered as a grid with date and
  * weekday labels.
  * 
  * @class SWFDetect
  * @constructor
  */

        
_yuitest_coverline("build/swfdetect/swfdetect.js", 73);
Y.SWFDetect = {

    /**
     * Returns the version of either the Flash Player plugin (in Mozilla/WebKit/Opera browsers),
     * or the Flash Player ActiveX control (in IE), as a String of the form "MM.mm.rr", where
     * MM is the major version, mm is the minor version, and rr is the revision.
     * @method getFlashVersion
     */ 
    
    getFlashVersion : function () {
        _yuitest_coverfunc("build/swfdetect/swfdetect.js", "getFlashVersion", 82);
_yuitest_coverline("build/swfdetect/swfdetect.js", 83);
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
        _yuitest_coverfunc("build/swfdetect/swfdetect.js", "isFlashVersionAtLeast", 95);
_yuitest_coverline("build/swfdetect/swfdetect.js", 96);
var uaMajor    = makeInt(uA.flashMajor),
            uaMinor    = makeInt(uA.flashMinor),
            uaRev      = makeInt(uA.flashRev);
            
        _yuitest_coverline("build/swfdetect/swfdetect.js", 100);
flashMajor = makeInt(flashMajor || 0);
        _yuitest_coverline("build/swfdetect/swfdetect.js", 101);
flashMinor = makeInt(flashMinor || 0);
        _yuitest_coverline("build/swfdetect/swfdetect.js", 102);
flashRev   = makeInt(flashRev || 0);

        _yuitest_coverline("build/swfdetect/swfdetect.js", 104);
if (flashMajor === uaMajor) {
            _yuitest_coverline("build/swfdetect/swfdetect.js", 105);
if (flashMinor === uaMinor) {
                _yuitest_coverline("build/swfdetect/swfdetect.js", 106);
return flashRev <= uaRev;
            }
            _yuitest_coverline("build/swfdetect/swfdetect.js", 108);
return flashMinor < uaMinor;
        }
        _yuitest_coverline("build/swfdetect/swfdetect.js", 110);
return flashMajor < uaMajor;
    }           
};


}, '3.7.3', {"requires": ["yui-base"]});
