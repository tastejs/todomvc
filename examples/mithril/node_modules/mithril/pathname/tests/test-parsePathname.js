"use strict"

var o = require("../../ospec/ospec")
var parsePathname = require("../../pathname/parse")

o.spec("parsePathname", function() {
	o("parses empty string", function() {
		var data = parsePathname("")
		o(data).deepEquals({
			path: "/",
			params: {}
		})
	})
	o("parses query at start", function() {
		var data = parsePathname("?a=b&c=d")
		o(data).deepEquals({
			path: "/",
			params: {a: "b", c: "d"}
		})
	})
	o("ignores hash at start", function() {
		var data = parsePathname("#a=b&c=d")
		o(data).deepEquals({
			path: "/",
			params: {}
		})
	})
	o("parses query, ignores hash at start", function() {
		var data = parsePathname("?a=1&b=2#c=3&d=4")
		o(data).deepEquals({
			path: "/",
			params: {a: "1", b: "2"}
		})
	})
	o("parses root", function() {
		var data = parsePathname("/")
		o(data).deepEquals({
			path: "/",
			params: {}
		})
	})
	o("parses root + query at start", function() {
		var data = parsePathname("/?a=b&c=d")
		o(data).deepEquals({
			path: "/",
			params: {a: "b", c: "d"}
		})
	})
	o("parses root, ignores hash at start", function() {
		var data = parsePathname("/#a=b&c=d")
		o(data).deepEquals({
			path: "/",
			params: {}
		})
	})
	o("parses root + query, ignores hash at start", function() {
		var data = parsePathname("/?a=1&b=2#c=3&d=4")
		o(data).deepEquals({
			path: "/",
			params: {a: "1", b: "2"}
		})
	})
	o("parses route", function() {
		var data = parsePathname("/route/foo")
		o(data).deepEquals({
			path: "/route/foo",
			params: {}
		})
	})
	o("parses route + empty query", function() {
		var data = parsePathname("/route/foo?")
		o(data).deepEquals({
			path: "/route/foo",
			params: {}
		})
	})
	o("parses route + empty hash", function() {
		var data = parsePathname("/route/foo?")
		o(data).deepEquals({
			path: "/route/foo",
			params: {}
		})
	})
	o("parses route + empty query + empty hash", function() {
		var data = parsePathname("/route/foo?#")
		o(data).deepEquals({
			path: "/route/foo",
			params: {}
		})
	})
	o("parses route + query", function() {
		var data = parsePathname("/route/foo?a=1&b=2")
		o(data).deepEquals({
			path: "/route/foo",
			params: {a: "1", b: "2"}
		})
	})
	o("parses route + hash", function() {
		var data = parsePathname("/route/foo?c=3&d=4")
		o(data).deepEquals({
			path: "/route/foo",
			params: {c: "3", d: "4"}
		})
	})
	o("parses route + query, ignores hash", function() {
		var data = parsePathname("/route/foo?a=1&b=2#c=3&d=4")
		o(data).deepEquals({
			path: "/route/foo",
			params: {a: "1", b: "2"}
		})
	})
	o("parses route + query, ignores hash with lots of junk slashes", function() {
		var data = parsePathname("//route/////foo//?a=1&b=2#c=3&d=4")
		o(data).deepEquals({
			path: "/route/foo",
			params: {a: "1", b: "2"}
		})
	})
	o("doesn't comprehend protocols", function() {
		var data = parsePathname("https://example.com/foo/bar")
		o(data).deepEquals({
			path: "/https:/example.com/foo/bar",
			params: {}
		})
	})
})
