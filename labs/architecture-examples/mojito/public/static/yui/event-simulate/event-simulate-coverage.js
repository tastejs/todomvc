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
_yuitest_coverage["build/event-simulate/event-simulate.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-simulate/event-simulate.js",
    code: []
};
_yuitest_coverage["build/event-simulate/event-simulate.js"].code=["YUI.add('event-simulate', function (Y, NAME) {","","(function() {","/**"," * Simulate user interaction by generating native DOM events."," *"," * @module event-simulate"," * @requires event"," */","","//shortcuts","var L   = Y.Lang,","    isFunction  = L.isFunction,","    isString    = L.isString,","    isBoolean   = L.isBoolean,","    isObject    = L.isObject,","    isNumber    = L.isNumber,","","    //mouse events supported","    mouseEvents = {","        click:      1,","        dblclick:   1,","        mouseover:  1,","        mouseout:   1,","        mousedown:  1,","        mouseup:    1,","        mousemove:  1,","        contextmenu:1","    },","","    //key events supported","    keyEvents   = {","        keydown:    1,","        keyup:      1,","        keypress:   1","    },","","    //HTML events supported","    uiEvents  = {","        submit:     1,","        blur:       1,","        change:     1,","        focus:      1,","        resize:     1,","        scroll:     1,","        select:     1","    },","","    //events that bubble by default","    bubbleEvents = {","        scroll:     1,","        resize:     1,","        reset:      1,","        submit:     1,","        change:     1,","        select:     1,","        error:      1,","        abort:      1","    },","    ","    //touch events supported","    touchEvents = {","        touchstart: 1,","        touchmove: 1,","        touchend: 1, ","        touchcancel: 1","    },","    ","    gestureEvents = {","        gesturestart: 1,","        gesturechange: 1,","        gestureend: 1","    };","","//all key, mouse and touch events bubble","Y.mix(bubbleEvents, mouseEvents);","Y.mix(bubbleEvents, keyEvents);","Y.mix(bubbleEvents, touchEvents);","","/*"," * Note: Intentionally not for YUIDoc generation."," * Simulates a key event using the given event information to populate"," * the generated event object. This method does browser-equalizing"," * calculations to account for differences in the DOM and IE event models"," * as well as different browser quirks. Note: keydown causes Safari 2.x to"," * crash."," * @method simulateKeyEvent"," * @private"," * @static"," * @param {HTMLElement} target The target of the given event."," * @param {String} type The type of event to fire. This can be any one of"," *      the following: keyup, keydown, and keypress."," * @param {Boolean} bubbles (Optional) Indicates if the event can be"," *      bubbled up. DOM Level 3 specifies that all key events bubble by"," *      default. The default is true."," * @param {Boolean} cancelable (Optional) Indicates if the event can be"," *      canceled using preventDefault(). DOM Level 3 specifies that all"," *      key events can be cancelled. The default"," *      is true."," * @param {Window} view (Optional) The view containing the target. This is"," *      typically the window object. The default is window."," * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys"," *      is pressed while the event is firing. The default is false."," * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys"," *      is pressed while the event is firing. The default is false."," * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys"," *      is pressed while the event is firing. The default is false."," * @param {Boolean} metaKey (Optional) Indicates if one of the META keys"," *      is pressed while the event is firing. The default is false."," * @param {int} keyCode (Optional) The code for the key that is in use."," *      The default is 0."," * @param {int} charCode (Optional) The Unicode code for the character"," *      associated with the key being used. The default is 0."," */","function simulateKeyEvent(target /*:HTMLElement*/, type /*:String*/,","                             bubbles /*:Boolean*/,  cancelable /*:Boolean*/,","                             view /*:Window*/,","                             ctrlKey /*:Boolean*/,    altKey /*:Boolean*/,","                             shiftKey /*:Boolean*/,   metaKey /*:Boolean*/,","                             keyCode /*:int*/,        charCode /*:int*/) /*:Void*/","{","    //check target","    if (!target){","        Y.error(\"simulateKeyEvent(): Invalid target.\");","    }","","    //check event type","    if (isString(type)){","        type = type.toLowerCase();","        switch(type){","            case \"textevent\": //DOM Level 3","                type = \"keypress\";","                break;","            case \"keyup\":","            case \"keydown\":","            case \"keypress\":","                break;","            default:","                Y.error(\"simulateKeyEvent(): Event type '\" + type + \"' not supported.\");","        }","    } else {","        Y.error(\"simulateKeyEvent(): Event type must be a string.\");","    }","","    //setup default values","    if (!isBoolean(bubbles)){","        bubbles = true; //all key events bubble","    }","    if (!isBoolean(cancelable)){","        cancelable = true; //all key events can be cancelled","    }","    if (!isObject(view)){","        view = Y.config.win; //view is typically window","    }","    if (!isBoolean(ctrlKey)){","        ctrlKey = false;","    }","    if (!isBoolean(altKey)){","        altKey = false;","    }","    if (!isBoolean(shiftKey)){","        shiftKey = false;","    }","    if (!isBoolean(metaKey)){","        metaKey = false;","    }","    if (!isNumber(keyCode)){","        keyCode = 0;","    }","    if (!isNumber(charCode)){","        charCode = 0;","    }","","    //try to create a mouse event","    var customEvent /*:MouseEvent*/ = null;","","    //check for DOM-compliant browsers first","    if (isFunction(Y.config.doc.createEvent)){","","        try {","","            //try to create key event","            customEvent = Y.config.doc.createEvent(\"KeyEvents\");","","            /*","             * Interesting problem: Firefox implemented a non-standard","             * version of initKeyEvent() based on DOM Level 2 specs.","             * Key event was removed from DOM Level 2 and re-introduced","             * in DOM Level 3 with a different interface. Firefox is the","             * only browser with any implementation of Key Events, so for","             * now, assume it's Firefox if the above line doesn't error.","             */","            // @TODO: Decipher between Firefox's implementation and a correct one.","            customEvent.initKeyEvent(type, bubbles, cancelable, view, ctrlKey,","                altKey, shiftKey, metaKey, keyCode, charCode);","","        } catch (ex /*:Error*/){","","            /*","             * If it got here, that means key events aren't officially supported.","             * Safari/WebKit is a real problem now. WebKit 522 won't let you","             * set keyCode, charCode, or other properties if you use a","             * UIEvent, so we first must try to create a generic event. The","             * fun part is that this will throw an error on Safari 2.x. The","             * end result is that we need another try...catch statement just to","             * deal with this mess.","             */","            try {","","                //try to create generic event - will fail in Safari 2.x","                customEvent = Y.config.doc.createEvent(\"Events\");","","            } catch (uierror /*:Error*/){","","                //the above failed, so create a UIEvent for Safari 2.x","                customEvent = Y.config.doc.createEvent(\"UIEvents\");","","            } finally {","","                customEvent.initEvent(type, bubbles, cancelable);","","                //initialize","                customEvent.view = view;","                customEvent.altKey = altKey;","                customEvent.ctrlKey = ctrlKey;","                customEvent.shiftKey = shiftKey;","                customEvent.metaKey = metaKey;","                customEvent.keyCode = keyCode;","                customEvent.charCode = charCode;","","            }","","        }","","        //fire the event","        target.dispatchEvent(customEvent);","","    } else if (isObject(Y.config.doc.createEventObject)){ //IE","","        //create an IE event object","        customEvent = Y.config.doc.createEventObject();","","        //assign available properties","        customEvent.bubbles = bubbles;","        customEvent.cancelable = cancelable;","        customEvent.view = view;","        customEvent.ctrlKey = ctrlKey;","        customEvent.altKey = altKey;","        customEvent.shiftKey = shiftKey;","        customEvent.metaKey = metaKey;","","        /*","         * IE doesn't support charCode explicitly. CharCode should","         * take precedence over any keyCode value for accurate","         * representation.","         */","        customEvent.keyCode = (charCode > 0) ? charCode : keyCode;","","        //fire the event","        target.fireEvent(\"on\" + type, customEvent);","","    } else {","        Y.error(\"simulateKeyEvent(): No event simulation framework present.\");","    }","}","","/*"," * Note: Intentionally not for YUIDoc generation."," * Simulates a mouse event using the given event information to populate"," * the generated event object. This method does browser-equalizing"," * calculations to account for differences in the DOM and IE event models"," * as well as different browser quirks."," * @method simulateMouseEvent"," * @private"," * @static"," * @param {HTMLElement} target The target of the given event."," * @param {String} type The type of event to fire. This can be any one of"," *      the following: click, dblclick, mousedown, mouseup, mouseout,"," *      mouseover, and mousemove."," * @param {Boolean} bubbles (Optional) Indicates if the event can be"," *      bubbled up. DOM Level 2 specifies that all mouse events bubble by"," *      default. The default is true."," * @param {Boolean} cancelable (Optional) Indicates if the event can be"," *      canceled using preventDefault(). DOM Level 2 specifies that all"," *      mouse events except mousemove can be cancelled. The default"," *      is true for all events except mousemove, for which the default"," *      is false."," * @param {Window} view (Optional) The view containing the target. This is"," *      typically the window object. The default is window."," * @param {int} detail (Optional) The number of times the mouse button has"," *      been used. The default value is 1."," * @param {int} screenX (Optional) The x-coordinate on the screen at which"," *      point the event occured. The default is 0."," * @param {int} screenY (Optional) The y-coordinate on the screen at which"," *      point the event occured. The default is 0."," * @param {int} clientX (Optional) The x-coordinate on the client at which"," *      point the event occured. The default is 0."," * @param {int} clientY (Optional) The y-coordinate on the client at which"," *      point the event occured. The default is 0."," * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys"," *      is pressed while the event is firing. The default is false."," * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys"," *      is pressed while the event is firing. The default is false."," * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys"," *      is pressed while the event is firing. The default is false."," * @param {Boolean} metaKey (Optional) Indicates if one of the META keys"," *      is pressed while the event is firing. The default is false."," * @param {int} button (Optional) The button being pressed while the event"," *      is executing. The value should be 0 for the primary mouse button"," *      (typically the left button), 1 for the terciary mouse button"," *      (typically the middle button), and 2 for the secondary mouse button"," *      (typically the right button). The default is 0."," * @param {HTMLElement} relatedTarget (Optional) For mouseout events,"," *      this is the element that the mouse has moved to. For mouseover"," *      events, this is the element that the mouse has moved from. This"," *      argument is ignored for all other events. The default is null."," */","function simulateMouseEvent(target /*:HTMLElement*/, type /*:String*/,","                               bubbles /*:Boolean*/,  cancelable /*:Boolean*/,","                               view /*:Window*/,        detail /*:int*/,","                               screenX /*:int*/,        screenY /*:int*/,","                               clientX /*:int*/,        clientY /*:int*/,","                               ctrlKey /*:Boolean*/,    altKey /*:Boolean*/,","                               shiftKey /*:Boolean*/,   metaKey /*:Boolean*/,","                               button /*:int*/,         relatedTarget /*:HTMLElement*/) /*:Void*/","{","","    //check target","    if (!target){","        Y.error(\"simulateMouseEvent(): Invalid target.\");","    }","","    //check event type","    if (isString(type)){","        type = type.toLowerCase();","","        //make sure it's a supported mouse event","        if (!mouseEvents[type]){","            Y.error(\"simulateMouseEvent(): Event type '\" + type + \"' not supported.\");","        }","    } else {","        Y.error(\"simulateMouseEvent(): Event type must be a string.\");","    }","","    //setup default values","    if (!isBoolean(bubbles)){","        bubbles = true; //all mouse events bubble","    }","    if (!isBoolean(cancelable)){","        cancelable = (type != \"mousemove\"); //mousemove is the only one that can't be cancelled","    }","    if (!isObject(view)){","        view = Y.config.win; //view is typically window","    }","    if (!isNumber(detail)){","        detail = 1;  //number of mouse clicks must be at least one","    }","    if (!isNumber(screenX)){","        screenX = 0;","    }","    if (!isNumber(screenY)){","        screenY = 0;","    }","    if (!isNumber(clientX)){","        clientX = 0;","    }","    if (!isNumber(clientY)){","        clientY = 0;","    }","    if (!isBoolean(ctrlKey)){","        ctrlKey = false;","    }","    if (!isBoolean(altKey)){","        altKey = false;","    }","    if (!isBoolean(shiftKey)){","        shiftKey = false;","    }","    if (!isBoolean(metaKey)){","        metaKey = false;","    }","    if (!isNumber(button)){","        button = 0;","    }","","    relatedTarget = relatedTarget || null;","","    //try to create a mouse event","    var customEvent /*:MouseEvent*/ = null;","","    //check for DOM-compliant browsers first","    if (isFunction(Y.config.doc.createEvent)){","","        customEvent = Y.config.doc.createEvent(\"MouseEvents\");","","        //Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()","        if (customEvent.initMouseEvent){","            customEvent.initMouseEvent(type, bubbles, cancelable, view, detail,","                                 screenX, screenY, clientX, clientY,","                                 ctrlKey, altKey, shiftKey, metaKey,","                                 button, relatedTarget);","        } else { //Safari","","            //the closest thing available in Safari 2.x is UIEvents","            customEvent = Y.config.doc.createEvent(\"UIEvents\");","            customEvent.initEvent(type, bubbles, cancelable);","            customEvent.view = view;","            customEvent.detail = detail;","            customEvent.screenX = screenX;","            customEvent.screenY = screenY;","            customEvent.clientX = clientX;","            customEvent.clientY = clientY;","            customEvent.ctrlKey = ctrlKey;","            customEvent.altKey = altKey;","            customEvent.metaKey = metaKey;","            customEvent.shiftKey = shiftKey;","            customEvent.button = button;","            customEvent.relatedTarget = relatedTarget;","        }","","        /*","         * Check to see if relatedTarget has been assigned. Firefox","         * versions less than 2.0 don't allow it to be assigned via","         * initMouseEvent() and the property is readonly after event","         * creation, so in order to keep YAHOO.util.getRelatedTarget()","         * working, assign to the IE proprietary toElement property","         * for mouseout event and fromElement property for mouseover","         * event.","         */","        if (relatedTarget && !customEvent.relatedTarget){","            if (type == \"mouseout\"){","                customEvent.toElement = relatedTarget;","            } else if (type == \"mouseover\"){","                customEvent.fromElement = relatedTarget;","            }","        }","","        //fire the event","        target.dispatchEvent(customEvent);","","    } else if (isObject(Y.config.doc.createEventObject)){ //IE","","        //create an IE event object","        customEvent = Y.config.doc.createEventObject();","","        //assign available properties","        customEvent.bubbles = bubbles;","        customEvent.cancelable = cancelable;","        customEvent.view = view;","        customEvent.detail = detail;","        customEvent.screenX = screenX;","        customEvent.screenY = screenY;","        customEvent.clientX = clientX;","        customEvent.clientY = clientY;","        customEvent.ctrlKey = ctrlKey;","        customEvent.altKey = altKey;","        customEvent.metaKey = metaKey;","        customEvent.shiftKey = shiftKey;","","        //fix button property for IE's wacky implementation","        switch(button){","            case 0:","                customEvent.button = 1;","                break;","            case 1:","                customEvent.button = 4;","                break;","            case 2:","                //leave as is","                break;","            default:","                customEvent.button = 0;","        }","","        /*","         * Have to use relatedTarget because IE won't allow assignment","         * to toElement or fromElement on generic events. This keeps","         * YAHOO.util.customEvent.getRelatedTarget() functional.","         */","        customEvent.relatedTarget = relatedTarget;","","        //fire the event","        target.fireEvent(\"on\" + type, customEvent);","","    } else {","        Y.error(\"simulateMouseEvent(): No event simulation framework present.\");","    }","}","","/*"," * Note: Intentionally not for YUIDoc generation."," * Simulates a UI event using the given event information to populate"," * the generated event object. This method does browser-equalizing"," * calculations to account for differences in the DOM and IE event models"," * as well as different browser quirks."," * @method simulateHTMLEvent"," * @private"," * @static"," * @param {HTMLElement} target The target of the given event."," * @param {String} type The type of event to fire. This can be any one of"," *      the following: click, dblclick, mousedown, mouseup, mouseout,"," *      mouseover, and mousemove."," * @param {Boolean} bubbles (Optional) Indicates if the event can be"," *      bubbled up. DOM Level 2 specifies that all mouse events bubble by"," *      default. The default is true."," * @param {Boolean} cancelable (Optional) Indicates if the event can be"," *      canceled using preventDefault(). DOM Level 2 specifies that all"," *      mouse events except mousemove can be cancelled. The default"," *      is true for all events except mousemove, for which the default"," *      is false."," * @param {Window} view (Optional) The view containing the target. This is"," *      typically the window object. The default is window."," * @param {int} detail (Optional) The number of times the mouse button has"," *      been used. The default value is 1."," */","function simulateUIEvent(target /*:HTMLElement*/, type /*:String*/,","                               bubbles /*:Boolean*/,  cancelable /*:Boolean*/,","                               view /*:Window*/,        detail /*:int*/) /*:Void*/","{","","    //check target","    if (!target){","        Y.error(\"simulateUIEvent(): Invalid target.\");","    }","","    //check event type","    if (isString(type)){","        type = type.toLowerCase();","","        //make sure it's a supported mouse event","        if (!uiEvents[type]){","            Y.error(\"simulateUIEvent(): Event type '\" + type + \"' not supported.\");","        }","    } else {","        Y.error(\"simulateUIEvent(): Event type must be a string.\");","    }","","    //try to create a mouse event","    var customEvent = null;","","","    //setup default values","    if (!isBoolean(bubbles)){","        bubbles = (type in bubbleEvents);  //not all events bubble","    }","    if (!isBoolean(cancelable)){","        cancelable = (type == \"submit\"); //submit is the only one that can be cancelled","    }","    if (!isObject(view)){","        view = Y.config.win; //view is typically window","    }","    if (!isNumber(detail)){","        detail = 1;  //usually not used but defaulted to this","    }","","    //check for DOM-compliant browsers first","    if (isFunction(Y.config.doc.createEvent)){","","        //just a generic UI Event object is needed","        customEvent = Y.config.doc.createEvent(\"UIEvents\");","        customEvent.initUIEvent(type, bubbles, cancelable, view, detail);","","        //fire the event","        target.dispatchEvent(customEvent);","","    } else if (isObject(Y.config.doc.createEventObject)){ //IE","","        //create an IE event object","        customEvent = Y.config.doc.createEventObject();","","        //assign available properties","        customEvent.bubbles = bubbles;","        customEvent.cancelable = cancelable;","        customEvent.view = view;","        customEvent.detail = detail;","","        //fire the event","        target.fireEvent(\"on\" + type, customEvent);","","    } else {","        Y.error(\"simulateUIEvent(): No event simulation framework present.\");","    }","}","","/*"," * (iOS only) This is for creating native DOM gesture events which only iOS"," * v2.0+ is supporting."," * "," * @method simulateGestureEvent"," * @private"," * @param {HTMLElement} target The target of the given event."," * @param {String} type The type of event to fire. This can be any one of"," *      the following: touchstart, touchmove, touchend, touchcancel."," * @param {Boolean} bubbles (Optional) Indicates if the event can be"," *      bubbled up. DOM Level 2 specifies that all mouse events bubble by"," *      default. The default is true."," * @param {Boolean} cancelable (Optional) Indicates if the event can be"," *      canceled using preventDefault(). DOM Level 2 specifies that all"," *      touch events except touchcancel can be cancelled. The default"," *      is true for all events except touchcancel, for which the default"," *      is false."," * @param {Window} view (Optional) The view containing the target. This is"," *      typically the window object. The default is window."," * @param {int} detail (Optional) Specifies some detail information about "," *      the event depending on the type of event."," * @param {int} screenX (Optional) The x-coordinate on the screen at which"," *      point the event occured. The default is 0."," * @param {int} screenY (Optional) The y-coordinate on the screen at which"," *      point the event occured. The default is 0."," * @param {int} clientX (Optional) The x-coordinate on the client at which"," *      point the event occured. The default is 0."," * @param {int} clientY (Optional) The y-coordinate on the client at which"," *      point the event occured. The default is 0."," * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys"," *      is pressed while the event is firing. The default is false."," * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys"," *      is pressed while the event is firing. The default is false."," * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys"," *      is pressed while the event is firing. The default is false."," * @param {Boolean} metaKey (Optional) Indicates if one of the META keys"," *      is pressed while the event is firing. The default is false. "," * @param {float} scale (iOS v2+ only) The distance between two fingers "," *      since the start of an event as a multiplier of the initial distance. "," *      The default value is 1.0."," * @param {float} rotation (iOS v2+ only) The delta rotation since the start "," *      of an event, in degrees, where clockwise is positive and "," *      counter-clockwise is negative. The default value is 0.0.   "," */","function simulateGestureEvent(target, type,","    bubbles,            // boolean","    cancelable,         // boolean","    view,               // DOMWindow","    detail,             // long","    screenX, screenY,   // long","    clientX, clientY,   // long","    ctrlKey, altKey, shiftKey, metaKey, // boolean","    scale,              // float","    rotation            // float",") {","    var customEvent;","","    if(!Y.UA.ios || Y.UA.ios<2.0) {","        Y.error(\"simulateGestureEvent(): Native gesture DOM eventframe is not available in this platform.\");","    }","","    // check taget    ","    if (!target){","        Y.error(\"simulateGestureEvent(): Invalid target.\");","    }","","    //check event type","    if (Y.Lang.isString(type)) {","        type = type.toLowerCase();","","        //make sure it's a supported touch event","        if (!gestureEvents[type]){","            Y.error(\"simulateTouchEvent(): Event type '\" + type + \"' not supported.\");","        }","    } else {","        Y.error(\"simulateGestureEvent(): Event type must be a string.\");","    }","","    // setup default values","    if (!Y.Lang.isBoolean(bubbles)) { bubbles = true; } // bubble by default","    if (!Y.Lang.isBoolean(cancelable)) { cancelable = true; } ","    if (!Y.Lang.isObject(view))     { view = Y.config.win; }","    if (!Y.Lang.isNumber(detail))   { detail = 2; }     // usually not used.","    if (!Y.Lang.isNumber(screenX))  { screenX = 0; }","    if (!Y.Lang.isNumber(screenY))  { screenY = 0; }","    if (!Y.Lang.isNumber(clientX))  { clientX = 0; }","    if (!Y.Lang.isNumber(clientY))  { clientY = 0; }","    if (!Y.Lang.isBoolean(ctrlKey)) { ctrlKey = false; }","    if (!Y.Lang.isBoolean(altKey))  { altKey = false; }","    if (!Y.Lang.isBoolean(shiftKey)){ shiftKey = false; }","    if (!Y.Lang.isBoolean(metaKey)) { metaKey = false; }","","    if (!Y.Lang.isNumber(scale)){ scale = 1.0; }","    if (!Y.Lang.isNumber(rotation)){ rotation = 0.0; }","","    customEvent = Y.config.doc.createEvent(\"GestureEvent\");","","    customEvent.initGestureEvent(type, bubbles, cancelable, view, detail,","        screenX, screenY, clientX, clientY,","        ctrlKey, altKey, shiftKey, metaKey,","        target, scale, rotation);","","    target.dispatchEvent(customEvent);","}","","","/*"," * @method simulateTouchEvent"," * @private"," * @param {HTMLElement} target The target of the given event."," * @param {String} type The type of event to fire. This can be any one of"," *      the following: touchstart, touchmove, touchend, touchcancel."," * @param {Boolean} bubbles (Optional) Indicates if the event can be"," *      bubbled up. DOM Level 2 specifies that all mouse events bubble by"," *      default. The default is true."," * @param {Boolean} cancelable (Optional) Indicates if the event can be"," *      canceled using preventDefault(). DOM Level 2 specifies that all"," *      touch events except touchcancel can be cancelled. The default"," *      is true for all events except touchcancel, for which the default"," *      is false."," * @param {Window} view (Optional) The view containing the target. This is"," *      typically the window object. The default is window."," * @param {int} detail (Optional) Specifies some detail information about "," *      the event depending on the type of event."," * @param {int} screenX (Optional) The x-coordinate on the screen at which"," *      point the event occured. The default is 0."," * @param {int} screenY (Optional) The y-coordinate on the screen at which"," *      point the event occured. The default is 0."," * @param {int} clientX (Optional) The x-coordinate on the client at which"," *      point the event occured. The default is 0."," * @param {int} clientY (Optional) The y-coordinate on the client at which"," *      point the event occured. The default is 0."," * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys"," *      is pressed while the event is firing. The default is false."," * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys"," *      is pressed while the event is firing. The default is false."," * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys"," *      is pressed while the event is firing. The default is false."," * @param {Boolean} metaKey (Optional) Indicates if one of the META keys"," *      is pressed while the event is firing. The default is false. "," * @param {TouchList} touches A collection of Touch objects representing "," *      all touches associated with this event."," * @param {TouchList} targetTouches A collection of Touch objects "," *      representing all touches associated with this target."," * @param {TouchList} changedTouches A collection of Touch objects "," *      representing all touches that changed in this event."," * @param {float} scale (iOS v2+ only) The distance between two fingers "," *      since the start of an event as a multiplier of the initial distance. "," *      The default value is 1.0."," * @param {float} rotation (iOS v2+ only) The delta rotation since the start "," *      of an event, in degrees, where clockwise is positive and "," *      counter-clockwise is negative. The default value is 0.0.   "," */","function simulateTouchEvent(target, type,","    bubbles,            // boolean","    cancelable,         // boolean","    view,               // DOMWindow","    detail,             // long","    screenX, screenY,   // long","    clientX, clientY,   // long","    ctrlKey, altKey, shiftKey, metaKey, // boolean","    touches,            // TouchList","    targetTouches,      // TouchList","    changedTouches,     // TouchList","    scale,              // float","    rotation            // float",") {","","    var customEvent;","","    // check taget    ","    if (!target){","        Y.error(\"simulateTouchEvent(): Invalid target.\");","    }","","    //check event type","    if (Y.Lang.isString(type)) {","        type = type.toLowerCase();","","        //make sure it's a supported touch event","        if (!touchEvents[type]){","            Y.error(\"simulateTouchEvent(): Event type '\" + type + \"' not supported.\");","        }","    } else {","        Y.error(\"simulateTouchEvent(): Event type must be a string.\");","    }","","    // note that the caller is responsible to pass appropriate touch objects.","    // check touch objects","    // Android(even 4.0) doesn't define TouchList yet","    /*if(type === 'touchstart' || type === 'touchmove') {","        if(!touches instanceof TouchList) {","            Y.error('simulateTouchEvent(): Invalid touches. It must be a TouchList');","        } else {","            if(touches.length === 0) {","                Y.error('simulateTouchEvent(): No touch object found.');","            }","        }","    } else if(type === 'touchend') {","        if(!changedTouches instanceof TouchList) {","            Y.error('simulateTouchEvent(): Invalid touches. It must be a TouchList');","        } else {","            if(changedTouches.length === 0) {","                Y.error('simulateTouchEvent(): No touch object found.');","            }","        }","    }*/","","    if(type === 'touchstart' || type === 'touchmove') {","        if(touches.length === 0) {","            Y.error('simulateTouchEvent(): No touch object in touches');","        }","    } else if(type === 'touchend') {","        if(changedTouches.length === 0) {","            Y.error('simulateTouchEvent(): No touch object in changedTouches');","        }","    }","","    // setup default values","    if (!Y.Lang.isBoolean(bubbles)) { bubbles = true; } // bubble by default.","    if (!Y.Lang.isBoolean(cancelable)) { ","        cancelable = (type != \"touchcancel\"); // touchcancel is not cancelled ","    } ","    if (!Y.Lang.isObject(view))     { view = Y.config.win; }","    if (!Y.Lang.isNumber(detail))   { detail = 1; } // usually not used. defaulted to # of touch objects.","    if (!Y.Lang.isNumber(screenX))  { screenX = 0; }","    if (!Y.Lang.isNumber(screenY))  { screenY = 0; }","    if (!Y.Lang.isNumber(clientX))  { clientX = 0; }","    if (!Y.Lang.isNumber(clientY))  { clientY = 0; }","    if (!Y.Lang.isBoolean(ctrlKey)) { ctrlKey = false; }","    if (!Y.Lang.isBoolean(altKey))  { altKey = false; }","    if (!Y.Lang.isBoolean(shiftKey)){ shiftKey = false; }","    if (!Y.Lang.isBoolean(metaKey)) { metaKey = false; }","    if (!Y.Lang.isNumber(scale))    { scale = 1.0; }","    if (!Y.Lang.isNumber(rotation)) { rotation = 0.0; }","","","    //check for DOM-compliant browsers first","    if (Y.Lang.isFunction(Y.config.doc.createEvent)) {","        if (Y.UA.android) {","            /**","                * Couldn't find android start version that supports touch event. ","                * Assumed supported(btw APIs broken till icecream sandwitch) ","                * from the beginning.","                */","            if(Y.UA.android < 4.0) {","                /**","                    * Touch APIs are broken in androids older than 4.0. We will use ","                    * simulated touch apis for these versions. ","                    * App developer still can listen for touch events. This events","                    * will be dispatched with touch event types.","                    * ","                    * (Note) Used target for the relatedTarget. Need to verify if","                    * it has a side effect.","                    */","                customEvent = Y.config.doc.createEvent(\"MouseEvents\");","                customEvent.initMouseEvent(type, bubbles, cancelable, view, detail, ","                    screenX, screenY, clientX, clientY,","                    ctrlKey, altKey, shiftKey, metaKey,","                    0, target);","","                customEvent.touches = touches;","                customEvent.targetTouches = targetTouches;","                customEvent.changedTouches = changedTouches;","            } else {","                customEvent = Y.config.doc.createEvent(\"TouchEvent\");","","                // Andoroid isn't compliant W3C initTouchEvent method signature.","                customEvent.initTouchEvent(touches, targetTouches, changedTouches,","                    type, view,","                    screenX, screenY, clientX, clientY,","                    ctrlKey, altKey, shiftKey, metaKey);","            }","        } else if (Y.UA.ios) {","            if(Y.UA.ios >= 2.0) {","                customEvent = Y.config.doc.createEvent(\"TouchEvent\");","","                // Available iOS 2.0 and later","                customEvent.initTouchEvent(type, bubbles, cancelable, view, detail,","                    screenX, screenY, clientX, clientY,","                    ctrlKey, altKey, shiftKey, metaKey,","                    touches, targetTouches, changedTouches,","                    scale, rotation);","            } else {","                Y.error('simulateTouchEvent(): No touch event simulation framework present for iOS, '+Y.UA.ios+'.');","            }","        } else {","            Y.error('simulateTouchEvent(): Not supported agent yet, '+Y.UA.userAgent);","        }","","        //fire the event","        target.dispatchEvent(customEvent);","    //} else if (Y.Lang.isObject(doc.createEventObject)){ // Windows Mobile/IE, support later ","    } else {","        Y.error('simulateTouchEvent(): No event simulation framework present.');","    }","}","","/**"," * Simulates the event or gesture with the given name on a target."," * @param {HTMLElement} target The DOM element that's the target of the event."," * @param {String} type The type of event or name of the supported gesture to simulate "," *      (i.e., \"click\", \"doubletap\", \"flick\")."," * @param {Object} options (Optional) Extra options to copy onto the event object. "," *      For gestures, options are used to refine the gesture behavior."," * @return {void}"," * @for Event"," * @method simulate"," * @static"," */","Y.Event.simulate = function(target, type, options){","","    options = options || {};","","    if (mouseEvents[type]){","        simulateMouseEvent(target, type, options.bubbles,","            options.cancelable, options.view, options.detail, options.screenX,","            options.screenY, options.clientX, options.clientY, options.ctrlKey,","            options.altKey, options.shiftKey, options.metaKey, options.button,","            options.relatedTarget);","    } else if (keyEvents[type]){","        simulateKeyEvent(target, type, options.bubbles,","            options.cancelable, options.view, options.ctrlKey,","            options.altKey, options.shiftKey, options.metaKey,","            options.keyCode, options.charCode);","    } else if (uiEvents[type]){","        simulateUIEvent(target, type, options.bubbles,","            options.cancelable, options.view, options.detail);","            ","    // touch low-level event simulation        ","    } else if (touchEvents[type]) {","        if((Y.config.win && (\"ontouchstart\" in Y.config.win)) && !(Y.UA.phantomjs) && !(Y.UA.chrome && Y.UA.chrome < 6)) {","            simulateTouchEvent(target, type, ","                options.bubbles, options.cancelable, options.view, options.detail, ","                options.screenX, options.screenY, options.clientX, options.clientY, ","                options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, ","                options.touches, options.targetTouches, options.changedTouches,","                options.scale, options.rotation);","        } else {","            Y.error(\"simulate(): Event '\" + type + \"' can't be simulated. Use gesture-simulate module instead.\");","        }","","    // ios gesture low-level event simulation (iOS v2+ only)        ","    } else if(Y.UA.ios && Y.UA.ios >= 2.0 && gestureEvents[type]) {","        simulateGestureEvent(target, type, ","            options.bubbles, options.cancelable, options.view, options.detail, ","            options.screenX, options.screenY, options.clientX, options.clientY, ","            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,","            options.scale, options.rotation);","    ","    // anything else","    } else {","        Y.error(\"simulate(): Event '\" + type + \"' can't be simulated.\");","    }","};","","","})();","","","","}, '3.7.3', {\"requires\": [\"event-base\"]});"];
_yuitest_coverage["build/event-simulate/event-simulate.js"].lines = {"1":0,"3":0,"12":0,"76":0,"77":0,"78":0,"115":0,"123":0,"124":0,"128":0,"129":0,"130":0,"132":0,"133":0,"137":0,"139":0,"142":0,"146":0,"147":0,"149":0,"150":0,"152":0,"153":0,"155":0,"156":0,"158":0,"159":0,"161":0,"162":0,"164":0,"165":0,"167":0,"168":0,"170":0,"171":0,"175":0,"178":0,"180":0,"183":0,"194":0,"208":0,"211":0,"216":0,"220":0,"223":0,"224":0,"225":0,"226":0,"227":0,"228":0,"229":0,"236":0,"238":0,"241":0,"244":0,"245":0,"246":0,"247":0,"248":0,"249":0,"250":0,"257":0,"260":0,"263":0,"318":0,"329":0,"330":0,"334":0,"335":0,"338":0,"339":0,"342":0,"346":0,"347":0,"349":0,"350":0,"352":0,"353":0,"355":0,"356":0,"358":0,"359":0,"361":0,"362":0,"364":0,"365":0,"367":0,"368":0,"370":0,"371":0,"373":0,"374":0,"376":0,"377":0,"379":0,"380":0,"382":0,"383":0,"386":0,"389":0,"392":0,"394":0,"397":0,"398":0,"405":0,"406":0,"407":0,"408":0,"409":0,"410":0,"411":0,"412":0,"413":0,"414":0,"415":0,"416":0,"417":0,"418":0,"430":0,"431":0,"432":0,"433":0,"434":0,"439":0,"441":0,"444":0,"447":0,"448":0,"449":0,"450":0,"451":0,"452":0,"453":0,"454":0,"455":0,"456":0,"457":0,"458":0,"461":0,"463":0,"464":0,"466":0,"467":0,"470":0,"472":0,"480":0,"483":0,"486":0,"516":0,"522":0,"523":0,"527":0,"528":0,"531":0,"532":0,"535":0,"539":0,"543":0,"544":0,"546":0,"547":0,"549":0,"550":0,"552":0,"553":0,"557":0,"560":0,"561":0,"564":0,"566":0,"569":0,"572":0,"573":0,"574":0,"575":0,"578":0,"581":0,"629":0,"640":0,"642":0,"643":0,"647":0,"648":0,"652":0,"653":0,"656":0,"657":0,"660":0,"664":0,"665":0,"666":0,"667":0,"668":0,"669":0,"670":0,"671":0,"672":0,"673":0,"674":0,"675":0,"677":0,"678":0,"680":0,"682":0,"687":0,"738":0,"753":0,"756":0,"757":0,"761":0,"762":0,"765":0,"766":0,"769":0,"793":0,"794":0,"795":0,"797":0,"798":0,"799":0,"804":0,"805":0,"806":0,"808":0,"809":0,"810":0,"811":0,"812":0,"813":0,"814":0,"815":0,"816":0,"817":0,"818":0,"819":0,"823":0,"824":0,"830":0,"840":0,"841":0,"846":0,"847":0,"848":0,"850":0,"853":0,"858":0,"859":0,"860":0,"863":0,"869":0,"872":0,"876":0,"879":0,"895":0,"897":0,"899":0,"900":0,"905":0,"906":0,"910":0,"911":0,"915":0,"916":0,"917":0,"924":0,"928":0,"929":0,"937":0};
_yuitest_coverage["build/event-simulate/event-simulate.js"].functions = {"simulateKeyEvent:115":0,"simulateMouseEvent:318":0,"simulateUIEvent:516":0,"simulateGestureEvent:629":0,"simulateTouchEvent:738":0,"simulate:895":0,"(anonymous 2):3":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-simulate/event-simulate.js"].coveredLines = 268;
_yuitest_coverage["build/event-simulate/event-simulate.js"].coveredFunctions = 8;
_yuitest_coverline("build/event-simulate/event-simulate.js", 1);
YUI.add('event-simulate', function (Y, NAME) {

_yuitest_coverfunc("build/event-simulate/event-simulate.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-simulate/event-simulate.js", 3);
(function() {
/**
 * Simulate user interaction by generating native DOM events.
 *
 * @module event-simulate
 * @requires event
 */

//shortcuts
_yuitest_coverfunc("build/event-simulate/event-simulate.js", "(anonymous 2)", 3);
_yuitest_coverline("build/event-simulate/event-simulate.js", 12);
var L   = Y.Lang,
    isFunction  = L.isFunction,
    isString    = L.isString,
    isBoolean   = L.isBoolean,
    isObject    = L.isObject,
    isNumber    = L.isNumber,

    //mouse events supported
    mouseEvents = {
        click:      1,
        dblclick:   1,
        mouseover:  1,
        mouseout:   1,
        mousedown:  1,
        mouseup:    1,
        mousemove:  1,
        contextmenu:1
    },

    //key events supported
    keyEvents   = {
        keydown:    1,
        keyup:      1,
        keypress:   1
    },

    //HTML events supported
    uiEvents  = {
        submit:     1,
        blur:       1,
        change:     1,
        focus:      1,
        resize:     1,
        scroll:     1,
        select:     1
    },

    //events that bubble by default
    bubbleEvents = {
        scroll:     1,
        resize:     1,
        reset:      1,
        submit:     1,
        change:     1,
        select:     1,
        error:      1,
        abort:      1
    },
    
    //touch events supported
    touchEvents = {
        touchstart: 1,
        touchmove: 1,
        touchend: 1, 
        touchcancel: 1
    },
    
    gestureEvents = {
        gesturestart: 1,
        gesturechange: 1,
        gestureend: 1
    };

//all key, mouse and touch events bubble
_yuitest_coverline("build/event-simulate/event-simulate.js", 76);
Y.mix(bubbleEvents, mouseEvents);
_yuitest_coverline("build/event-simulate/event-simulate.js", 77);
Y.mix(bubbleEvents, keyEvents);
_yuitest_coverline("build/event-simulate/event-simulate.js", 78);
Y.mix(bubbleEvents, touchEvents);

/*
 * Note: Intentionally not for YUIDoc generation.
 * Simulates a key event using the given event information to populate
 * the generated event object. This method does browser-equalizing
 * calculations to account for differences in the DOM and IE event models
 * as well as different browser quirks. Note: keydown causes Safari 2.x to
 * crash.
 * @method simulateKeyEvent
 * @private
 * @static
 * @param {HTMLElement} target The target of the given event.
 * @param {String} type The type of event to fire. This can be any one of
 *      the following: keyup, keydown, and keypress.
 * @param {Boolean} bubbles (Optional) Indicates if the event can be
 *      bubbled up. DOM Level 3 specifies that all key events bubble by
 *      default. The default is true.
 * @param {Boolean} cancelable (Optional) Indicates if the event can be
 *      canceled using preventDefault(). DOM Level 3 specifies that all
 *      key events can be cancelled. The default
 *      is true.
 * @param {Window} view (Optional) The view containing the target. This is
 *      typically the window object. The default is window.
 * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
 *      is pressed while the event is firing. The default is false.
 * @param {int} keyCode (Optional) The code for the key that is in use.
 *      The default is 0.
 * @param {int} charCode (Optional) The Unicode code for the character
 *      associated with the key being used. The default is 0.
 */
_yuitest_coverline("build/event-simulate/event-simulate.js", 115);
function simulateKeyEvent(target /*:HTMLElement*/, type /*:String*/,
                             bubbles /*:Boolean*/,  cancelable /*:Boolean*/,
                             view /*:Window*/,
                             ctrlKey /*:Boolean*/,    altKey /*:Boolean*/,
                             shiftKey /*:Boolean*/,   metaKey /*:Boolean*/,
                             keyCode /*:int*/,        charCode /*:int*/) /*:Void*/
{
    //check target
    _yuitest_coverfunc("build/event-simulate/event-simulate.js", "simulateKeyEvent", 115);
_yuitest_coverline("build/event-simulate/event-simulate.js", 123);
if (!target){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 124);
Y.error("simulateKeyEvent(): Invalid target.");
    }

    //check event type
    _yuitest_coverline("build/event-simulate/event-simulate.js", 128);
if (isString(type)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 129);
type = type.toLowerCase();
        _yuitest_coverline("build/event-simulate/event-simulate.js", 130);
switch(type){
            case "textevent": //DOM Level 3
                _yuitest_coverline("build/event-simulate/event-simulate.js", 132);
type = "keypress";
                _yuitest_coverline("build/event-simulate/event-simulate.js", 133);
break;
            case "keyup":
            case "keydown":
            case "keypress":
                _yuitest_coverline("build/event-simulate/event-simulate.js", 137);
break;
            default:
                _yuitest_coverline("build/event-simulate/event-simulate.js", 139);
Y.error("simulateKeyEvent(): Event type '" + type + "' not supported.");
        }
    } else {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 142);
Y.error("simulateKeyEvent(): Event type must be a string.");
    }

    //setup default values
    _yuitest_coverline("build/event-simulate/event-simulate.js", 146);
if (!isBoolean(bubbles)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 147);
bubbles = true; //all key events bubble
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 149);
if (!isBoolean(cancelable)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 150);
cancelable = true; //all key events can be cancelled
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 152);
if (!isObject(view)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 153);
view = Y.config.win; //view is typically window
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 155);
if (!isBoolean(ctrlKey)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 156);
ctrlKey = false;
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 158);
if (!isBoolean(altKey)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 159);
altKey = false;
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 161);
if (!isBoolean(shiftKey)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 162);
shiftKey = false;
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 164);
if (!isBoolean(metaKey)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 165);
metaKey = false;
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 167);
if (!isNumber(keyCode)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 168);
keyCode = 0;
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 170);
if (!isNumber(charCode)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 171);
charCode = 0;
    }

    //try to create a mouse event
    _yuitest_coverline("build/event-simulate/event-simulate.js", 175);
