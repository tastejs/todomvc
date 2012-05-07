goog.require('mvc.Control');
goog.require('mvc.Model');

goog.require('goog.dom');
goog.require('goog.testing.jsunit');

var simpleControl;

var setUp = function() {
    simpleModel = new mvc.Model();
    simpleControl = new mvc.Control(simpleModel);
    simpleControl.decorate(goog.dom.getElement("control"));
};

var testSimpleControl = function() {    
    assertEquals("should come back with one element", 1, simpleControl.getEls(".class2").length);
    assertEquals("should come back with 2 elements", 2, simpleControl.getEls(".class1").length);
};

var testControlListener = function () {
    var toggle = false;
    var handle = function(){toggle = !toggle;};
    var uid = simpleControl.click(handle);
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    simpleControl.getElement().dispatchEvent(evt);
    assert("true, click should be handled", toggle);
    simpleControl.off(uid);
    evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    simpleControl.getElement().dispatchEvent(evt);
    assert("true, click listener should be removed", toggle);
};

var testControlOnce = function () {
    var toggle = false;
    var handle = function(){
        toggle = !toggle;
    };
    simpleControl.once(goog.events.EventType.CLICK, handle);
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    simpleControl.getElement().dispatchEvent(evt);
    assert("true, click should be handled", toggle);
    evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    simpleControl.getElement().dispatchEvent(evt);
    assert("true, click listener should be removed", toggle);
};
