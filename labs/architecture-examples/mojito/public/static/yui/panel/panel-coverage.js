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
_yuitest_coverage["build/panel/panel.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/panel/panel.js",
    code: []
};
_yuitest_coverage["build/panel/panel.js"].code=["YUI.add('panel', function (Y, NAME) {","","// TODO: Change this description!","/**","Provides a Panel widget, a widget that mimics the functionality of a regular OS","window. Comes with Standard Module support, XY Positioning, Alignment Support,","Stack (z-index) support, modality, auto-focus and auto-hide functionality, and","header/footer button support.","","@module panel","**/","","var getClassName = Y.ClassNameManager.getClassName;","","// TODO: Change this description!","/**","A basic Panel Widget, which can be positioned based on Page XY co-ordinates and","is stackable (z-index support). It also provides alignment and centering support","and uses a standard module format for it's content, with header, body and footer","section support. It can be made modal, and has functionality to hide and focus","on different events. The header and footer sections can be modified to allow for","button support.","","@class Panel","@constructor","@extends Widget","@uses WidgetAutohide","@uses WidgetButtons","@uses WidgetModality","@uses WidgetPosition","@uses WidgetPositionAlign","@uses WidgetPositionConstrain","@uses WidgetStack","@uses WidgetStdMod","@since 3.4.0"," */","Y.Panel = Y.Base.create('panel', Y.Widget, [","    // Other Widget extensions depend on these two.","    Y.WidgetPosition,","    Y.WidgetStdMod,","","    Y.WidgetAutohide,","    Y.WidgetButtons,","    Y.WidgetModality,","    Y.WidgetPositionAlign,","    Y.WidgetPositionConstrain,","    Y.WidgetStack","], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Collection of predefined buttons mapped from name => config.","","    Panel includes a \"close\" button which can be use by name. When the close","    button is in the header (which is the default), it will look like: [x].","","    See `addButton()` for a list of possible configuration values.","","    @example","        // Panel with close button in header.","        var panel = new Y.Panel({","            buttons: ['close']","        });","","        // Panel with close button in footer.","        var otherPanel = new Y.Panel({","            buttons: {","                footer: ['close']","            }","        });","","    @property BUTTONS","    @type Object","    @default {close: {}}","    @since 3.5.0","    **/","    BUTTONS: {","        close: {","            label  : 'Close',","            action : 'hide',","            section: 'header',","","            // Uses `type=\"button\"` so the button's default action can still","            // occur but it won't cause things like a form to submit.","            template  : '<button type=\"button\" />',","            classNames: getClassName('button', 'close')","        }","    }","}, {","    ATTRS: {","        // TODO: API Docs.","        buttons: {","            value: ['close']","        }","    }","});","","","}, '3.7.3', {\"requires\": [\"widget\", \"widget-autohide\", \"widget-buttons\", \"widget-modality\", \"widget-position\", \"widget-position-align\", \"widget-position-constrain\", \"widget-stack\", \"widget-stdmod\"], \"skinnable\": true});"];
_yuitest_coverage["build/panel/panel.js"].lines = {"1":0,"13":0,"37":0};
_yuitest_coverage["build/panel/panel.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["build/panel/panel.js"].coveredLines = 3;
_yuitest_coverage["build/panel/panel.js"].coveredFunctions = 1;
_yuitest_coverline("build/panel/panel.js", 1);
YUI.add('panel', function (Y, NAME) {

// TODO: Change this description!
/**
Provides a Panel widget, a widget that mimics the functionality of a regular OS
window. Comes with Standard Module support, XY Positioning, Alignment Support,
Stack (z-index) support, modality, auto-focus and auto-hide functionality, and
header/footer button support.

@module panel
**/

_yuitest_coverfunc("build/panel/panel.js", "(anonymous 1)", 1);
_yuitest_coverline("build/panel/panel.js", 13);
var getClassName = Y.ClassNameManager.getClassName;

// TODO: Change this description!
/**
A basic Panel Widget, which can be positioned based on Page XY co-ordinates and
is stackable (z-index support). It also provides alignment and centering support
and uses a standard module format for it's content, with header, body and footer
section support. It can be made modal, and has functionality to hide and focus
on different events. The header and footer sections can be modified to allow for
button support.

@class Panel
@constructor
@extends Widget
@uses WidgetAutohide
@uses WidgetButtons
@uses WidgetModality
@uses WidgetPosition
@uses WidgetPositionAlign
@uses WidgetPositionConstrain
@uses WidgetStack
@uses WidgetStdMod
@since 3.4.0
 */
_yuitest_coverline("build/panel/panel.js", 37);
Y.Panel = Y.Base.create('panel', Y.Widget, [
    // Other Widget extensions depend on these two.
    Y.WidgetPosition,
    Y.WidgetStdMod,

    Y.WidgetAutohide,
    Y.WidgetButtons,
    Y.WidgetModality,
    Y.WidgetPositionAlign,
    Y.WidgetPositionConstrain,
    Y.WidgetStack
], {
    // -- Public Properties ----------------------------------------------------

    /**
    Collection of predefined buttons mapped from name => config.

    Panel includes a "close" button which can be use by name. When the close
    button is in the header (which is the default), it will look like: [x].

    See `addButton()` for a list of possible configuration values.

    @example
        // Panel with close button in header.
        var panel = new Y.Panel({
            buttons: ['close']
        });

        // Panel with close button in footer.
        var otherPanel = new Y.Panel({
            buttons: {
                footer: ['close']
            }
        });

    @property BUTTONS
    @type Object
    @default {close: {}}
    @since 3.5.0
    **/
    BUTTONS: {
        close: {
            label  : 'Close',
            action : 'hide',
            section: 'header',

            // Uses `type="button"` so the button's default action can still
            // occur but it won't cause things like a form to submit.
            template  : '<button type="button" />',
            classNames: getClassName('button', 'close')
        }
    }
}, {
    ATTRS: {
        // TODO: API Docs.
        buttons: {
            value: ['close']
        }
    }
});


}, '3.7.3', {"requires": ["widget", "widget-autohide", "widget-buttons", "widget-modality", "widget-position", "widget-position-align", "widget-position-constrain", "widget-stack", "widget-stdmod"], "skinnable": true});