var customEvent /*:MouseEvent*/ = null;

    //check for DOM-compliant browsers first
    _yuitest_coverline("build/event-simulate/event-simulate.js", 178);
if (isFunction(Y.config.doc.createEvent)){

        _yuitest_coverline("build/event-simulate/event-simulate.js", 180);
try {

            //try to create key event
            _yuitest_coverline("build/event-simulate/event-simulate.js", 183);
customEvent = Y.config.doc.createEvent("KeyEvents");

            /*
             * Interesting problem: Firefox implemented a non-standard
             * version of initKeyEvent() based on DOM Level 2 specs.
             * Key event was removed from DOM Level 2 and re-introduced
             * in DOM Level 3 with a different interface. Firefox is the
             * only browser with any implementation of Key Events, so for
             * now, assume it's Firefox if the above line doesn't error.
             */
            // @TODO: Decipher between Firefox's implementation and a correct one.
            _yuitest_coverline("build/event-simulate/event-simulate.js", 194);
customEvent.initKeyEvent(type, bubbles, cancelable, view, ctrlKey,
                altKey, shiftKey, metaKey, keyCode, charCode);

        } catch (ex /*:Error*/){

            /*
             * If it got here, that means key events aren't officially supported.
             * Safari/WebKit is a real problem now. WebKit 522 won't let you
             * set keyCode, charCode, or other properties if you use a
             * UIEvent, so we first must try to create a generic event. The
             * fun part is that this will throw an error on Safari 2.x. The
             * end result is that we need another try...catch statement just to
             * deal with this mess.
             */
            _yuitest_coverline("build/event-simulate/event-simulate.js", 208);
try {

                //try to create generic event - will fail in Safari 2.x
                _yuitest_coverline("build/event-simulate/event-simulate.js", 211);
customEvent = Y.config.doc.createEvent("Events");

            } catch (uierror /*:Error*/){

                //the above failed, so create a UIEvent for Safari 2.x
                _yuitest_coverline("build/event-simulate/event-simulate.js", 216);
customEvent = Y.config.doc.createEvent("UIEvents");

            } finally {

                _yuitest_coverline("build/event-simulate/event-simulate.js", 220);
customEvent.initEvent(type, bubbles, cancelable);

                //initialize
                _yuitest_coverline("build/event-simulate/event-simulate.js", 223);
customEvent.view = view;
                _yuitest_coverline("build/event-simulate/event-simulate.js", 224);
customEvent.altKey = altKey;
                _yuitest_coverline("build/event-simulate/event-simulate.js", 225);
customEvent.ctrlKey = ctrlKey;
                _yuitest_coverline("build/event-simulate/event-simulate.js", 226);
customEvent.shiftKey = shiftKey;
                _yuitest_coverline("build/event-simulate/event-simulate.js", 227);
customEvent.metaKey = metaKey;
                _yuitest_coverline("build/event-simulate/event-simulate.js", 228);
customEvent.keyCode = keyCode;
                _yuitest_coverline("build/event-simulate/event-simulate.js", 229);
customEvent.charCode = charCode;

            }

        }

        //fire the event
        _yuitest_coverline("build/event-simulate/event-simulate.js", 236);
target.dispatchEvent(customEvent);

    } else {_yuitest_coverline("build/event-simulate/event-simulate.js", 238);
if (isObject(Y.config.doc.createEventObject)){ //IE

        //create an IE event object
        _yuitest_coverline("build/event-simulate/event-simulate.js", 241);
customEvent = Y.config.doc.createEventObject();

        //assign available properties
        _yuitest_coverline("build/event-simulate/event-simulate.js", 244);
customEvent.bubbles = bubbles;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 245);
customEvent.cancelable = cancelable;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 246);
customEvent.view = view;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 247);
customEvent.ctrlKey = ctrlKey;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 248);
customEvent.altKey = altKey;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 249);
customEvent.shiftKey = shiftKey;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 250);
customEvent.metaKey = metaKey;

        /*
         * IE doesn't support charCode explicitly. CharCode should
         * take precedence over any keyCode value for accurate
         * representation.
         */
        _yuitest_coverline("build/event-simulate/event-simulate.js", 257);
