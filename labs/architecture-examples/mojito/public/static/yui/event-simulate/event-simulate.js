/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('event-simulate', function (Y, NAME) {

(function() {
/**
 * Simulate user interaction by generating native DOM events.
 *
 * @module event-simulate
 * @requires event
 */

//shortcuts
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
Y.mix(bubbleEvents, mouseEvents);
Y.mix(bubbleEvents, keyEvents);
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
function simulateKeyEvent(target /*:HTMLElement*/, type /*:String*/,
                             bubbles /*:Boolean*/,  cancelable /*:Boolean*/,
                             view /*:Window*/,
                             ctrlKey /*:Boolean*/,    altKey /*:Boolean*/,
                             shiftKey /*:Boolean*/,   metaKey /*:Boolean*/,
                             keyCode /*:int*/,        charCode /*:int*/) /*:Void*/
{
    //check target
    if (!target){
        Y.error("simulateKeyEvent(): Invalid target.");
    }

    //check event type
    if (isString(type)){
        type = type.toLowerCase();
        switch(type){
            case "textevent": //DOM Level 3
                type = "keypress";
                break;
            case "keyup":
            case "keydown":
            case "keypress":
                break;
            default:
                Y.error("simulateKeyEvent(): Event type '" + type + "' not supported.");
        }
    } else {
        Y.error("simulateKeyEvent(): Event type must be a string.");
    }

    //setup default values
    if (!isBoolean(bubbles)){
        bubbles = true; //all key events bubble
    }
    if (!isBoolean(cancelable)){
        cancelable = true; //all key events can be cancelled
    }
    if (!isObject(view)){
        view = Y.config.win; //view is typically window
    }
    if (!isBoolean(ctrlKey)){
        ctrlKey = false;
    }
    if (!isBoolean(altKey)){
        altKey = false;
    }
    if (!isBoolean(shiftKey)){
        shiftKey = false;
    }
    if (!isBoolean(metaKey)){
        metaKey = false;
    }
    if (!isNumber(keyCode)){
        keyCode = 0;
    }
    if (!isNumber(charCode)){
        charCode = 0;
    }

    //try to create a mouse event
    var customEvent /*:MouseEvent*/ = null;

    //check for DOM-compliant browsers first
    if (isFunction(Y.config.doc.createEvent)){

        try {

            //try to create key event
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
            try {

                //try to create generic event - will fail in Safari 2.x
                customEvent = Y.config.doc.createEvent("Events");

            } catch (uierror /*:Error*/){

                //the above failed, so create a UIEvent for Safari 2.x
                customEvent = Y.config.doc.createEvent("UIEvents");

            } finally {

                customEvent.initEvent(type, bubbles, cancelable);

                //initialize
                customEvent.view = view;
                customEvent.altKey = altKey;
                customEvent.ctrlKey = ctrlKey;
                customEvent.shiftKey = shiftKey;
                customEvent.metaKey = metaKey;
                customEvent.keyCode = keyCode;
                customEvent.charCode = charCode;

            }

        }

        //fire the event
        target.dispatchEvent(customEvent);

    } else if (isObject(Y.config.doc.createEventObject)){ //IE

        //create an IE event object
        customEvent = Y.config.doc.createEventObject();

        //assign available properties
        customEvent.bubbles = bubbles;
        customEvent.cancelable = cancelable;
        customEvent.view = view;
        customEvent.ctrlKey = ctrlKey;
        customEvent.altKey = altKey;
        customEvent.shiftKey = shiftKey;
        customEvent.metaKey = metaKey;

        /*
         * IE doesn't support charCode explicitly. CharCode should
         * take precedence over any keyCode value for accurate
         * representation.
         */
        customEvent.keyCode = (charCode > 0) ? charCode : keyCode;

        //fire the event
        target.fireEvent("on" + type, customEvent);

    } else {
        Y.error("simulateKeyEvent(): No event simulation framework present.");
    }
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
    if (!target){
        Y.error("simulateMouseEvent(): Invalid target.");
    }

    //check event type
    if (isString(type)){
        type = type.toLowerCase();

        //make sure it's a supported mouse event
        if (!mouseEvents[type]){
            Y.error("simulateMouseEvent(): Event type '" + type + "' not supported.");
        }
    } else {
        Y.error("simulateMouseEvent(): Event type must be a string.");
    }

    //setup default values
    if (!isBoolean(bubbles)){
        bubbles = true; //all mouse events bubble
    }
    if (!isBoolean(cancelable)){
        cancelable = (type != "mousemove"); //mousemove is the only one that can't be cancelled
    }
    if (!isObject(view)){
        view = Y.config.win; //view is typically window
    }
    if (!isNumber(detail)){
        detail = 1;  //number of mouse clicks must be at least one
    }
    if (!isNumber(screenX)){
        screenX = 0;
    }
    if (!isNumber(screenY)){
        screenY = 0;
    }
    if (!isNumber(clientX)){
        clientX = 0;
    }
    if (!isNumber(clientY)){
        clientY = 0;
    }
    if (!isBoolean(ctrlKey)){
        ctrlKey = false;
    }
    if (!isBoolean(altKey)){
        altKey = false;
    }
    if (!isBoolean(shiftKey)){
        shiftKey = false;
    }
    if (!isBoolean(metaKey)){
        metaKey = false;
    }
    if (!isNumber(button)){
        button = 0;
    }

    relatedTarget = relatedTarget || null;

    //try to create a mouse event
    var customEvent /*:MouseEvent*/ = null;

    //check for DOM-compliant browsers first
    if (isFunction(Y.config.doc.createEvent)){

        customEvent = Y.config.doc.createEvent("MouseEvents");

        //Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
        if (customEvent.initMouseEvent){
            customEvent.initMouseEvent(type, bubbles, cancelable, view, detail,
                                 screenX, screenY, clientX, clientY,
                                 ctrlKey, altKey, shiftKey, metaKey,
                                 button, relatedTarget);
        } else { //Safari

            //the closest thing available in Safari 2.x is UIEvents
            customEvent = Y.config.doc.createEvent("UIEvents");
            customEvent.initEvent(type, bubbles, cancelable);
            customEvent.view = view;
            customEvent.detail = detail;
            customEvent.screenX = screenX;
            customEvent.screenY = screenY;
            customEvent.clientX = clientX;
            customEvent.clientY = clientY;
            customEvent.ctrlKey = ctrlKey;
            customEvent.altKey = altKey;
            customEvent.metaKey = metaKey;
            customEvent.shiftKey = shiftKey;
            customEvent.button = button;
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
        if (relatedTarget && !customEvent.relatedTarget){
            if (type == "mouseout"){
                customEvent.toElement = relatedTarget;
            } else if (type == "mouseover"){
                customEvent.fromElement = relatedTarget;
            }
        }

        //fire the event
        target.dispatchEvent(customEvent);

    } else if (isObject(Y.config.doc.createEventObject)){ //IE

        //create an IE event object
        customEvent = Y.config.doc.createEventObject();

        //assign available properties
        customEvent.bubbles = bubbles;
        customEvent.cancelable = cancelable;
        customEvent.view = view;
        customEvent.detail = detail;
        customEvent.screenX = screenX;
        customEvent.screenY = screenY;
        customEvent.clientX = clientX;
        customEvent.clientY = clientY;
        customEvent.ctrlKey = ctrlKey;
        customEvent.altKey = altKey;
        customEvent.metaKey = metaKey;
        customEvent.shiftKey = shiftKey;

        //fix button property for IE's wacky implementation
        switch(button){
            case 0:
                customEvent.button = 1;
                break;
            case 1:
                customEvent.button = 4;
                break;
            case 2:
                //leave as is
                break;
            default:
                customEvent.button = 0;
        }

        /*
         * Have to use relatedTarget because IE won't allow assignment
         * to toElement or fromElement on generic events. This keeps
         * YAHOO.util.customEvent.getRelatedTarget() functional.
         */
        customEvent.relatedTarget = relatedTarget;

        //fire the event
        target.fireEvent("on" + type, customEvent);

    } else {
        Y.error("simulateMouseEvent(): No event simulation framework present.");
    }
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
function simulateUIEvent(target /*:HTMLElement*/, type /*:String*/,
                               bubbles /*:Boolean*/,  cancelable /*:Boolean*/,
                               view /*:Window*/,        detail /*:int*/) /*:Void*/
{

    //check target
    if (!target){
        Y.error("simulateUIEvent(): Invalid target.");
    }

    //check event type
    if (isString(type)){
        type = type.toLowerCase();

        //make sure it's a supported mouse event
        if (!uiEvents[type]){
            Y.error("simulateUIEvent(): Event type '" + type + "' not supported.");
        }
    } else {
        Y.error("simulateUIEvent(): Event type must be a string.");
    }

    //try to create a mouse event
    var customEvent = null;


    //setup default values
    if (!isBoolean(bubbles)){
        bubbles = (type in bubbleEvents);  //not all events bubble
    }
    if (!isBoolean(cancelable)){
        cancelable = (type == "submit"); //submit is the only one that can be cancelled
    }
    if (!isObject(view)){
        view = Y.config.win; //view is typically window
    }
    if (!isNumber(detail)){
        detail = 1;  //usually not used but defaulted to this
    }

    //check for DOM-compliant browsers first
    if (isFunction(Y.config.doc.createEvent)){

        //just a generic UI Event object is needed
        customEvent = Y.config.doc.createEvent("UIEvents");
        customEvent.initUIEvent(type, bubbles, cancelable, view, detail);

        //fire the event
        target.dispatchEvent(customEvent);

    } else if (isObject(Y.config.doc.createEventObject)){ //IE

        //create an IE event object
        customEvent = Y.config.doc.createEventObject();

        //assign available properties
        customEvent.bubbles = bubbles;
        customEvent.cancelable = cancelable;
        customEvent.view = view;
        customEvent.detail = detail;

        //fire the event
        target.fireEvent("on" + type, customEvent);

    } else {
        Y.error("simulateUIEvent(): No event simulation framework present.");
    }
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
    var customEvent;

    if(!Y.UA.ios || Y.UA.ios<2.0) {
        Y.error("simulateGestureEvent(): Native gesture DOM eventframe is not available in this platform.");
    }

    // check taget    
    if (!target){
        Y.error("simulateGestureEvent(): Invalid target.");
    }

    //check event type
    if (Y.Lang.isString(type)) {
        type = type.toLowerCase();

        //make sure it's a supported touch event
        if (!gestureEvents[type]){
            Y.error("simulateTouchEvent(): Event type '" + type + "' not supported.");
        }
    } else {
        Y.error("simulateGestureEvent(): Event type must be a string.");
    }

    // setup default values
    if (!Y.Lang.isBoolean(bubbles)) { bubbles = true; } // bubble by default
    if (!Y.Lang.isBoolean(cancelable)) { cancelable = true; } 
    if (!Y.Lang.isObject(view))     { view = Y.config.win; }
    if (!Y.Lang.isNumber(detail))   { detail = 2; }     // usually not used.
    if (!Y.Lang.isNumber(screenX))  { screenX = 0; }
    if (!Y.Lang.isNumber(screenY))  { screenY = 0; }
    if (!Y.Lang.isNumber(clientX))  { clientX = 0; }
    if (!Y.Lang.isNumber(clientY))  { clientY = 0; }
    if (!Y.Lang.isBoolean(ctrlKey)) { ctrlKey = false; }
    if (!Y.Lang.isBoolean(altKey))  { altKey = false; }
    if (!Y.Lang.isBoolean(shiftKey)){ shiftKey = false; }
    if (!Y.Lang.isBoolean(metaKey)) { metaKey = false; }

    if (!Y.Lang.isNumber(scale)){ scale = 1.0; }
    if (!Y.Lang.isNumber(rotation)){ rotation = 0.0; }

    customEvent = Y.config.doc.createEvent("GestureEvent");

    customEvent.initGestureEvent(type, bubbles, cancelable, view, detail,
        screenX, screenY, clientX, clientY,
        ctrlKey, altKey, shiftKey, metaKey,
        target, scale, rotation);

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

    var customEvent;

    // check taget    
    if (!target){
        Y.error("simulateTouchEvent(): Invalid target.");
    }

    //check event type
    if (Y.Lang.isString(type)) {
        type = type.toLowerCase();

        //make sure it's a supported touch event
        if (!touchEvents[type]){
            Y.error("simulateTouchEvent(): Event type '" + type + "' not supported.");
        }
    } else {
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

    if(type === 'touchstart' || type === 'touchmove') {
        if(touches.length === 0) {
            Y.error('simulateTouchEvent(): No touch object in touches');
        }
    } else if(type === 'touchend') {
        if(changedTouches.length === 0) {
            Y.error('simulateTouchEvent(): No touch object in changedTouches');
        }
    }

    // setup default values
    if (!Y.Lang.isBoolean(bubbles)) { bubbles = true; } // bubble by default.
    if (!Y.Lang.isBoolean(cancelable)) { 
        cancelable = (type != "touchcancel"); // touchcancel is not cancelled 
    } 
    if (!Y.Lang.isObject(view))     { view = Y.config.win; }
    if (!Y.Lang.isNumber(detail))   { detail = 1; } // usually not used. defaulted to # of touch objects.
    if (!Y.Lang.isNumber(screenX))  { screenX = 0; }
    if (!Y.Lang.isNumber(screenY))  { screenY = 0; }
    if (!Y.Lang.isNumber(clientX))  { clientX = 0; }
    if (!Y.Lang.isNumber(clientY))  { clientY = 0; }
    if (!Y.Lang.isBoolean(ctrlKey)) { ctrlKey = false; }
    if (!Y.Lang.isBoolean(altKey))  { altKey = false; }
    if (!Y.Lang.isBoolean(shiftKey)){ shiftKey = false; }
    if (!Y.Lang.isBoolean(metaKey)) { metaKey = false; }
    if (!Y.Lang.isNumber(scale))    { scale = 1.0; }
    if (!Y.Lang.isNumber(rotation)) { rotation = 0.0; }


    //check for DOM-compliant browsers first
    if (Y.Lang.isFunction(Y.config.doc.createEvent)) {
        if (Y.UA.android) {
            /**
                * Couldn't find android start version that supports touch event. 
                * Assumed supported(btw APIs broken till icecream sandwitch) 
                * from the beginning.
                */
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
                customEvent = Y.config.doc.createEvent("MouseEvents");
                customEvent.initMouseEvent(type, bubbles, cancelable, view, detail, 
                    screenX, screenY, clientX, clientY,
                    ctrlKey, altKey, shiftKey, metaKey,
                    0, target);

                customEvent.touches = touches;
                customEvent.targetTouches = targetTouches;
                customEvent.changedTouches = changedTouches;
            } else {
                customEvent = Y.config.doc.createEvent("TouchEvent");

                // Andoroid isn't compliant W3C initTouchEvent method signature.
                customEvent.initTouchEvent(touches, targetTouches, changedTouches,
                    type, view,
                    screenX, screenY, clientX, clientY,
                    ctrlKey, altKey, shiftKey, metaKey);
            }
        } else if (Y.UA.ios) {
            if(Y.UA.ios >= 2.0) {
                customEvent = Y.config.doc.createEvent("TouchEvent");

                // Available iOS 2.0 and later
                customEvent.initTouchEvent(type, bubbles, cancelable, view, detail,
                    screenX, screenY, clientX, clientY,
                    ctrlKey, altKey, shiftKey, metaKey,
                    touches, targetTouches, changedTouches,
                    scale, rotation);
            } else {
                Y.error('simulateTouchEvent(): No touch event simulation framework present for iOS, '+Y.UA.ios+'.');
            }
        } else {
            Y.error('simulateTouchEvent(): Not supported agent yet, '+Y.UA.userAgent);
        }

        //fire the event
        target.dispatchEvent(customEvent);
    //} else if (Y.Lang.isObject(doc.createEventObject)){ // Windows Mobile/IE, support later 
    } else {
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
Y.Event.simulate = function(target, type, options){

    options = options || {};

    if (mouseEvents[type]){
        simulateMouseEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.detail, options.screenX,
            options.screenY, options.clientX, options.clientY, options.ctrlKey,
            options.altKey, options.shiftKey, options.metaKey, options.button,
            options.relatedTarget);
    } else if (keyEvents[type]){
        simulateKeyEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.ctrlKey,
            options.altKey, options.shiftKey, options.metaKey,
            options.keyCode, options.charCode);
    } else if (uiEvents[type]){
        simulateUIEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.detail);
            
    // touch low-level event simulation        
    } else if (touchEvents[type]) {
        if((Y.config.win && ("ontouchstart" in Y.config.win)) && !(Y.UA.phantomjs) && !(Y.UA.chrome && Y.UA.chrome < 6)) {
            simulateTouchEvent(target, type, 
                options.bubbles, options.cancelable, options.view, options.detail, 
                options.screenX, options.screenY, options.clientX, options.clientY, 
                options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, 
                options.touches, options.targetTouches, options.changedTouches,
                options.scale, options.rotation);
        } else {
            Y.error("simulate(): Event '" + type + "' can't be simulated. Use gesture-simulate module instead.");
        }

    // ios gesture low-level event simulation (iOS v2+ only)        
    } else if(Y.UA.ios && Y.UA.ios >= 2.0 && gestureEvents[type]) {
        simulateGestureEvent(target, type, 
            options.bubbles, options.cancelable, options.view, options.detail, 
            options.screenX, options.screenY, options.clientX, options.clientY, 
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
            options.scale, options.rotation);
    
    // anything else
    } else {
        Y.error("simulate(): Event '" + type + "' can't be simulated.");
    }
};


})();



}, '3.7.3', {"requires": ["event-base"]});
