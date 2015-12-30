/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/library','./SearchProvider','jquery.sap.encoder'],function(q,l,S){"use strict";var O=S.extend("sap.ui.core.search.OpenSearchProvider",{metadata:{library:"sap.ui.core",properties:{suggestUrl:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},suggestType:{type:"string",group:"Misc",defaultValue:'json'}}}});O.prototype.suggest=function(v,c){var u=this.getSuggestUrl();if(!u){return;}u=u.replace("{searchTerms}",q.sap.encodeURL(v));var t=this.getSuggestType();var s;if(t&&t.toLowerCase()==="xml"){t="xml";s=function(d){var x=q(d);var i=x.find("Text");var a=[];i.each(function(){a.push(q(this).text());});c(v,a);};}else{t="json";s=function(d){c(v,d[1]);};}q.ajax({url:u,dataType:t,success:s,error:function(X,a,e){q.sap.log.fatal("The following problem occurred: "+a,X.responseText+","+X.status);}});};return O;});