customEvent.keyCode = (charCode > 0) ? charCode : keyCode;

        //fire the event
        _yuitest_coverline("build/event-simulate/event-simulate.js", 260);
target.fireEvent("on" + type, customEvent);

    } else {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 263);
Y.error("simulateKeyEvent(): No event simulation framework present.");
    }}
}

/*
 * Note: Intentionally not for YUIDoc generation.
 * Simulates a mouse event using the given event information to populate
 * the generated event object. This method does browser-equalizing
 * calculations to account for differences in the DOM and IE event models
 * as well as different browser quirks.
 * @method simulateMouseEvent
 * @private
 * @static
 * @param {HTMLElement} target The target of the given event.
 * @param {String} type The type of event to fire. This can be any one of
 *      the following: click, dblclick, mousedown, mouseup, mouseout,
 *      mouseover, and mousemove.
 * @param {Boolean} bubbles (Optional) Indicates if the event can be
 *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
 *      default. The default is true.
 * @param {Boolean} cancelable (Optional) Indicates if the event can be
 *      canceled using preventDefault(). DOM Level 2 specifies that all
 *      mouse events except mousemove can be cancelled. The default
 *      is true for all events except mousemove, for which the default
 *      is false.
 * @param {Window} view (Optional) The view containing the target. This is
 *      typically the window object. The default is window.
 * @param {int} detail (Optional) The number of times the mouse button has
 *      been used. The default value is 1.
 * @param {int} screenX (Optional) The x-coordinate on the screen at which
 *      point the event occured. The default is 0.
 * @param {int} screenY (Optional) The y-coordinate on the screen at which
 *      point the event occured. The default is 0.
 * @param {int} clientX (Optional) The x-coordinate on the client at which
 *      point the event occured. The default is 0.
 * @param {int} clientY (Optional) The y-coordinate on the client at which
 *      point the event occured. The default is 0.
 * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
 *      is pressed while the event is firing. The default is false.
 * @param {int} button (Optional) The button being pressed while the event
 *      is executing. The value should be 0 for the primary mouse button
 *      (typically the left button), 1 for the terciary mouse button
 *      (typically the middle button), and 2 for the secondary mouse button
 *      (typically the right button). The default is 0.
 * @param {HTMLElement} relatedTarget (Optional) For mouseout events,
 *      this is the element that the mouse has moved to. For mouseover
 *      events, this is the element that the mouse has moved from. This
 *      argument is ignored for all other events. The default is null.
 */
