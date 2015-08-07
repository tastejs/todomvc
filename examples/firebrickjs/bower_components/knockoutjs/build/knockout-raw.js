var DEBUG = true,
    // ensure these variables are defined (even if their values are undefined)
    jQueryInstance = window.jQuery, // Use a different variable name (not 'jQuery') to avoid overwriting window.jQuery with 'undefined' on IE < 9
    require = window.require;

// This script adds <script> tags referencing each of the knockout.js source files in the correct order
// It uses JSONP to fetch the list of source files from source-references.js
(function () {
    var debugFileName = "build/knockout-raw.js";
    var sourcesReferenceFile = "build/fragments/source-references.js";

    function getPathToScriptTagSrc(scriptTagSrc) {
        scriptTagSrc = "/" + scriptTagSrc.toLowerCase();
        var scriptTags = document.getElementsByTagName("SCRIPT");
        for (var i = 0; i < scriptTags.length; i++) {
            var src = scriptTags[i].src;
            var index = src.toLowerCase().indexOf(scriptTagSrc);
            if ((index >= 0) && index == (src.length - scriptTagSrc.length))
                return src.substring(0, index + 1);
        }
        throw "Cannot find script tag referencing " + scriptTagSrc;
    };

    function referenceScript(url) {
        document.write("<script src='" + url + "' type='text/javascript'></script>");
    };

    var buildFolderPath = getPathToScriptTagSrc(debugFileName);
    window.knockoutDebugCallback = function (scriptUrls) {
        for (var i = 0; i < scriptUrls.length; i++)
            referenceScript(buildFolderPath + scriptUrls[i]);
    };
    referenceScript(buildFolderPath + sourcesReferenceFile);
})();
