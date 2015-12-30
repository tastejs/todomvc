/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(){'use strict';function l(m){console.error(m);}if(window.sap&&window.sap.ui){return;}var p=/sap-ui-xx-support-bootstrap=([^&]*)/.exec(location.search);if(!p||p.length<2){l("Could not load 'sap-ui-core.js'. Please provide a URI-Parameter with the boostrap script. 'sap-ui-xx-support-bootstrap=file.js'");return;}var b=decodeURIComponent(p[1]);if(b.indexOf('/')!==-1){l("Only local (same directory) boostrap script in URI-Parameter is allowed! 'sap-ui-xx-support-bootstrap="+b+"'");return;}var o=document.getElementById("sap-ui-bootstrap");if(!o){l("Could not find existing sap-ui-boostrap script tag!");return;}var n=document.createElement("script");n.setAttribute("id","sap-ui-bootstrap");n.setAttribute("src","../../../../"+b);o.parentNode.replaceChild(n,o);})();