_yuitest_coverline("build/event-simulate/event-simulate.js", 318);
function simulateMouseEvent(target /*:HTMLElement*/, type /*:String*/,
                               bubbles /*:Boolean*/,  cancelable /*:Boolean*/,
                               view /*:Window*/,        detail /*:int*/,
                               screenX /*:int*/,        screenY /*:int*/,
                               clientX /*:int*/,        clientY /*:int*/,
                               ctrlKey /*:Boolean*/,    altKey /*:Boolean*/,
                               shiftKey /*:Boolean*/,   metaKey /*:Boolean*/,
                               button /*:int*/,         relatedTarget /*:HTMLElement*/) /*:Void*/
{

    //check target
    _yuitest_coverfunc("build/event-simulate/event-simulate.js", "simulateMouseEvent", 318);
_yuitest_coverline("build/event-simulate/event-simulate.js", 329);
if (!target){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 330);
Y.error("simulateMouseEvent(): Invalid target.");
    }

    //check event type
    _yuitest_coverline("build/event-simulate/event-simulate.js", 334);
if (isString(type)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 335);
type = type.toLowerCase();

        //make sure it's a supported mouse event
        _yuitest_coverline("build/event-simulate/event-simulate.js", 338);
if (!mouseEvents[type]){
            _yuitest_coverline("build/event-simulate/event-simulate.js", 339);
Y.error("simulateMouseEvent(): Event type '" + type + "' not supported.");
        }
    } else {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 342);
