/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Matcher'],function(M){return M.extend("sap.ui.test.matchers.BindingPath",{metadata:{publicMethods:["isMatching"],properties:{path:{type:"string"},modelName:{type:"string"}}},isMatching:function(c){var b;if(!this.getPath()){jQuery.sap.log.error(this,"matchers.BindingPath: the path needs to be a not empty string");return false;}if(this.getModelName()){b=c.getBindingContext(this.getModelName());}else{b=c.getBindingContext();}if(!b){return false;}return this.getPath()===b.getPath();}});},true);
