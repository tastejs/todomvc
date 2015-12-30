/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Opa','./Opa5'],function(O,a){"use strict";var o=function(t,e,c,b){var d=O.config;if(!QUnit.config.testTimeout||QUnit.config.testTimeout===30000){QUnit.config.testTimeout=90000;}if(arguments.length===2){c=e;e=null;}var f=function(g){var s=g.async();d.testName=t;O.assert=g;a.assert=g;c.call(this,d.arrangements,d.actions,d.assertions);var p=O.emptyQueue();p.done(function(){O.assert=undefined;a.assert=undefined;s();});p.fail(function(h){QUnit.ok(false,h.errorMessage);O.assert=undefined;a.assert=undefined;s();});};return QUnit.test(t,e,f,b);};window.opaTest=o;return o;});