Y.error("simulateMouseEvent(): Event type must be a string.");
    }

    //setup default values
    _yuitest_coverline("build/event-simulate/event-simulate.js", 346);
if (!isBoolean(bubbles)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 347);
bubbles = true; //all mouse events bubble
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 349);
if (!isBoolean(cancelable)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 350);
cancelable = (type != "mousemove"); //mousemove is the only one that can't be cancelled
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 352);
if (!isObject(view)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 353);
view = Y.config.win; //view is typically window
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 355);
if (!isNumber(detail)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 356);
detail = 1;  //number of mouse clicks must be at least one
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 358);
if (!isNumber(screenX)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 359);
screenX = 0;
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 361);
if (!isNumber(screenY)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 362);
screenY = 0;
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 364);
if (!isNumber(clientX)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 365);
clientX = 0;
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 367);
if (!isNumber(clientY)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 368);
clientY = 0;
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 370);
if (!isBoolean(ctrlKey)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 371);
ctrlKey = false;
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 373);
if (!isBoolean(altKey)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 374);
altKey = false;
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 376);
if (!isBoolean(shiftKey)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 377);
shiftKey = false;
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 379);
if (!isBoolean(metaKey)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 380);
metaKey = false;
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 382);
if (!isNumber(button)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 383);
button = 0;
    }

    _yuitest_coverline("build/event-simulate/event-simulate.js", 386);
