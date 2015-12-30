/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(function(){"use strict";var T=function(){};T.mergeSections=function(s,n){var N=[];for(var i=0;i<s.length;i++){var c=s[i];var C=c.startIndex+c.length;var a=n.startIndex+n.length;if(n.startIndex<=C&&a>=C&&n.startIndex>=c.startIndex){n.startIndex=c.startIndex;n.length=a-c.startIndex;}else if(n.startIndex<=c.startIndex&&a>=c.startIndex&&a<=C){n.length=C-n.startIndex;}else if(n.startIndex>=c.startIndex&&a<=C){n.startIndex=c.startIndex;n.length=c.length;}else if(a<c.startIndex||n.startIndex>C){N.push(c);}}N.push(n);return N;};return T;});
