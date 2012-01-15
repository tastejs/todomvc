steal.plugins("funcunit/qunit", "jquery/controller/history/html5").then(function($){
	
module("jquery/controller/history/html5",{
	setup: function(){
		
	}
})


$.Controller.extend("HTML5HistoryTestController", {
},
{
  "history.** subscribe": function(event_name, params) {
    this["gotHistory"](event_name.replace("history.", ""), params);
  },
  
  gotHistory: $.noop,
  
  "window windowpopstate": function(ev) {
    this["gotPopState"](location.href, (ev.originalEvent && ev.originalEvent.state) || {});
  },
  
  gotPopState: $.noop
});

var originalLocation = location.href;

asyncTest("Controller redirect should work", function(){
  expect(1);
  var testController = new HTML5HistoryTestController($("<div />").get(0));

  var testLocation = "/test/location";
  testController["gotHistory"] = function(location, state) {
    start();
    equals(location, testLocation);
    testController["gotHistory"] = $.noop;
    testController.redirectTo(originalLocation);
  };
  
  stop();
  testController.redirectTo(testLocation);
});

asyncTest("State data should persist", function(){
  expect(1);
  var testController = new HTML5HistoryTestController($("<div />").get(0));

  testController["gotHistory"] = function(location, state) {
    start();
    equals(state.hi, "mom");
    testController["gotHistory"] = $.noop;
    testController.redirectTo(originalLocation);
  };

  stop();
  testController.redirectTo("/test/location", { hi: "mom" });
});

asyncTest("Should listen to windowpopstate", function(){
  expect(2);
  var testController = new HTML5HistoryTestController($("<div />").get(0));
  
  testController["gotPopState"] = function(location, state) {
    start();
    ok(location.indexOf("/test/location") !== -1);
    equals(state.hi, "mom");
    testController["gotPopState"] = $.noop;
    testController.redirectTo(originalLocation);
  };

  stop();
  testController.redirectTo("/test/location", { hi: "mom" });
  
  testController["gotHistory"] = function(location, state) {
    testController["gotHistory"] = $.noop;
    window.history.back();
  };
  
  testController.redirectTo("/test/location2", { hi: "mom2" });
});

});