relatedTarget = relatedTarget || null;

    //try to create a mouse event
    _yuitest_coverline("build/event-simulate/event-simulate.js", 389);
var customEvent /*:MouseEvent*/ = null;

    //check for DOM-compliant browsers first
    _yuitest_coverline("build/event-simulate/event-simulate.js", 392);
if (isFunction(Y.config.doc.createEvent)){

        _yuitest_coverline("build/event-simulate/event-simulate.js", 394);
customEvent = Y.config.doc.createEvent("MouseEvents");

        //Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
        _yuitest_coverline("build/event-simulate/event-simulate.js", 397);
if (customEvent.initMouseEvent){
            _yuitest_coverline("build/event-simulate/event-simulate.js", 398);
customEvent.initMouseEvent(type, bubbles, cancelable, view, detail,
                                 screenX, screenY, clientX, clientY,
                                 ctrlKey, altKey, shiftKey, metaKey,
                                 button, relatedTarget);
        } else { //Safari

            //the closest thing available in Safari 2.x is UIEvents
            _yuitest_coverline("build/event-simulate/event-simulate.js", 405);
customEvent = Y.config.doc.createEvent("UIEvents");
            _yuitest_coverline("build/event-simulate/event-simulate.js", 406);
customEvent.initEvent(type, bubbles, cancelable);
            _yuitest_coverline("build/event-simulate/event-simulate.js", 407);
customEvent.view = view;
            _yuitest_coverline("build/event-simulate/event-simulate.js", 408);
customEvent.detail = detail;
            _yuitest_coverline("build/event-simulate/event-simulate.js", 409);
customEvent.screenX = screenX;
            _yuitest_coverline("build/event-simulate/event-simulate.js", 410);
customEvent.screenY = screenY;
            _yuitest_coverline("build/event-simulate/event-simulate.js", 411);
customEvent.clientX = clientX;
            _yuitest_coverline("build/event-simulate/event-simulate.js", 412);
customEvent.clientY = clientY;
            _yuitest_coverline("build/event-simulate/event-simulate.js", 413);
customEvent.ctrlKey = ctrlKey;
            _yuitest_coverline("build/event-simulate/event-simulate.js", 414);
customEvent.altKey = altKey;
            _yuitest_coverline("build/event-simulate/event-simulate.js", 415);
customEvent.metaKey = metaKey;
            _yuitest_coverline("build/event-simulate/event-simulate.js", 416);
customEvent.shiftKey = shiftKey;
            _yuitest_coverline("build/event-simulate/event-simulate.js", 417);
customEvent.button = button;
            _yuitest_coverline("build/event-simulate/event-simulate.js", 418);
customEvent.relatedTarget = relatedTarget;
        }

        /*
         * Check to see if relatedTarget has been assigned. Firefox
         * versions less than 2.0 don't allow it to be assigned via
         * initMouseEvent() and the property is readonly after event
         * creation, so in order to keep YAHOO.util.getRelatedTarget()
         * working, assign to the IE proprietary toElement property
         * for mouseout event and fromElement property for mouseover
         * event.
         */
        _yuitest_coverline("build/event-simulate/event-simulate.js", 430);
if (relatedTarget && !customEvent.relatedTarget){
            _yuitest_coverline("build/event-simulate/event-simulate.js", 431);
if (type == "mouseout"){
                _yuitest_coverline("build/event-simulate/event-simulate.js", 432);
customEvent.toElement = relatedTarget;
            } else {_yuitest_coverline("build/event-simulate/event-simulate.js", 433);
if (type == "mouseover"){
                _yuitest_coverline("build/event-simulate/event-simulate.js", 434);
customEvent.fromElement = relatedTarget;
            }}
        }

        //fire the event
        _yuitest_coverline("build/event-simulate/event-simulate.js", 439);
target.dispatchEvent(customEvent);

    } else {_yuitest_coverline("build/event-simulate/event-simulate.js", 441);
if (isObject(Y.config.doc.createEventObject)){ //IE

        //create an IE event object
        _yuitest_coverline("build/event-simulate/event-simulate.js", 444);
customEvent = Y.config.doc.createEventObject();

        //assign available properties
        _yuitest_coverline("build/event-simulate/event-simulate.js", 447);
customEvent.bubbles = bubbles;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 448);
customEvent.cancelable = cancelable;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 449);
customEvent.view = view;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 450);
customEvent.detail = detail;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 451);
customEvent.screenX = screenX;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 452);
customEvent.screenY = screenY;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 453);
customEvent.clientX = clientX;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 454);
customEvent.clientY = clientY;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 455);
customEvent.ctrlKey = ctrlKey;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 456);
customEvent.altKey = altKey;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 457);
customEvent.metaKey = metaKey;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 458);
customEvent.shiftKey = shiftKey;

        //fix button property for IE's wacky implementation
        _yuitest_coverline("build/event-simulate/event-simulate.js", 461);
switch(button){
            case 0:
                _yuitest_coverline("build/event-simulate/event-simulate.js", 463);
customEvent.button = 1;
                _yuitest_coverline("build/event-simulate/event-simulate.js", 464);
break;
            case 1:
                _yuitest_coverline("build/event-simulate/event-simulate.js", 466);
customEvent.button = 4;
                _yuitest_coverline("build/event-simulate/event-simulate.js", 467);
break;
            case 2:
                //leave as is
                _yuitest_coverline("build/event-simulate/event-simulate.js", 470);
break;
            default:
                _yuitest_coverline("build/event-simulate/event-simulate.js", 472);
customEvent.button = 0;
        }

        /*
         * Have to use relatedTarget because IE won't allow assignment
         * to toElement or fromElement on generic events. This keeps
         * YAHOO.util.customEvent.getRelatedTarget() functional.
         */
        _yuitest_coverline("build/event-simulate/event-simulate.js", 480);
customEvent.relatedTarget = relatedTarget;

        //fire the event
        _yuitest_coverline("build/event-simulate/event-simulate.js", 483);
target.fireEvent("on" + type, customEvent);

    } else {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 486);
Y.error("simulateMouseEvent(): No event simulation framework present.");
    }}
}

/*
 * Note: Intentionally not for YUIDoc generation.
 * Simulates a UI event using the given event information to populate
 * the generated event object. This method does browser-equalizing
 * calculations to account for differences in the DOM and IE event models
 * as well as different browser quirks.
 * @method simulateHTMLEvent
 * @private
 * @static
 * @param {HTMLElement} target The target of the given event.
 * @param {String} type The type of event to fire. This can be any one of
 *      the following: click, dblclick, mousedown, mouseup, mouseout,
 *      mouseover, and mousemove.
 * @param {Boolean} bubbles (Optional) Indicates if the event can be
 *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
 *      default. The default is true.
 * @param {Boolean} cancelable (Optional) Indicates if the event can be
 *      canceled using preventDefault(). DOM Level 2 specifies that all
 *      mouse events except mousemove can be cancelled. The default
 *      is true for all events except mousemove, for which the default
 *      is false.
 * @param {Window} view (Optional) The view containing the target. This is
 *      typically the window object. The default is window.
 * @param {int} detail (Optional) The number of times the mouse button has
 *      been used. The default value is 1.
 */
_yuitest_coverline("build/event-simulate/event-simulate.js", 516);
function simulateUIEvent(target /*:HTMLElement*/, type /*:String*/,
                               bubbles /*:Boolean*/,  cancelable /*:Boolean*/,
                               view /*:Window*/,        detail /*:int*/) /*:Void*/
{

    //check target
    _yuitest_coverfunc("build/event-simulate/event-simulate.js", "simulateUIEvent", 516);
_yuitest_coverline("build/event-simulate/event-simulate.js", 522);
if (!target){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 523);
Y.error("simulateUIEvent(): Invalid target.");
    }

    //check event type
    _yuitest_coverline("build/event-simulate/event-simulate.js", 527);
if (isString(type)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 528);
type = type.toLowerCase();

        //make sure it's a supported mouse event
        _yuitest_coverline("build/event-simulate/event-simulate.js", 531);
if (!uiEvents[type]){
            _yuitest_coverline("build/event-simulate/event-simulate.js", 532);
Y.error("simulateUIEvent(): Event type '" + type + "' not supported.");
        }
    } else {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 535);
Y.error("simulateUIEvent(): Event type must be a string.");
    }

    //try to create a mouse event
    _yuitest_coverline("build/event-simulate/event-simulate.js", 539);
var customEvent = null;


    //setup default values
    _yuitest_coverline("build/event-simulate/event-simulate.js", 543);
if (!isBoolean(bubbles)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 544);
bubbles = (type in bubbleEvents);  //not all events bubble
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 546);
if (!isBoolean(cancelable)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 547);
cancelable = (type == "submit"); //submit is the only one that can be cancelled
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 549);
if (!isObject(view)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 550);
view = Y.config.win; //view is typically window
    }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 552);
