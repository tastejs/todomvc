"use strict"

var o = require("../../ospec/ospec")
var throttleMocker = require("../../test-utils/throttleMock")

o.spec("throttleMock", function() {
	o("schedules one callback", function() {
		var throttleMock = throttleMocker()
		var spy = o.spy()

		o(throttleMock.queueLength()).equals(0)
		throttleMock.schedule(spy)
		o(throttleMock.queueLength()).equals(1)
		o(spy.callCount).equals(0)
		throttleMock.fire()
		o(throttleMock.queueLength()).equals(0)
		o(spy.callCount).equals(1)
	})
	o("schedules two callbacks", function() {
		var throttleMock = throttleMocker()
		var spy1 = o.spy()
		var spy2 = o.spy()

		o(throttleMock.queueLength()).equals(0)
		throttleMock.schedule(spy1)
		o(throttleMock.queueLength()).equals(1)
		o(spy1.callCount).equals(0)
		o(spy2.callCount).equals(0)
		throttleMock.schedule(spy2)
		o(throttleMock.queueLength()).equals(2)
		o(spy1.callCount).equals(0)
		o(spy2.callCount).equals(0)
		throttleMock.fire()
		o(throttleMock.queueLength()).equals(0)
		o(spy1.callCount).equals(1)
		o(spy2.callCount).equals(1)
	})
})
