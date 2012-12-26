steal(function( steal ) {
    /**
     * cssmin.js
     * Author: Stoyan Stefanov - http://phpied.com/
     * This is a JavaScript port of the CSS minification tool
     * distributed with YUICompressor, itself a port 
     * of the cssmin utility by Isaac Schlueter - http://foohack.com/ 
     * Permission is hereby granted to use the JavaScript version under the same
     * conditions as the YUICompressor (original YUICompressor note below).
     */
 
    /*
    * YUI Compressor
    * Author: Julien Lecomte - http://www.julienlecomte.net/
    * Copyright (c) 2009 Yahoo! Inc. All rights reserved.
    * The copyrights embodied in the content of this file are licensed
    * by Yahoo! Inc. under the BSD (revised) open source license.
    */
    var YAHOO = YAHOO || {};
    YAHOO.compressor = YAHOO.compressor || {};
    YAHOO.compressor.cssmin = function (css, linebreakpos) {

        var startIndex = 0, 
            endIndex = 0,
            i = 0, max = 0,
            preservedTokens = [],
            comments = [],
            token = '',
            totallen = css.length,
            placeholder = '';

        // collect all comment blocks...
        while ((startIndex = css.indexOf("/*", startIndex)) >= 0) {
            endIndex = css.indexOf("*/", startIndex + 2);
            if (endIndex < 0) {
                endIndex = totallen;
            }
            token = css.slice(startIndex + 2, endIndex);
            comments.push(token);
            css = css.slice(0, startIndex + 2) + "___YUICSSMIN_PRESERVE_CANDIDATE_COMMENT_" + (comments.length - 1) + "___" + css.slice(endIndex);
            startIndex += 2;
        }

        // preserve strings so their content doesn't get accidentally minified
        css = css.replace(/("([^\\"]|\\.|\\)*")|('([^\\']|\\.|\\)*')/g, function (match) {
            var i, max, quote = match.substring(0, 1);
        
            match = match.slice(1, -1);
        
            // maybe the string contains a comment-like substring?
            // one, maybe more? put'em back then
            if (match.indexOf("___YUICSSMIN_PRESERVE_CANDIDATE_COMMENT_") >= 0) {
                for (i = 0, max = comments.length; i < max; i = i + 1) {
                    match = match.replace("___YUICSSMIN_PRESERVE_CANDIDATE_COMMENT_" + i + "___", comments[i]);
                }
            }
        
            // minify alpha opacity in filter strings
            match = match.replace(/progid:DXImageTransform\.Microsoft\.Alpha\(Opacity=/gi, "alpha(opacity=");
        
            preservedTokens.push(match);
            return quote + "___YUICSSMIN_PRESERVED_TOKEN_" + (preservedTokens.length - 1) + "___" + quote;
        });

        // strings are safe, now wrestle the comments
        for (i = 0, max = comments.length; i < max; i = i + 1) {
        
            token = comments[i];
            placeholder = "___YUICSSMIN_PRESERVE_CANDIDATE_COMMENT_" + i + "___";
        
            // ! in the first position of the comment means preserve
            // so push to the preserved tokens keeping the !
            if (token.charAt(0) === "!") {
                preservedTokens.push(token);
                css = css.replace(placeholder,  "___YUICSSMIN_PRESERVED_TOKEN_" + (preservedTokens.length - 1) + "___");
                continue;
            }
        
            // \ in the last position looks like hack for Mac/IE5
            // shorten that to /*\*/ and the next one to /**/
            if (token.charAt(token.length - 1) === "\\") {
                preservedTokens.push("\\");
                css = css.replace(placeholder,  "___YUICSSMIN_PRESERVED_TOKEN_" + (preservedTokens.length - 1) + "___");
                i = i + 1; // attn: advancing the loop
                preservedTokens.push("");
                css = css.replace("___YUICSSMIN_PRESERVE_CANDIDATE_COMMENT_" + i + "___",  "___YUICSSMIN_PRESERVED_TOKEN_" + (preservedTokens.length - 1) + "___");            
                continue;
            }

            // keep empty comments after child selectors (IE7 hack)
            // e.g. html >/**/ body
            if (token.length === 0) {
                startIndex = css.indexOf(placeholder);
                if (startIndex > 2) {
                    if (css.charAt(startIndex - 3) === '>') {
                        preservedTokens.push("");
                        css = css.replace(placeholder,  "___YUICSSMIN_PRESERVED_TOKEN_" + (preservedTokens.length - 1) + "___");
                    }
                }
            }
                
            // in all other cases kill the comment
            css = css.replace("/*" + placeholder + "*/", "");
        }


        // Normalize all whitespace strings to single spaces. Easier to work with that way.
        css = css.replace(/\s+/g, " ");

        // Remove the spaces before the things that should not have spaces before them.
        // But, be careful not to turn "p :link {...}" into "p:link{...}"
        // Swap out any pseudo-class colons with the token, and then swap back.
        css = css.replace(/(^|\})(([^\{:])+:)+([^\{]*\{)/g, function (m) {
            return m.replace(":", "___YUICSSMIN_PSEUDOCLASSCOLON___");
        });
        css = css.replace(/\s+([!{};:>+\(\)\],])/g, '$1');
        css = css.replace(/___YUICSSMIN_PSEUDOCLASSCOLON___/g, ":");

        // retain space for special IE6 cases
        css = css.replace(/:first-(line|letter)(\{|,)/g, ":first-$1 $2");
        
        // no space after the end of a preserved comment
        css = css.replace(/\*\/ /g, '*/'); 
    
     
        // If there is a @charset, then only allow one, and push to the top of the file.
        css = css.replace(/^(.*)(@charset "[^"]*";)/gi, '$2$1');
        css = css.replace(/^(\s*@charset [^;]+;\s*)+/gi, '$1');
    
        // Put the space back in some cases, to support stuff like
        // @media screen and (-webkit-min-device-pixel-ratio:0){
        css = css.replace(/\band\(/gi, "and (");
    

        // Remove the spaces after the things that should not have spaces after them.
        css = css.replace(/([!{}:;>+\(\[,])\s+/g, '$1');

        // remove unnecessary semicolons
        css = css.replace(/;+\}/g, "}");

        // Replace 0(px,em,%) with 0.
        css = css.replace(/([\s:])(0)(px|em|%|in|cm|mm|pc|pt|ex)/gi, "$1$2");

        // Replace 0 0 0 0; with 0.
        css = css.replace(/:0 0 0 0(;|\})/g, ":0$1");
        css = css.replace(/:0 0 0(;|\})/g, ":0$1");
        css = css.replace(/:0 0(;|\})/g, ":0$1");

        // Replace background-position:0; with background-position:0 0;
        // same for transform-origin
        css = css.replace(/(background-position|transform-origin|webkit-transform-origin|moz-transform-origin|o-transform-origin|ms-transform-origin):0(;|\})/gi, function(all, prop, tail) {
            return prop.toLowerCase() + ":0 0" + tail;
        });

        // Replace 0.6 to .6, but only when preceded by : or a white-space
        css = css.replace(/(:|\s)0+\.(\d+)/g, "$1.$2");

        // Shorten colors from rgb(51,102,153) to #336699
        // This makes it more likely that it'll get further compressed in the next step.
        css = css.replace(/rgb\s*\(\s*([0-9,\s]+)\s*\)/gi, function () {
            var i, rgbcolors = arguments[1].split(',');
            for (i = 0; i < rgbcolors.length; i = i + 1) {
                rgbcolors[i] = parseInt(rgbcolors[i], 10).toString(16);
                if (rgbcolors[i].length === 1) {
                    rgbcolors[i] = '0' + rgbcolors[i];
                }
            }
            return '#' + rgbcolors.join('');
        });
    

        // Shorten colors from #AABBCC to #ABC. Note that we want to make sure
        // the color is not preceded by either ", " or =. Indeed, the property
        //     filter: chroma(color="#FFFFFF");
        // would become
        //     filter: chroma(color="#FFF");
        // which makes the filter break in IE.
        css = css.replace(/([^"'=\s])(\s*)#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])/gi, function () { 
            var group = arguments;
            if (
                group[3].toLowerCase() === group[4].toLowerCase() &&
                group[5].toLowerCase() === group[6].toLowerCase() &&
                group[7].toLowerCase() === group[8].toLowerCase()
            ) {
                return (group[1] + group[2] + '#' + group[3] + group[5] + group[7]).toLowerCase();
            } else {
                return group[0].toLowerCase();
            }
        });
    
        // border: none -> border:0
        css = css.replace(/(border|border-top|border-right|border-bottom|border-right|outline|background):none(;|\})/gi, function(all, prop, tail) {
            return prop.toLowerCase() + ":0" + tail;
        });
    
        // shorter opacity IE filter
        css = css.replace(/progid:DXImageTransform\.Microsoft\.Alpha\(Opacity=/gi, "alpha(opacity=");

        // Remove empty rules.
        css = css.replace(/[^\};\{\/]+\{\}/g, "");

        if (linebreakpos >= 0) {
            // Some source control tools don't like it when files containing lines longer
            // than, say 8000 characters, are checked in. The linebreak option is used in
            // that case to split long lines after a specific column.
            startIndex = 0; 
            i = 0;
            while (i < css.length) {
                i = i + 1;
                if (css[i - 1] === '}' && i - startIndex > linebreakpos) {
                    css = css.slice(0, i) + '\n' + css.slice(i);
                    startIndex = i;
                }
            }
        }   

        // Replace multiple semi-colons in a row by a single one
        // See SF bug #1980989
        css = css.replace(/;;+/g, ";");

        // restore preserved comments and strings
        for (i = 0, max = preservedTokens.length; i < max; i = i + 1) {
            css = css.replace("___YUICSSMIN_PRESERVED_TOKEN_" + i + "___", preservedTokens[i]);
        }
    
        // Trim the final string (for any leading or trailing white spaces)
        css = css.replace(/^\s+|\s+$/g, "");

        return css;
    };

    steal.build.builders.styles.min = function( css ) {
        //remove comments & minify
        return YAHOO.compressor.cssmin(css);
    }
});
