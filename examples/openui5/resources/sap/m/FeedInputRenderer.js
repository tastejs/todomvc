/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var F={};F.render=function(r,c){var m=c.getId();r.write("<div");r.writeControlData(c);r.addClass("sapMFeedIn");if(!c.getShowIcon()){r.addClass("sapMFeedInNoIcon");}r.writeClasses();r.write(">");if(!!c.getShowIcon()){this._addImage(r,c,m);}r.write('<div id="'+m+'-container"');r.addClass("sapMFeedInContainer");r.writeClasses();r.write(">");var t=c._getTextArea();r.renderControl(t);r.renderControl(c._getPostButton());r.write("</div>");r.write("</div>");};F._addImage=function(r,c,m){r.write('<figure id="'+m+'-figure" class ="sapMFeedInFigure');if(!!c.getIcon()){r.write('">');}else{r.write(' sapMFeedListItemIsDefaultIcon">');}r.renderControl(c._getImageControl());r.write('</figure>');};return F;},true);
