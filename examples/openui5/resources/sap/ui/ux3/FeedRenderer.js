/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var F={};F.render=function(r,c){var a=r;var f=c;a.write('<DIV');a.writeControlData(f);a.addClass('sapUiFeed');a.writeClasses();a.write('>');a.renderControl(f.oFeeder);a.write('<HEADER class=sapUiFeedTitle ><H4>');var t=f.getTitle();if(!t||t==""){t=f.rb.getText('FEED_TITLE');}a.writeEscaped(t);if(f.oToolsButton){a.renderControl(f.oToolsButton);}a.renderControl(f.oLiveButton);a.write('</H4>');a.write('<DIV class="sapUiFeedToolbar" >');a.renderControl(f.oFilter);a.renderControl(f.oSearchField);a.write('</DIV>');a.write('</HEADER>');a.write('<SECTION>');for(var i=0;i<f.getChunks().length;i++){var C=f.getChunks()[i];a.renderControl(C);}a.write('</SECTION>');a.write('</DIV>');};return F;},true);