if (!isNumber(detail)){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 553);
detail = 1;  //usually not used but defaulted to this
    }

    //check for DOM-compliant browsers first
    _yuitest_coverline("build/event-simulate/event-simulate.js", 557);
if (isFunction(Y.config.doc.createEvent)){

        //just a generic UI Event object is needed
        _yuitest_coverline("build/event-simulate/event-simulate.js", 560);
customEvent = Y.config.doc.createEvent("UIEvents");
        _yuitest_coverline("build/event-simulate/event-simulate.js", 561);
customEvent.initUIEvent(type, bubbles, cancelable, view, detail);

        //fire the event
        _yuitest_coverline("build/event-simulate/event-simulate.js", 564);
target.dispatchEvent(customEvent);

    } else {_yuitest_coverline("build/event-simulate/event-simulate.js", 566);
if (isObject(Y.config.doc.createEventObject)){ //IE

        //create an IE event object
        _yuitest_coverline("build/event-simulate/event-simulate.js", 569);
customEvent = Y.config.doc.createEventObject();

        //assign available properties
        _yuitest_coverline("build/event-simulate/event-simulate.js", 572);
customEvent.bubbles = bubbles;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 573);
customEvent.cancelable = cancelable;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 574);
customEvent.view = view;
        _yuitest_coverline("build/event-simulate/event-simulate.js", 575);
customEvent.detail = detail;

        //fire the event
        _yuitest_coverline("build/event-simulate/event-simulate.js", 578);
target.fireEvent("on" + type, customEvent);

    } else {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 581);
Y.error("simulateUIEvent(): No event simulation framework present.");
    }}
}

/*
 * (iOS only) This is for creating native DOM gesture events which only iOS
 * v2.0+ is supporting.
 * 
 * @method simulateGestureEvent
 * @private
 * @param {HTMLElement} target The target of the given event.
 * @param {String} type The type of event to fire. This can be any one of
 *      the following: touchstart, touchmove, touchend, touchcancel.
 * @param {Boolean} bubbles (Optional) Indicates if the event can be
 *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
 *      default. The default is true.
 * @param {Boolean} cancelable (Optional) Indicates if the event can be
 *      canceled using preventDefault(). DOM Level 2 specifies that all
 *      touch events except touchcancel can be cancelled. The default
 *      is true for all events except touchcancel, for which the default
 *      is false.
 * @param {Window} view (Optional) The view containing the target. This is
 *      typically the window object. The default is window.
 * @param {int} detail (Optional) Specifies some detail information about 
 *      the event depending on the type of event.
 * @param {int} screenX (Optional) The x-coordinate on the screen at which
 *      point the event occured. The default is 0.
 * @param {int} screenY (Optional) The y-coordinate on the screen at which
 *      point the event occured. The default is 0.
 * @param {int} clientX (Optional) The x-coordinate on the client at which
 *      point the event occured. The default is 0.
 * @param {int} clientY (Optional) The y-coordinate on the client at which
 *      point the event occured. The default is 0.
 * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
 *      is pressed while the event is firing. The default is false. 
 * @param {float} scale (iOS v2+ only) The distance between two fingers 
 *      since the start of an event as a multiplier of the initial distance. 
 *      The default value is 1.0.
 * @param {float} rotation (iOS v2+ only) The delta rotation since the start 
 *      of an event, in degrees, where clockwise is positive and 
 *      counter-clockwise is negative. The default value is 0.0.   
 */
_yuitest_coverline("build/event-simulate/event-simulate.js", 629);
function simulateGestureEvent(target, type,
    bubbles,            // boolean
    cancelable,         // boolean
    view,               // DOMWindow
    detail,             // long
    screenX, screenY,   // long
    clientX, clientY,   // long
    ctrlKey, altKey, shiftKey, metaKey, // boolean
    scale,              // float
    rotation            // float
) {
    _yuitest_coverfunc("build/event-simulate/event-simulate.js", "simulateGestureEvent", 629);
_yuitest_coverline("build/event-simulate/event-simulate.js", 640);
var customEvent;

    _yuitest_coverline("build/event-simulate/event-simulate.js", 642);
if(!Y.UA.ios || Y.UA.ios<2.0) {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 643);
Y.error("simulateGestureEvent(): Native gesture DOM eventframe is not available in this platform.");
    }

    // check taget    
    _yuitest_coverline("build/event-simulate/event-simulate.js", 647);
if (!target){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 648);
Y.error("simulateGestureEvent(): Invalid target.");
    }

    //check event type
    _yuitest_coverline("build/event-simulate/event-simulate.js", 652);
if (Y.Lang.isString(type)) {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 653);
type = type.toLowerCase();

        //make sure it's a supported touch event
        _yuitest_coverline("build/event-simulate/event-simulate.js", 656);
if (!gestureEvents[type]){
            _yuitest_coverline("build/event-simulate/event-simulate.js", 657);
Y.error("simulateTouchEvent(): Event type '" + type + "' not supported.");
        }
    } else {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 660);
Y.error("simulateGestureEvent(): Event type must be a string.");
    }

    // setup default values
    _yuitest_coverline("build/event-simulate/event-simulate.js", 664);
if (!Y.Lang.isBoolean(bubbles)) { bubbles = true; } // bubble by default
    _yuitest_coverline("build/event-simulate/event-simulate.js", 665);
if (!Y.Lang.isBoolean(cancelable)) { cancelable = true; } 
    _yuitest_coverline("build/event-simulate/event-simulate.js", 666);
if (!Y.Lang.isObject(view))     { view = Y.config.win; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 667);
if (!Y.Lang.isNumber(detail))   { detail = 2; }     // usually not used.
    _yuitest_coverline("build/event-simulate/event-simulate.js", 668);
if (!Y.Lang.isNumber(screenX))  { screenX = 0; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 669);
if (!Y.Lang.isNumber(screenY))  { screenY = 0; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 670);
if (!Y.Lang.isNumber(clientX))  { clientX = 0; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 671);
if (!Y.Lang.isNumber(clientY))  { clientY = 0; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 672);
if (!Y.Lang.isBoolean(ctrlKey)) { ctrlKey = false; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 673);
if (!Y.Lang.isBoolean(altKey))  { altKey = false; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 674);
if (!Y.Lang.isBoolean(shiftKey)){ shiftKey = false; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 675);
if (!Y.Lang.isBoolean(metaKey)) { metaKey = false; }

    _yuitest_coverline("build/event-simulate/event-simulate.js", 677);
if (!Y.Lang.isNumber(scale)){ scale = 1.0; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 678);
if (!Y.Lang.isNumber(rotation)){ rotation = 0.0; }

    _yuitest_coverline("build/event-simulate/event-simulate.js", 680);
customEvent = Y.config.doc.createEvent("GestureEvent");

    _yuitest_coverline("build/event-simulate/event-simulate.js", 682);
customEvent.initGestureEvent(type, bubbles, cancelable, view, detail,
        screenX, screenY, clientX, clientY,
        ctrlKey, altKey, shiftKey, metaKey,
        target, scale, rotation);

    _yuitest_coverline("build/event-simulate/event-simulate.js", 687);
target.dispatchEvent(customEvent);
}


/*
 * @method simulateTouchEvent
 * @private
 * @param {HTMLElement} target The target of the given event.
 * @param {String} type The type of event to fire. This can be any one of
 *      the following: touchstart, touchmove, touchend, touchcancel.
 * @param {Boolean} bubbles (Optional) Indicates if the event can be
 *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
 *      default. The default is true.
 * @param {Boolean} cancelable (Optional) Indicates if the event can be
 *      canceled using preventDefault(). DOM Level 2 specifies that all
 *      touch events except touchcancel can be cancelled. The default
 *      is true for all events except touchcancel, for which the default
 *      is false.
 * @param {Window} view (Optional) The view containing the target. This is
 *      typically the window object. The default is window.
 * @param {int} detail (Optional) Specifies some detail information about 
 *      the event depending on the type of event.
 * @param {int} screenX (Optional) The x-coordinate on the screen at which
 *      point the event occured. The default is 0.
 * @param {int} screenY (Optional) The y-coordinate on the screen at which
 *      point the event occured. The default is 0.
 * @param {int} clientX (Optional) The x-coordinate on the client at which
 *      point the event occured. The default is 0.
 * @param {int} clientY (Optional) The y-coordinate on the client at which
 *      point the event occured. The default is 0.
 * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
 *      is pressed while the event is firing. The default is false. 
 * @param {TouchList} touches A collection of Touch objects representing 
 *      all touches associated with this event.
 * @param {TouchList} targetTouches A collection of Touch objects 
 *      representing all touches associated with this target.
 * @param {TouchList} changedTouches A collection of Touch objects 
 *      representing all touches that changed in this event.
 * @param {float} scale (iOS v2+ only) The distance between two fingers 
 *      since the start of an event as a multiplier of the initial distance. 
 *      The default value is 1.0.
 * @param {float} rotation (iOS v2+ only) The delta rotation since the start 
 *      of an event, in degrees, where clockwise is positive and 
 *      counter-clockwise is negative. The default value is 0.0.   
 */
_yuitest_coverline("build/event-simulate/event-simulate.js", 738);
function simulateTouchEvent(target, type,
    bubbles,            // boolean
    cancelable,         // boolean
    view,               // DOMWindow
    detail,             // long
    screenX, screenY,   // long
    clientX, clientY,   // long
    ctrlKey, altKey, shiftKey, metaKey, // boolean
    touches,            // TouchList
    targetTouches,      // TouchList
    changedTouches,     // TouchList
    scale,              // float
    rotation            // float
) {

    _yuitest_coverfunc("build/event-simulate/event-simulate.js", "simulateTouchEvent", 738);
_yuitest_coverline("build/event-simulate/event-simulate.js", 753);
var customEvent;

    // check taget    
    _yuitest_coverline("build/event-simulate/event-simulate.js", 756);
if (!target){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 757);
Y.error("simulateTouchEvent(): Invalid target.");
    }

    //check event type
    _yuitest_coverline("build/event-simulate/event-simulate.js", 761);
if (Y.Lang.isString(type)) {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 762);
type = type.toLowerCase();

        //make sure it's a supported touch event
        _yuitest_coverline("build/event-simulate/event-simulate.js", 765);
