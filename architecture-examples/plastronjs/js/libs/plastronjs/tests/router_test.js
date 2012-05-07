goog.require('mvc.Router');

goog.require('goog.testing.ContinuationTestCase');
goog.require('goog.testing.jsunit');

var router;

var setUp = function() {
    router = new mvc.Router();
};

var testNavigation = function() {
    router.navigate("testing");
    loc = document.location.toString();
    assertEquals(loc.replace(/.*#/,''), "testing");
};

var testRoute = function() {
    var reached = false;
    var a = function(){reached = true;};
    
    waitForEvent(router.history_, goog.history.EventType.NAVIGATE,
        function() {
            assert(reached);
        });
    router.route("test", a);
    router.navigate("test");
};


testCase = new goog.testing.ContinuationTestCase();
testCase.autoDiscoverTests();
G_testRunner.initialize(testCase);
