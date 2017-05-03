/**
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright Jason Mulligan 2012
 * @license BSD-3 <http://opensource.org/licenses/BSD-3-Clause>
 * @link http://todo.avoidwork.com
 * @module app
 */

(function (global) {
"use strict";

var $, main, footer, all, input, clear, active, completed,
    ENTER_KEY = 13,
    singleton = function () {


/**
 * DataList callback
 * 
 * @param  {Object} obj Element containing an item
 * @return {Undefined}  undefined
 */
var callback = function (obj) {
	var key    = obj.data("key"),
	    record = todo.data.get(key),
	    text   = obj.find("label")[0],
	    del    = obj.find(".destroy")[0],
	    check  = obj.find(".toggle")[0];

	if (record.data.completed) {
		check.attr("checked", true);
		obj.addClass("completed");
	}

	del.on("click", function (e) {
		all.attr("checked", false);
		todo.data.del(key);
	}, "click");

	check.on("click", function (e) {
		var completed = this.attr("checked");

		if (!completed) all.attr("checked", false);
		todo.data.set(key, {completed: completed});
	}, "click");

	text.on("dblclick", function (e) {
		obj.addClass("editing");

		obj.find(".edit")[0].once("blur", function (e) {
			todo.data.set(this.parentNode.data("key"), {text: this.val()});
		}).focus();

		obj.find(".edit")[0].on("keyup", function (e) {
			if (e.keyCode !== ENTER_KEY) return;
			this.un("keyup", "editing");
			todo.data.set(this.parentNode.data("key"), {text: this.val()});
		}, "editing").focus();
	}, "dblclick");
};

/**
 * Application configuration
 *
 * @type {Object}
 */
var config = {
	clear : "Clear completed ({{i}})",
	order : "timestamp"
};

/**
 * Counts the records in various states, updates the DOM accordingly
 * 
 * @return {Undefined} undefined
 */
var count = function () {
	var checked = todo.data.find(true).length,
	    total   = todo.data.total,
	    left    = total.diff(checked);

	active.find("strong")[0].html(left);

	if (left === 1) active.html(active.html().replace("items ", "item "));
	else active.html(active.html().replace("item ", "items "));

	completed.html(config.clear.replace(/\{\{i\}\}/, checked));

	if (total > 0) [footer, main].removeClass("hidden");
	else [footer, main].addClass("hidden");
};

/**
 * Initializes application
 *
 * @type {Function} Initialization
 */
var init = function (abaaso) {
	footer    = $("#footer");
	main      = $("#main");
	all       = $("#toggle-all");
	input     = $("#new-todo");
	clear     = $("#clear-completed");
	active    = $("#todo-count");
	completed = $("#clear-completed");

	routes(abaaso);

	// Input listeners
	input.on("keyup", function (e) { if (e.keyCode === ENTER_KEY) submit(e); }, "submit");

	// "All" toggle
	all.on("click", function () {
		var completed = this.attr("checked");

		todo.data.get().each(function (rec) { todo.data.set(rec.key, {completed: completed}); });
	}, "click");

	// "Clear completed"
	clear.on("click", function () {
		all.attr("checked", false);
		$("ul.list li.completed").each(function (i) {
			todo.data.del(i.data("key"));
		});
	});

	// Clearing input field on successful set
	todo.on("afterDataSet", function () { input.val(""); }, "clear");

	// Creating DataList
	todo.datalist = new $.datalist(main, todo.data, template, {callback: callback, order: config.order});

	// This is being done for TodoMVC CSS classes
	todo.datalist.element.attr("id", "todo-list");

	// Counts
	count();
	todo.datalist.element.on("afterDataListRefresh", function () {
		count();
	});

	// Filter indicator
	$("#filters a").on("click", function (e) {
		$("a.selected")[0].removeClass("selected");
		this.addClass("selected");
	});

	// localStorage retrieval & setup
	try { todo.data.storage(todo.data, "get"); }
	catch (e) { void 0; }
	todo.on("afterDataDelete, afterDataSet", function () {
		this.storage(this, "set");
	}, "storage", todo.data);

	// Loading default route
	$.route.init();
	$("a[href='#!/" + $.route.hash() + "']").addClass("selected");
	return false;
};

/**
 * Hashbang routes to control the application
 * 
 * @return {Function} Function to setup routes
 */
var routes = function (abaaso) {
	abaaso.route.enabled = true;
	abaaso.route.initial = "all";

	$.route.set("all", function () {
		todo.datalist.filter = null;
		todo.datalist.refresh();
	});

	$.route.set("active", function () {
		todo.datalist.filter = {completed: "false"};
		todo.datalist.refresh();
	});

	$.route.set("completed", function () {
		todo.datalist.filter = {completed: "true"};
		todo.datalist.refresh();
	});
};

/**
 * Todo submission handler
 * 
 * @param  {Object} e Event
 * @return {Undefined} undefined
 */
var submit = function (e) {
	var key       = input.data("key") || null,
	    completed = false,
	    timestamp = new Date(),
	    text      = input.val(),
	    data;

	$.stop(e);

	if (text.isEmpty()) return; // blur

	if (key === null) key = $.guid();
	else {
		data      = todo.data.get(key).data;
		completed = data.completed;
		timestamp = data.timestamp;
		todo.once("afterDataSet", function () { input.data("key", null); });
	}

	todo.data.set(key, {text: text, completed: completed, timestamp: timestamp});
};

/**
 * GUI templates
 *
 * @returns {Object} Templates
 */
var template = $("#template").html();

/**
 * DataStore for todo items
 * 
 * @type {Object} DataStore
 */
var todo = $.store({id: "todo"}, null, {key: "id"});

// @constructor
return {init: init};
};

define(["abaaso", "datalist"], function (abaaso) {
	var instance;

	$        = global[abaaso.aliased];
	instance = singleton();

	$.repeat(function () {
		if (/loaded|complete/.test(document.readyState) && typeof $("body")[0] !== "undefined") {
			return instance.init(abaaso);
		}
	});

	return instance;
});
})(this);