if (!touchEvents[type]){
            _yuitest_coverline("build/event-simulate/event-simulate.js", 766);
Y.error("simulateTouchEvent(): Event type '" + type + "' not supported.");
        }
    } else {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 769);
Y.error("simulateTouchEvent(): Event type must be a string.");
    }

    // note that the caller is responsible to pass appropriate touch objects.
    // check touch objects
    // Android(even 4.0) doesn't define TouchList yet
    /*if(type === 'touchstart' || type === 'touchmove') {
        if(!touches instanceof TouchList) {
            Y.error('simulateTouchEvent(): Invalid touches. It must be a TouchList');
        } else {
            if(touches.length === 0) {
                Y.error('simulateTouchEvent(): No touch object found.');
            }
        }
    } else if(type === 'touchend') {
        if(!changedTouches instanceof TouchList) {
            Y.error('simulateTouchEvent(): Invalid touches. It must be a TouchList');
        } else {
            if(changedTouches.length === 0) {
                Y.error('simulateTouchEvent(): No touch object found.');
            }
        }
    }*/

    _yuitest_coverline("build/event-simulate/event-simulate.js", 793);
if(type === 'touchstart' || type === 'touchmove') {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 794);
if(touches.length === 0) {
            _yuitest_coverline("build/event-simulate/event-simulate.js", 795);
Y.error('simulateTouchEvent(): No touch object in touches');
        }
    } else {_yuitest_coverline("build/event-simulate/event-simulate.js", 797);
if(type === 'touchend') {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 798);
if(changedTouches.length === 0) {
            _yuitest_coverline("build/event-simulate/event-simulate.js", 799);
Y.error('simulateTouchEvent(): No touch object in changedTouches');
        }
    }}

    // setup default values
    _yuitest_coverline("build/event-simulate/event-simulate.js", 804);
if (!Y.Lang.isBoolean(bubbles)) { bubbles = true; } // bubble by default.
    _yuitest_coverline("build/event-simulate/event-simulate.js", 805);
if (!Y.Lang.isBoolean(cancelable)) { 
        _yuitest_coverline("build/event-simulate/event-simulate.js", 806);
cancelable = (type != "touchcancel"); // touchcancel is not cancelled 
    } 
    _yuitest_coverline("build/event-simulate/event-simulate.js", 808);
if (!Y.Lang.isObject(view))     { view = Y.config.win; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 809);
if (!Y.Lang.isNumber(detail))   { detail = 1; } // usually not used. defaulted to # of touch objects.
    _yuitest_coverline("build/event-simulate/event-simulate.js", 810);
if (!Y.Lang.isNumber(screenX))  { screenX = 0; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 811);
if (!Y.Lang.isNumber(screenY))  { screenY = 0; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 812);
if (!Y.Lang.isNumber(clientX))  { clientX = 0; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 813);
if (!Y.Lang.isNumber(clientY))  { clientY = 0; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 814);
if (!Y.Lang.isBoolean(ctrlKey)) { ctrlKey = false; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 815);
if (!Y.Lang.isBoolean(altKey))  { altKey = false; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 816);
if (!Y.Lang.isBoolean(shiftKey)){ shiftKey = false; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 817);
if (!Y.Lang.isBoolean(metaKey)) { metaKey = false; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 818);
if (!Y.Lang.isNumber(scale))    { scale = 1.0; }
    _yuitest_coverline("build/event-simulate/event-simulate.js", 819);
if (!Y.Lang.isNumber(rotation)) { rotation = 0.0; }


    //check for DOM-compliant browsers first
    _yuitest_coverline("build/event-simulate/event-simulate.js", 823);
if (Y.Lang.isFunction(Y.config.doc.createEvent)) {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 824);
if (Y.UA.android) {
            /**
                * Couldn't find android start version that supports touch event. 
                * Assumed supported(btw APIs broken till icecream sandwitch) 
                * from the beginning.
                */
            _yuitest_coverline("build/event-simulate/event-simulate.js", 830);
if(Y.UA.android < 4.0) {
                /**
                    * Touch APIs are broken in androids older than 4.0. We will use 
                    * simulated touch apis for these versions. 
                    * App developer still can listen for touch events. This events
                    * will be dispatched with touch event types.
                    * 
                    * (Note) Used target for the relatedTarget. Need to verify if
                    * it has a side effect.
                    */
                _yuitest_coverline("build/event-simulate/event-simulate.js", 840);
customEvent = Y.config.doc.createEvent("MouseEvents");
                _yuitest_coverline("build/event-simulate/event-simulate.js", 841);
customEvent.initMouseEvent(type, bubbles, cancelable, view, detail, 
                    screenX, screenY, clientX, clientY,
                    ctrlKey, altKey, shiftKey, metaKey,
                    0, target);

                _yuitest_coverline("build/event-simulate/event-simulate.js", 846);
customEvent.touches = touches;
                _yuitest_coverline("build/event-simulate/event-simulate.js", 847);
customEvent.targetTouches = targetTouches;
                _yuitest_coverline("build/event-simulate/event-simulate.js", 848);
customEvent.changedTouches = changedTouches;
            } else {
                _yuitest_coverline("build/event-simulate/event-simulate.js", 850);
customEvent = Y.config.doc.createEvent("TouchEvent");

                // Andoroid isn't compliant W3C initTouchEvent method signature.
                _yuitest_coverline("build/event-simulate/event-simulate.js", 853);
customEvent.initTouchEvent(touches, targetTouches, changedTouches,
                    type, view,
                    screenX, screenY, clientX, clientY,
                    ctrlKey, altKey, shiftKey, metaKey);
            }
        } else {_yuitest_coverline("build/event-simulate/event-simulate.js", 858);
if (Y.UA.ios) {
            _yuitest_coverline("build/event-simulate/event-simulate.js", 859);
if(Y.UA.ios >= 2.0) {
                _yuitest_coverline("build/event-simulate/event-simulate.js", 860);
customEvent = Y.config.doc.createEvent("TouchEvent");

                // Available iOS 2.0 and later
                _yuitest_coverline("build/event-simulate/event-simulate.js", 863);
customEvent.initTouchEvent(type, bubbles, cancelable, view, detail,
                    screenX, screenY, clientX, clientY,
                    ctrlKey, altKey, shiftKey, metaKey,
                    touches, targetTouches, changedTouches,
                    scale, rotation);
            } else {
                _yuitest_coverline("build/event-simulate/event-simulate.js", 869);
Y.error('simulateTouchEvent(): No touch event simulation framework present for iOS, '+Y.UA.ios+'.');
            }
        } else {
            _yuitest_coverline("build/event-simulate/event-simulate.js", 872);
Y.error('simulateTouchEvent(): Not supported agent yet, '+Y.UA.userAgent);
        }}

        //fire the event
        _yuitest_coverline("build/event-simulate/event-simulate.js", 876);
target.dispatchEvent(customEvent);
    //} else if (Y.Lang.isObject(doc.createEventObject)){ // Windows Mobile/IE, support later 
    } else {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 879);
Y.error('simulateTouchEvent(): No event simulation framework present.');
    }
}

/**
 * Simulates the event or gesture with the given name on a target.
 * @param {HTMLElement} target The DOM element that's the target of the event.
 * @param {String} type The type of event or name of the supported gesture to simulate 
 *      (i.e., "click", "doubletap", "flick").
 * @param {Object} options (Optional) Extra options to copy onto the event object. 
 *      For gestures, options are used to refine the gesture behavior.
 * @return {void}
 * @for Event
 * @method simulate
 * @static
 */
_yuitest_coverline("build/event-simulate/event-simulate.js", 895);
Y.Event.simulate = function(target, type, options){

    _yuitest_coverfunc("build/event-simulate/event-simulate.js", "simulate", 895);
_yuitest_coverline("build/event-simulate/event-simulate.js", 897);
options = options || {};

    _yuitest_coverline("build/event-simulate/event-simulate.js", 899);
if (mouseEvents[type]){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 900);
simulateMouseEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.detail, options.screenX,
            options.screenY, options.clientX, options.clientY, options.ctrlKey,
            options.altKey, options.shiftKey, options.metaKey, options.button,
            options.relatedTarget);
    } else {_yuitest_coverline("build/event-simulate/event-simulate.js", 905);
if (keyEvents[type]){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 906);
simulateKeyEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.ctrlKey,
            options.altKey, options.shiftKey, options.metaKey,
            options.keyCode, options.charCode);
    } else {_yuitest_coverline("build/event-simulate/event-simulate.js", 910);
if (uiEvents[type]){
        _yuitest_coverline("build/event-simulate/event-simulate.js", 911);
simulateUIEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.detail);
            
    // touch low-level event simulation        
    } else {_yuitest_coverline("build/event-simulate/event-simulate.js", 915);
if (touchEvents[type]) {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 916);
if((Y.config.win && ("ontouchstart" in Y.config.win)) && !(Y.UA.phantomjs) && !(Y.UA.chrome && Y.UA.chrome < 6)) {
            _yuitest_coverline("build/event-simulate/event-simulate.js", 917);
simulateTouchEvent(target, type, 
                options.bubbles, options.cancelable, options.view, options.detail, 
                options.screenX, options.screenY, options.clientX, options.clientY, 
                options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, 
                options.touches, options.targetTouches, options.changedTouches,
                options.scale, options.rotation);
        } else {
            _yuitest_coverline("build/event-simulate/event-simulate.js", 924);
Y.error("simulate(): Event '" + type + "' can't be simulated. Use gesture-simulate module instead.");
        }

    // ios gesture low-level event simulation (iOS v2+ only)        
    } else {_yuitest_coverline("build/event-simulate/event-simulate.js", 928);
if(Y.UA.ios && Y.UA.ios >= 2.0 && gestureEvents[type]) {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 929);
simulateGestureEvent(target, type, 
            options.bubbles, options.cancelable, options.view, options.detail, 
            options.screenX, options.screenY, options.clientX, options.clientY, 
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
            options.scale, options.rotation);
    
    // anything else
    } else {
        _yuitest_coverline("build/event-simulate/event-simulate.js", 937);
Y.error("simulate(): Event '" + type + "' can't be simulated.");
    }}}}}
};


})();



}, '3.7.3', {"requires": ["event-base"]});
